/* ============================================================
   מפענח הזמנות מובנה (מצב הדגמה, בלי AI ובלי שרת).
   מבין עברית, אנגלית וערבית: גדלים, בצק, רוטב, תוספות, חצאים, כמויות ומשקאות.
   כשיש מפתח Claude באתר, השרת מפענח עם Claude והקובץ הזה לא בשימוש.
   מחזיר את אותו מבנה כמו השרת: { pizzas, drinks, unavailable, reply }
   ============================================================ */
(() => {
  // synonyms -> menu id. Longer phrases win over shorter ones that overlap them.
  const LEX = {
    size: {
      s: ['אישיות', 'אישית', 'אישי', 'קטנות', 'קטנה', 'קטן', 'personal', 'small', 'شخصية', 'صغيرة'],
      m: ['משפחתיות', 'משפחתית', 'משפחתי', 'בינוניות', 'בינונית', 'בינוני', 'family', 'medium', 'عائلية', 'وسط'],
      l: ['ענקיות', 'ענקית', 'גדולות', 'גדולה', 'גדול', 'ענק', 'large', 'giant', 'big', 'xl', 'عملاقة', 'كبيرة'],
    },
    crust: {
      thin: ['בצק דק', 'דקה', 'דק', 'thin', 'رقيقة'],
      gf: ['ללא גלוטן', 'בלי גלוטן', 'gluten free', 'gluten-free', 'خالية من الغلوتين', 'بدون غلوتين'],
    },
    sauce: {
      cream: ['רוטב שמנת', 'שמנת', 'לבנה', 'רוטב לבן', 'לבן', 'cream', 'white', 'كريمة', 'بيضاء'],
      none: ['בלי רוטב', 'ללא רוטב', 'no sauce', 'without sauce', 'بدون صلصة'],
      tomato: ['רוטב עגבניות', 'tomato sauce', 'red sauce', 'صلصة طماطم', 'صلصة حمراء'],
    },
    top: {
      mozz: ['מוצרלה', 'אקסטרה גבינה', 'תוספת גבינה', 'extra cheese', 'mozzarella', 'cheese', 'موتزاريلا', 'جبنة إضافية'],
      golive: ['זיתים ירוקים', 'זית ירוק', 'green olives', 'green olive', 'زيتون أخضر'],
      bolive: ['זיתים שחורים', 'זית שחור', 'זיתים', 'זית', 'black olives', 'black olive', 'olives', 'olive', 'زيتون أسود', 'زيتون'],
      mush: ['פטריות', 'פטריה', 'פטרייה', 'mushrooms', 'mushroom', 'فطر', 'مشروم'],
      onion: ['בצל', 'onions', 'onion', 'بصل'],
      corn: ['תירס', 'corn', 'ذرة'],
      tomato: ['עגבניות', 'עגבנייה', 'עגבניה', 'tomatoes', 'tomato', 'طماطم', 'بندورة'],
      chili: ['פלפל חריף', 'חריף', "ג'לפניו", 'גלפניו', 'jalapeno', 'jalapeño', 'hot pepper', 'chili', 'فلفل حار', 'حار'],
      tuna: ['טונה', 'tuna', 'تونة', 'تونا'],
      feta: ['בולגרית', 'פטה', 'גבינה לבנה', 'feta', 'bulgarian', 'جبنة بلغارية', 'فيتا'],
    },
    drink: {
      zero: ['קולה זירו', 'קולה דיאט', 'דיאט קולה', 'זירו', 'דיאט', 'coke zero', 'cola zero', 'diet coke', 'diet cola', 'zero', 'diet', 'كولا زيرو', 'زيرو', 'دايت'],
      cola: ['קוקה קולה', 'קוקה', 'קולה', 'קולות', 'coca cola', 'coca-cola', 'cokes', 'coke', 'cola', 'كوكا كولا', 'كولا'],
      sprite: ['ספרייט', 'sprite', 'سبرايت'],
      fanta: ['פאנטה', 'fanta', 'فانتا'],
      fuze: ['פיוז טי', 'פיוז', 'נסטי', 'תה קר', 'fuze tea', 'fuze', 'iced tea', 'ice tea', 'فيوز', 'شاي مثلج'],
      grape: ['ענבים', 'ספרינג', 'grape', 'spring', 'عنب'],
      water: ['מים', 'בקבוק מים', 'water', 'مياه', 'ماء', 'مي'],
      gold: ['גולדסטאר', 'גולד סטאר', 'בירות', 'בירה', 'goldstar', 'beer', 'غولدستار', 'بيرة'],
      carl: ['קרלסברג', 'carlsberg', 'كارلسبرغ'],
    },
    pizza: ['פיצות', 'פיצה', 'מגש', 'pizzas', 'pizza', 'pie', 'بيتزا'],
    half: ['חצי', 'half', 'نصف', 'نص'],
    all: ['כל התוספות', 'עם הכל', 'הכל', 'everything', 'all toppings', 'the works', 'كل الإضافات', 'كل شي', 'كل شيء'],
    except: ['חוץ מ', 'פרט ל', 'except', 'but no', 'ما عدا', 'عدا', 'إلا'],
    with: [' עם ', ' with ', ' مع '],
    not: ['בלי', 'ללא', 'without', 'no', 'بدون', 'بلا'],
    nope: ['פפרוני', 'סלמי', 'נקניק', 'בשר', 'עוף', 'אננס', 'בייקון', 'נקניקיות', 'pepperoni', 'salami', 'sausage', 'ham', 'bacon', 'chicken', 'meat', 'pineapple', 'بيبروني', 'سلامي', 'لحم', 'دجاج', 'أناناس', 'نقانق'],
    sep: [',', '،', '.', ';', '+', '\n', ' ועוד ', ' and ', ' plus ', ' و'],
  };
  const NUM = { 'אחת': 1, 'אחד': 1, 'שתי': 2, 'שני': 2, 'שתיים': 2, 'שניים': 2, 'שלוש': 3, 'שלושה': 3, 'ארבע': 4, 'ארבעה': 4, 'חמש': 5, 'חמישה': 5, 'שש': 6, 'one': 1, 'a': 1, 'an': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'واحد': 1, 'واحدة': 1, 'اثنين': 2, 'اثنتين': 2, 'ثلاث': 3, 'ثلاثة': 3, 'أربع': 4, 'أربعة': 4, 'خمس': 5, 'خمسة': 5 };

  const norm = (s) => ' ' + s.toLowerCase().replace(/[֑-ׇ]/g, '').replace(/[״"]/g, '').replace(/\s+/g, ' ') + ' ';
  const isLetter = (ch) => /[a-zא-תء-ي']/.test(ch || ''); // letters only, not Arabic punctuation
  // Hebrew and Arabic glue short prefixes onto words (ו, ה, ב, ל, ש, עם... / و, ب, ال); allow them in front of a match
  const PREFIX = /^(ו|ה|ב|ל|ש|מ|וה|וב|ול|ומ|מה|עם|و|ب|ال|وال|بال)$/;

  function findAll(text) {
    const hits = [];
    const add = (kind, id, words) => words.forEach((w) => {
      const needle = w.toLowerCase();
      let i = text.indexOf(needle);
      while (i !== -1) {
        const end = i + needle.length;
        const okEnd = !isLetter(text[end]) || (/^[א-ת]/.test(needle) && /^(ים|ות|ה)/.test(text.slice(end))) || (/^[a-z]/.test(needle) && /^(s|es)(?![a-z])/.test(text.slice(end)));
        let start = i;
        while (start > 0 && isLetter(text[start - 1])) start--;
        const okStart = start === i || PREFIX.test(text.slice(start, i)) || kind === 'sep';
        if ((okStart && (okEnd || kind === 'except')) || kind === 'sep') hits.push({ kind, id, pos: i, len: needle.length, word: w });
        i = text.indexOf(needle, i + 1);
      }
    });
    Object.entries(LEX.size).forEach(([id, w]) => add('size', id, w));
    Object.entries(LEX.crust).forEach(([id, w]) => add('crust', id, w));
    Object.entries(LEX.sauce).forEach(([id, w]) => add('sauce', id, w));
    Object.entries(LEX.top).forEach(([id, w]) => add('top', id, w));
    Object.entries(LEX.drink).forEach(([id, w]) => add('drink', id, w));
    add('pizza', 'pizza', LEX.pizza); add('half', 'half', LEX.half); add('all', 'all', LEX.all); add('except', 'except', LEX.except); add('sep', 'with', LEX.with); add('not', 'not', LEX.not); add('nope', 'nope', LEX.nope); add('sep', 'sep', LEX.sep);
    // numbers: digits and number words
    text.replace(/\d+/g, (m, p) => hits.push({ kind: 'num', n: +m, pos: p, len: m.length }));
    Object.entries(NUM).forEach(([w, n]) => { const re = new RegExp(`(^|[^a-zא-תء-ي])(ו|و)?(${w})(?=[^a-zא-תء-ي]|$)`, 'g'); let m; while ((m = re.exec(text))) hits.push({ kind: 'num', n, pos: m.index + m[1].length + (m[2] || '').length, len: w.length }); });
    // longest match wins where hits overlap; "no sauce" beats "no", "black olives" beats "olives"
    hits.sort((a, b) => b.len - a.len || a.pos - b.pos);
    const taken = new Array(text.length).fill(false), out = [];
    for (const h of hits) {
      let free = true;
      for (let k = h.pos; k < h.pos + h.len; k++) if (taken[k]) { free = false; break; }
      if (!free) continue;
      for (let k = h.pos; k < h.pos + h.len; k++) taken[k] = true;
      out.push(h);
    }
    return out.sort((a, b) => a.pos - b.pos);
  }

  function parse(raw, C, t) {
    const text = norm(raw), ev = findAll(text);
    const pizzas = [], drinks = {}, unavailable = [];
    let cur = null, count = null, negate = false, except = false, half = 0, leftDone = false, prev = '';
    const newPizza = (keepHalf) => { cur = { size: 'm', crust: C.crusts[0].id, sauce: C.sauces[0].id, tops: {}, n: 1, sized: false }; pizzas.push(cur); if (!keepHalf) { half = 0; leftDone = false; } return cur; };
    // an order that starts straight with toppings ("half olives half mushrooms") creates the pizza without losing the half
    const ensure = () => cur || newPizza(true);
    const busy = (p) => !!p && (p.sized || Object.keys(p.tops).length > 0 || p.sauce !== C.sauces[0].id || p.crust !== C.crusts[0].id);
    const takeCount = () => { if (count) { cur.n = count; count = null; } };

    for (let i = 0; i < ev.length; i++) {
      const e = ev[i], next = ev[i + 1];
      switch (e.kind) {
        case 'num': count = Math.max(1, Math.min(10, e.n)); break;
        // after both halves are filled, "with X" or a comma means X goes on the whole pizza again
        case 'sep': negate = false; except = false; if (leftDone) { half = 0; leftDone = false; } break;
        case 'not': negate = true; break;
        // "with everything" puts every topping on; "except X" then takes X off again
        case 'all': C.toppings.forEach((x) => (ensure().tops[x.id] = 'full')); break;
        case 'except': except = true; break;
        case 'half': half = half === 0 ? 1 : 2; break;
        // a new pizza starts at a second size word, or at "pizza" after a count / separator once the current one has content
        case 'pizza': if (!cur || (busy(cur) && (count || prev === 'sep'))) newPizza(); takeCount(); break;
        case 'size': if (!cur || cur.sized) newPizza(); cur.size = e.id; cur.sized = true; takeCount(); break;
        case 'crust': ensure().crust = e.id; negate = false; break;
        case 'sauce': ensure().sauce = negate && e.id !== 'none' ? 'none' : e.id; negate = false; break;
        case 'top': {
          // "without onion and olives": the "without" covers every topping until a comma or "with"
          if (negate || except) { if (cur) delete cur.tops[e.id]; break; }
          ensure().tops[e.id] = half === 1 ? 'right' : half === 2 ? 'left' : 'full';
          if (half === 2) leftDone = true;
          count = null;
          break;
        }
        case 'drink': {
          let q = count;
          // a number right after a drink is its quantity only in Arabic word order ("كولا اثنتين")
          if (!q && next && next.kind === 'num' && /[ء-ي]/.test(e.word) && next.pos - (e.pos + e.len) <= 2) { q = next.n; i++; }
          drinks[e.id] = Math.min(20, (drinks[e.id] || 0) + (q || 1));
          count = null; negate = false;
          break;
        }
        case 'nope': if (!negate) unavailable.push(e.word); negate = false; break;
      }
      prev = e.kind;
    }
    // expand "two family pizzas" into two entries
    const out = [];
    pizzas.forEach((p) => { for (let k = 0; k < (p.n || 1); k++) out.push({ size: p.size, crust: p.crust, sauce: p.sauce, tops: { ...p.tops } }); });
    const result = { pizzas: out.slice(0, 10), drinks, unavailable: [...new Set(unavailable)] };
    if (!result.pizzas.length && !Object.keys(drinks).length) return null;
    result.reply = describe(result, C, t);
    return result;
  }

  function describe(o, C, t) {
    const name = (arr, id) => (arr.find((x) => x.id === id) || {}).name || id;
    const half = { right: t('place.right'), left: t('place.left') };
    const parts = o.pizzas.map((p) => {
      let s = t('pizza', { size: name(C.sizes, p.size) });
      if (p.sauce !== 'tomato') s += ' ' + name(C.sauces, p.sauce);
      if (p.crust !== C.crusts[0].id) s += ' · ' + name(C.crusts, p.crust);
      const tops = Object.entries(p.tops).map(([id, pl]) => name(C.toppings, id) + (pl === 'full' ? '' : ` (${half[pl]})`));
      if (tops.length) s += ': ' + tops.join(', ');
      return s;
    });
    Object.entries(o.drinks).forEach(([id, q]) => parts.push(`${q}× ${name(C.drinks, id)}`));
    return t('demo.added', { list: parts.join(' · ') });
  }

  window.demoParse = (text) => parse(text, window.CONFIG, window.t);
})();
