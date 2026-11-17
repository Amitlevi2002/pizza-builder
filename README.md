# Pizza Builder — photo-real pizza ordering with AI

**Live demo: https://pizza-builder-dun.vercel.app** · Kitchen screen: https://pizza-builder-dun.vercel.app/orders.html

Try typing in the smart-order box: `משפחתית חצי זיתים חצי פטריות, ושתי קולות` or `large white pizza with corn and a sprite`.

A pizzeria ordering site where customers **build their pizza on a real cardboard box**, watch it go into the oven, and can also **just type (or say) their order** in Hebrew, English or Arabic.

Built as a portfolio project with an AI-assisted workflow (Claude Code), from two reference videos to a working product.

---

## What it does

| | |
|---|---|
| **Photo-real builder** | Starts as raw dough → the sauce spreads on → fresh mozzarella → toppings drop from real-photo trays → 3-second oven → baked pizza. Every layer is a real photograph, not a drawing. |
| **Smart ordering (AI)** | "Family size, half olives half mushrooms, and two Cokes" → the pizza builds itself in front of you. Works in Hebrew, English and Arabic, and by voice. |
| **Half & half** | Any topping on the whole pizza, the right half or the left half — half price. |
| **Edit before it ships** | Edit any pizza or drink before paying. After paying, change or cancel for 5 minutes until the courier leaves. |
| **Kitchen screen** | `orders.html` shows incoming orders live, with status and CSV export to a spreadsheet. |
| **WhatsApp** | One tap sends the full order to the pizzeria on WhatsApp. |
| **3 languages** | Hebrew and Arabic right-to-left, English left-to-right. Switching keeps the order. |
| **Accessible** | Israeli Standard IS 5568 / WCAG 2.0 AA: keyboard flow, screen-reader descriptions, accessibility menu and statement. |

## Demo first, real when you want

Everything runs as a demo with **no accounts and no cost** — and each part switches to "real" with one setting:

| Feature | Demo (default) | Real |
|---|---|---|
| Smart ordering | Built-in multilingual parser (`demo-parse.js`, 28 tested orders) | Add `ANTHROPIC_API_KEY` to `.env` → Claude reads the order (`ai-order.js`) |
| Order automation | Orders saved in the browser, shown on the kitchen screen | Set `orderWebhook` in `config.js` → every order goes to Make / Zapier / n8n → Google Sheets, WhatsApp, email |
| Payment | Demo form (card, Apple Pay, Google Pay, Bit, cash) | Plug in a payment provider |

The page asks the server once whether Claude is on; with no key (or no server at all, e.g. static hosting) it uses the built-in parser, so the demo never breaks.

## How the AI ordering works

1. The customer's text goes to `/api/order-ai` on the server — the API key never reaches the browser.
2. The server sends it to Claude together with the menu, read from the same `config.js` the site uses, so a new menu item is understood automatically.
3. Claude returns **structured JSON** (fixed schema: pizzas, toppings with halves, drinks, unavailable items, a short reply in the customer's language).
4. The server validates every id and quantity, and the site builds the pizza live.
5. Guard rails: 500-character limit, 8 requests per minute per visitor, refusal and error handling.

## Interesting problems solved

- **Real photos instead of drawings.** Stock photos were cut out (background removal), straightened to perfect circles, and recoloured per state. Raw vs. baked crust, tomato vs. cream sauce and the topping pieces all come from real photographs (`img/`).
- **Same pizza, three sauces, two states.** The dough, sauce and cheese are separate photo layers, so changing the sauce visibly changes the pizza, and baking crossfades into the real baked photo.
- **RTL + LTR in one codebase.** Logical CSS properties everywhere, a fixed physical order for "right/left half", fonts that actually have Arabic letters.
- **A parser for three languages without AI.** Handles Hebrew prefixes (ו, ה, ב, מ…), plurals, Arabic word order ("كولا اثنتين"), "everything except", "without X and Y", multiple pizzas in one sentence.

## Run it

```bash
npm install
npm start          # http://localhost:4173
npm test           # 28 order phrases in Hebrew, English and Arabic
```

Optional: copy `.env.example` to `.env` and add an Anthropic API key to switch smart ordering to Claude.

Change the pizzeria name, prices, menu, phone, WhatsApp number and webhook in **`config.js`**; all texts are in **`i18n.js`**.

## Files

| File | |
|---|---|
| `index.html`, `styles.css`, `app.js` | The site: builder, receipt, drinks carousel, checkout, order editing |
| `i18n.js` | Hebrew / English / Arabic |
| `a11y.js` | Accessibility menu and statement |
| `demo-parse.js` | Built-in multilingual order parser (demo mode) |
| `ai-order.js`, `serve.js` | Server: Claude ordering endpoint, static files |
| `orders.html` | Kitchen screen |
| `tests/` | Parser tests |
| `CREDITS.txt` | Photo sources and licences |

## Credits

Product and food photos: Unsplash, Open Food Facts (CC BY-SA), Wikimedia Commons (CC BY 2.0) — see `CREDITS.txt`. Brand logos belong to their owners. This is a demo: no real orders are placed and nothing is charged.
