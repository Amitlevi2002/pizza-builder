// node parse_test.js <siteDir>  -> runs order phrases through demo-parse.js and checks the result
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..');
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'config.js'), 'utf8'), ctx);
ctx.window.t = (k, v) => (k === 'demo.added' ? 'ADDED: ' + v.list : k === 'pizza' ? v.size : k);
vm.runInContext(fs.readFileSync(path.join(dir, 'demo-parse.js'), 'utf8'), ctx);
const P = ctx.window.demoParse;

// [phrase, expected]  expected: pizzas as "size/sauce/crust:top=place,..." and drinks "id=q"
const cases = [
  ['משפחתית חצי זיתים חצי פטריות, ושתי קולות', ['m/tomato/reg:bolive=right,mush=left'], 'cola=2'],
  ['ענקית פטריות ומשפחתית לבנה עם תירס', ['l/tomato/reg:mush=full', 'm/cream/reg:corn=full'], ''],
  ['פיצה אישית עם טונה ובצל וספרייט', ['s/tomato/reg:onion=full,tuna=full'], 'sprite=1'],
  ['2 פיצות משפחתיות עם זיתים ירוקים', ['m/tomato/reg:golive=full', 'm/tomato/reg:golive=full'], ''],
  ['שתי פיצות ענקיות בלי רוטב עם בולגרית', ['l/none/reg:feta=full', 'l/none/reg:feta=full'], ''],
  ['משפחתית בצק דק עם פלפל חריף ועגבניות, 3 מים', ['m/tomato/thin:tomato=full,chili=full'], 'water=3'],
  ['פיצה עם פפרוני ופטריות', ['m/tomato/reg:mush=full'], '', ['פפרוני']],
  ['אני רוצה פיצה עם הכל בלי בצל וזיתים שחורים', ['m/tomato/reg:chili=full,corn=full,feta=full,golive=full,mozz=full,mush=full,tomato=full,tuna=full'], ''],
  ['ענקית עם הכל חוץ מטונה ופלפל חריף', ['l/tomato/reg:bolive=full,corn=full,feta=full,golive=full,mozz=full,mush=full,onion=full,tomato=full'], ''],
  ['פיצה בלי בצל, עם זיתים', ['m/tomato/reg:bolive=full'], ''],
  ['large with everything except tuna', ['l/tomato/reg:bolive=full,chili=full,corn=full,feta=full,golive=full,mozz=full,mush=full,onion=full,tomato=full'], ''],
  ['medium with extra cheese and onions, plus two diet cokes', ['m/tomato/reg:mozz=full,onion=full'], 'zero=2'],
  ['מגש ענק לבן עם פטריות ובצל, ועוד מגש אישי בלי רוטב', ['l/cream/reg:mush=full,onion=full', 's/none/reg:'], ''],
  ['פיצה משפחתית עם זיתים וגם פיצה אישית עם תירס', ['m/tomato/reg:bolive=full', 's/tomato/reg:corn=full'], ''],
  ['3 קולות ו-2 ספרייט', [], 'cola=3,sprite=2'],
  ['ענקית חצי זיתים חצי פטריות עם תירס', ['l/tomato/reg:bolive=right,corn=full,mush=left'], ''],
  ['חצי עם זיתים חצי עם פטריות', ['m/tomato/reg:bolive=right,mush=left'], ''],
  ['أريد بيتزا عائلية مع فطر وزيتون أخضر وبيرة', ['m/tomato/reg:golive=full,mush=full'], 'gold=1'],
  ['רק קולה זירו ושתי בירות', [], 'zero=1,gold=2'],
  ['ענקית ללא גלוטן עם מוצרלה', ['l/tomato/gf:mozz=full'], ''],
  ['family pizza half olives half mushrooms and two cokes', ['m/tomato/reg:bolive=right,mush=left'], 'cola=2'],
  ['large white pizza with corn and a sprite', ['l/cream/reg:corn=full'], 'sprite=1'],
  ['2 small pizzas with tuna, no onion, and 3 waters', ['s/tomato/reg:tuna=full', 's/tomato/reg:tuna=full'], 'water=3'],
  ['one large thin crust with jalapeno and feta, a coke zero', ['l/tomato/thin:chili=full,feta=full'], 'zero=1'],
  ['pizza with pepperoni and pineapple', ['m/tomato/reg:'], '', ['pepperoni', 'pineapple']],
  ['بيتزا عائلية نصف زيتون نصف فطر، وكولا اثنتين', ['m/tomato/reg:bolive=right,mush=left'], 'cola=2'],
  ['بيتزا كبيرة بيضاء مع ذرة وسبرايت', ['l/cream/reg:corn=full'], 'sprite=1'],
  ['بيتزا صغيرة مع تونة وبصل', ['s/tomato/reg:onion=full,tuna=full'], ''],
];
const show = (r) => r ? r.pizzas.map((p) => `${p.size}/${p.sauce}/${p.crust}:` + Object.keys(p.tops).sort().map((k) => `${k}=${p.tops[k]}`).join(',')) : [];
const canon = (arr) => arr.map((s) => { const [h, t] = s.split(':'); return h + ':' + (t ? t.split(',').filter(Boolean).sort().join(',') : ''); });
let pass = 0;
for (const [text, pz, dr, un] of cases) {
  const r = P(text);
  const gotP = canon(show(r)), expP = canon(pz);
  const gotD = r ? Object.entries(r.drinks).map(([k, v]) => `${k}=${v}`).sort().join(',') : '';
  const expD = dr.split(',').filter(Boolean).sort().join(',');
  const okU = !un || (r && un.every((u) => r.unavailable.includes(u)));
  const ok = JSON.stringify(gotP) === JSON.stringify(expP) && gotD === expD && okU;
  if (ok) pass++;
  console.log(ok ? 'PASS' : 'FAIL', '|', text);
  if (!ok) console.log('   got ', JSON.stringify(gotP), gotD, r && r.unavailable, '\n   want', JSON.stringify(expP), expD, un || '');
}
console.log(`\n${pass}/${cases.length} passed`);

if (pass !== cases.length) process.exit(1);
