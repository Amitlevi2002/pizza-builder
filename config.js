/* ============================================================
   כל מה שמשנים באתר נמצא כאן: שם, לוגו, מחירים, תוספות, משקאות.
   ============================================================ */
window.CONFIG = {
  name: 'פיצה עמית',                // שם זמני - להחליף לשם הפיצרייה
  tagline: 'בצק טרי. תנור לוהט. בדיוק כמו שאתם אוהבים.',
  logo: '',                         // נתיב לקובץ לוגו, למשל 'logo.png' (ריק = לוגו טקסט)

  phone: '050-0000000',
  address: 'הרחוב הראשי 1, העיר',
  kosher: 'כשר חלבי',
  hours: [
    ['ראשון עד חמישי', '11:00 – 23:00'],
    ['שישי', '10:00 – 15:00'],
    ['מוצאי שבת', 'שעה אחרי צאת השבת – 00:00'],
  ],

  // נגישות: פרטי רכז/ת הנגישות שמופיעים בהצהרת הנגישות (חובה לפי החוק - להחליף לפרטים אמיתיים)
  a11y: { name: 'ישראל ישראלי', phone: '050-0000000', email: 'access@example.com', updated: '16.11.2026' },

  // אוטומציה להזמנות:
  // whatsapp = מספר הוואטסאפ של הפיצרייה (בפורמט בינלאומי, בלי + ובלי 0 בהתחלה)
  // orderWebhook = כתובת Webhook של Make / Zapier / n8n / Google Apps Script. ריק = מצב הדגמה (ההזמנות נשמרות רק בדפדפן)
  whatsapp: '972500000000',
  orderWebhook: '',

  deliveryFee: 15,
  editWindowMin: 5,                 // כמה דקות אחרי ההזמנה אפשר עוד לשנות או לבטל (עד שהשליח יוצא)
  deliveryTime: '35–45 דקות',
  pickupTime: '15–20 דקות',

  // topping = מחיר תוספת על פיצה שלמה בגודל הזה (חצי פיצה = חצי מחיר)
  sizes: [
    { id: 's', name: 'אישית',   cm: 26, price: 35, topping: 4,  scale: 0.8 },
    { id: 'm', name: 'משפחתית', cm: 36, price: 55, topping: 7,  scale: 0.9 },
    { id: 'l', name: 'ענקית',   cm: 46, price: 72, topping: 10, scale: 1 },
  ],
  crusts: [
    { id: 'reg',  name: 'רגיל',       price: 0 },
    { id: 'thin', name: 'דק',         price: 0 },
    { id: 'gf',   name: 'ללא גלוטן',  price: 10 },
  ],
  sauces: [
    { id: 'tomato', name: 'עגבניות' },
    { id: 'cream',  name: 'שמנת' },
    { id: 'none',   name: 'בלי רוטב' },
  ],

  // imgs = קובצי החתיכות בתיקיית img, size = גודל חתיכה באחוזים מרוחב הפיצה, count = כמה חתיכות על פיצה שלמה.
  toppings: [
    { id: 'mozz',   name: 'מוצרלה אקסטרה', imgs: ['p_mozz1', 'p_mozz2', 'p_mozz3'], size: 13, count: 9 },
    { id: 'golive', name: 'זיתים ירוקים',  imgs: ['p_golive1', 'p_golive2', 'p_golive3'], size: 5.5, count: 18 },
    { id: 'bolive', name: 'זיתים שחורים',  imgs: ['p_bolive1', 'p_bolive2', 'p_bolive3'], size: 5.5, count: 18 },
    { id: 'mush',   name: 'פטריות',        imgs: ['p_mush1', 'p_mush2'], size: 12, count: 12 },
    { id: 'onion',  name: 'בצל',           imgs: ['p_onion1', 'p_onion2'], size: 11, count: 11 },
    { id: 'corn',   name: 'תירס',          imgs: ['p_corn1', 'p_corn2', 'p_corn3', 'p_corn4'], size: 3, count: 40 },
    { id: 'tomato', name: 'עגבניות',       imgs: ['p_tomato1'], size: 13, count: 8 },
    { id: 'chili',  name: 'פלפל חריף',     imgs: ['p_chili2', 'p_chili3'], size: 6, count: 15 },
    { id: 'tuna',   name: 'טונה',          imgs: ['p_tuna1', 'p_tuna2', 'p_tuna3'], size: 8.5, count: 13 },
    { id: 'feta',   name: 'בולגרית',       imgs: ['p_feta2', 'p_feta3'], size: 6.5, count: 15 },
  ],

  drinks: [
    { id: 'cola', img: 'd_cola',    name: 'קולה',       sub: 'פחית 330 מ״ל, קרה מהמקרר',       price: 8,  color: '#d3121c', glow: '#e01522' },
    { id: 'zero', img: 'd_zero',    name: 'קולה זירו',  sub: 'פחית 330 מ״ל, בלי סוכר',          price: 8,  color: '#161616', glow: '#a3121a' },
    { id: 'sprite', img: 'd_sprite',  name: 'ספרייט',     sub: 'פחית 330 מ״ל, לימון-ליים',        price: 8,  color: '#0f9d48', glow: '#12b955' },
    { id: 'fanta', img: 'd_fanta',   name: 'פאנטה',      sub: 'פחית 330 מ״ל, תפוזים',            price: 8,  color: '#ff7a00', glow: '#ff8a1a' },
    { id: 'fuze', img: 'd_fuze',    name: 'פיוז טי',    sub: 'תה קר אפרסק, בקבוק',            price: 9,  color: '#d98a2b', glow: '#e9a23f' },
    { id: 'grape', img: 'd_grape',   name: 'ספרינג ענבים', sub: 'משקה ענבים, פחית 330 מ״ל',        price: 8,  color: '#6a2fb5', glow: '#8a3fe0' },
    { id: 'water', img: 'd_water',   name: 'מים',        sub: 'מים מינרליים, בקבוק 500 מ״ל',     price: 6,  color: '#2f9be0', glow: '#39a9f0', bottle: true },
    { id: 'gold', img: 'd_gold',    name: 'גולדסטאר',   sub: 'פחית 330 מ״ל · מגיל 18 בלבד',    price: 14, color: '#b8860f', glow: '#d9a520', adult: true },
    { id: 'carl', img: 'd_carl',    name: 'קרלסברג',    sub: 'בירה, 330 מ״ל · מגיל 18 בלבד',    price: 14, color: '#0b6b3a', glow: '#11924f', adult: true },
  ],

  faq: [
    ['כמה זמן לוקח משלוח?', 'בדרך כלל 35–45 דקות. בשעות עמוסות זה יכול לקחת קצת יותר, ונעדכן אתכם בטלפון.'],
    ['אפשר לשים תוספת רק על חצי פיצה?', 'כן. בוחרים "חצי ימין" או "חצי שמאל" לפני שלוחצים על התוספת, ומשלמים חצי מחיר.'],
    ['יש בצק ללא גלוטן?', 'כן, בתוספת תשלום. הבצק נאפה באותו תנור, ולכן אינו מתאים לחולי צליאק.'],
    ['לאן אתם מגיעים?', 'לכל העיר והיישובים הסמוכים. לא בטוחים? התקשרו ונבדוק.'],
    ['איך משלמים?', 'באשראי, Apple Pay, Google Pay, Bit או במזומן לשליח.'],
  ],
};
