/* ============================================================
   הזמנה בשפה חופשית: Claude הופך טקסט ("משפחתית חצי זיתים, שתי קולות")
   להזמנה מובנית לפי התפריט שב-config.js.
   משמש גם את השרת המקומי (serve.js) וגם את פונקציית האירוח (api/order-ai.js).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Anthropic = require('@anthropic-ai/sdk').default;

const MODEL = 'claude-opus-5-5';
const MAX_TEXT = 500;

// the menu comes from the same config.js the site uses, so prices and items never drift apart
function loadMenu() {
  const code = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { timeout: 500 });
  return sandbox.window.CONFIG;
}

function schemaFor(C) {
  const ids = (arr) => arr.map((x) => x.id);
  return {
    type: 'object',
    additionalProperties: false,
    required: ['pizzas', 'drinks', 'unavailable', 'reply'],
    properties: {
      pizzas: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['size', 'crust', 'sauce', 'toppings'],
          properties: {
            size: { type: 'string', enum: ids(C.sizes) },
            crust: { type: 'string', enum: ids(C.crusts) },
            sauce: { type: 'string', enum: ids(C.sauces) },
            toppings: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'place'],
                properties: {
                  id: { type: 'string', enum: ids(C.toppings) },
                  place: { type: 'string', enum: ['full', 'right', 'left'] },
                },
              },
            },
          },
        },
      },
      drinks: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'qty'],
          properties: { id: { type: 'string', enum: ids(C.drinks) }, qty: { type: 'integer' } },
        },
      },
      unavailable: { type: 'array', items: { type: 'string' } },
      reply: { type: 'string' },
    },
  };
}

function systemPrompt(C) {
  const list = (arr, extra) => arr.map((x) => `- ${x.id}: ${x.name}${extra ? extra(x) : ''}`).join('\n');
  return `You take pizza orders for "${C.name}", a kosher dairy pizzeria in Israel. Customers write in Hebrew, English, Arabic or a mix, often casually or with typos. Turn the message into an order that uses only the menu below.

Menu (id: Hebrew name):
Sizes:
${list(C.sizes, (x) => ` (${x.cm} cm)`)}
Crusts:
${list(C.crusts)}
Sauces:
${list(C.sauces)}
Toppings:
${list(C.toppings)}
Drinks:
${list(C.drinks, (x) => ` (${x.sub})`)}

How to fill the order:
- Defaults when the customer doesn't say: size "m", crust "reg", sauce "tomato". "White pizza" or "cream" means sauce "cream".
- A topping is on the whole pizza ("full") unless the customer names a half. "Half X half Y" means X on "right" and Y on "left".
- "Olives" without a colour means black olives; "cheese" or "extra cheese" means extra mozzarella; "Bulgarian", "feta" and "white cheese" mean the Bulgarian cheese topping; "jalapeño" means hot pepper; "cola" or "coke" means regular cola, unless they say zero or diet.
- Each pizza the customer asks for is its own entry. "Two family pizzas with mushrooms" is two entries.
- Drinks get a quantity; "a cola" is 1.
- Anything that is not on this menu (for example meat, pepperoni, pineapple, a drink we don't sell) goes into "unavailable" as the customer wrote it, and is not added to the order. Never invent menu items.
- If the message is not a food order at all, return empty pizzas and drinks and say in the reply what you can help with.
- "reply": one or two short, friendly sentences in the customer's language that confirm what you added and mention anything unavailable. Don't list prices.`;
}

// keep only valid ids and sane quantities, whatever comes back
function clean(order, C) {
  const has = (arr, id) => arr.some((x) => x.id === id);
  const pizzas = (order.pizzas || []).slice(0, 10).map((p) => {
    const tops = {};
    (p.toppings || []).forEach((t) => { if (has(C.toppings, t.id) && ['full', 'right', 'left'].includes(t.place)) tops[t.id] = t.place; });
    return {
      size: has(C.sizes, p.size) ? p.size : 'm',
      crust: has(C.crusts, p.crust) ? p.crust : C.crusts[0].id,
      sauce: has(C.sauces, p.sauce) ? p.sauce : C.sauces[0].id,
      tops,
    };
  });
  const drinks = {};
  (order.drinks || []).forEach((d) => { if (has(C.drinks, d.id)) drinks[d.id] = Math.max(1, Math.min(20, (drinks[d.id] || 0) + (parseInt(d.qty, 10) || 1))); });
  return { pizzas, drinks, unavailable: (order.unavailable || []).slice(0, 10).map(String), reply: String(order.reply || '').slice(0, 400) };
}

let client = null;
const configured = () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

// returns { status, body }
async function handleOrderText(input) {
  const text = String((input && input.text) || '').trim().slice(0, MAX_TEXT);
  if (!text) return { status: 400, body: { error: 'empty' } };
  if (!configured()) return { status: 503, body: { error: 'not_configured' } };
  const C = loadMenu();
  client = client || new Anthropic();
  try {
    const res = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: schemaFor(C) } },
      system: systemPrompt(C),
      messages: [{ role: 'user', content: text }],
    });
    if (res.stop_reason === 'refusal') return { status: 422, body: { error: 'refused' } };
    const block = res.content.find((b) => b.type === 'text');
    if (!block) return { status: 502, body: { error: 'no_output' } };
    return { status: 200, body: clean(JSON.parse(block.text), C) };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { status: 503, body: { error: 'not_configured' } };
    if (err instanceof Anthropic.RateLimitError) return { status: 429, body: { error: 'busy' } };
    if (err instanceof Anthropic.APIError) { console.error('Claude API error', err.status, err.message); return { status: 502, body: { error: 'upstream' } }; }
    if (err instanceof SyntaxError) return { status: 502, body: { error: 'bad_output' } };
    console.error(err);
    return { status: 500, body: { error: 'server' } };
  }
}

// small per-visitor limit so the endpoint can't run up a bill
const hits = new Map();
function allow(ip, perMinute = 8) {
  const now = Date.now(), list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (list.length >= perMinute) { hits.set(ip, list); return false; }
  list.push(now); hits.set(ip, list);
  return true;
}

module.exports = { handleOrderText, allow, configured, MAX_TEXT };
