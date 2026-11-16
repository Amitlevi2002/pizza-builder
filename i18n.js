/* ============================================================
   שפות האתר: עברית, English, العربية
   כל טקסט באתר מגיע מכאן. כדי לתקן תרגום - משנים כאן.
   ============================================================ */
(() => {
  const LANGS = { he: { label: 'עב', name: 'עברית', dir: 'rtl' }, en: { label: 'EN', name: 'English', dir: 'ltr' }, ar: { label: 'ع', name: 'العربية', dir: 'rtl' } };

  const UI = {
    he: {
      title: 'בנו את הפיצה שלכם', 'nav.build': 'בנו פיצה', 'nav.drinks': 'משקאות', 'nav.info': 'מידע', cart: 'ההזמנה',
      h1: 'בנו את הפיצה שלכם', toppings: 'התוספות', 'place.right': 'חצי ימין', 'place.full': 'כל הפיצה', 'place.left': 'חצי שמאל',
      'opt.size': 'גודל', 'opt.crust': 'בצק', 'opt.sauce': 'רוטב', morePizza: '+ עוד פיצה', toDrinks: 'למשקאות',
      yourOrder: 'ההזמנה שלכם', total: 'סה״כ', 'drinks.q': 'ומה שותים?', 'drinks.h': 'משקאות קרים', toPay: 'לתשלום',
      hours: 'שעות פתיחה', where: 'איפה אנחנו', delivery: 'משלוחים ואיסוף', 'info.delivery': 'משלוח:', 'info.pickup': 'איסוף עצמי:', faq: 'שאלות נפוצות',
      credit: 'צילומי מוצר: Unsplash ו-Open Food Facts (CC BY-SA)', demo: 'מצב הדגמה · לא מתבצע חיוב אמיתי', checkout: 'סיום הזמנה',
      'm.delivery': 'משלוח', 'm.pickup': 'איסוף עצמי', 'f.name': 'שם מלא', 'f.phone': 'טלפון', 'f.addr': 'כתובת למשלוח', 'f.addrPh': 'רחוב, מספר, עיר',
      'f.apt': 'קומה / דירה', 'f.note': 'הערות', 'f.notePh': 'בלי בצל? לצלצל לפני?', summary: 'סיכום', toPayTotal: 'לתשלום',
      adult: 'בהזמנה יש בירה. המכירה מגיל 18 בלבד, בהצגת תעודה מזהה.', howPay: 'איך משלמים?', 'pay.cardBtn': 'כרטיס אשראי', 'pay.cashBtn': 'מזומן',
      cardholder: 'שם בעל הכרטיס', 'f.cnum': 'מספר כרטיס (דמו, אל תזינו כרטיס אמיתי)', 'f.exp': 'תוקף', orderNoLabel: 'מספר הזמנה',
      changeOrder: 'שינוי ההזמנה', cancelOrder: 'ביטול ההזמנה', demoDone: 'זוהי הדגמה, לא נשלחה הזמנה אמיתית ולא בוצע חיוב.', close: 'סגירה',
      'a.toppings': 'תוספות', 'a.where': 'איפה לשים את התוספת', 'a.pizza': 'הפיצה שלכם', 'a.lid': 'פתחו את הקרטון והתחילו הזמנה', 'a.receipt': 'סיכום הזמנה',
      'a.prev': 'המשקה הקודם', 'a.next': 'המשקה הבא', 'a.less1': 'פחות', 'a.more1': 'עוד', 'a.close': 'סגירה', 'a.intro': 'פתיח', 'a.langs': 'שפה',
      pizza: 'פיצה {size}', crustLine: 'בצק {crust}', sauceLine: 'רוטב {sauce}', editingNo: 'עורכים את הזמנה {no}', edit: 'עריכה',
      'a.editPizza': 'עריכת הפיצה', 'a.removePizza': 'הסרת הפיצה', inPrep: 'בהכנה', 'a.cancelPizza': 'ביטול הפיצה', 'a.less': 'פחות {n}', 'a.more': 'עוד {n}',
      empty: 'הקרטון עוד סגור. פותחים ומתחילים לבנות.', 'btn.closed': 'התחילו הזמנה', 'btn.building': 'לתנור!', 'btn.baking': 'נאפה…', 'btn.boxed': 'לתשלום',
      'stamp.ready': 'מוכנה! בתוך ההזמנה', 'toast.ready': 'הפיצה מוכנה ונוספה להזמנה', 'toast.ovenFirst': 'קודם לתנור, ומיד אחר כך לתשלום', 'toast.empty': 'ההזמנה עדיין ריקה',
      deliveryFee: 'דמי משלוח', dfee: 'דמי משלוח {fee}', 'pay.upd': 'עדכנו הזמנה', 'pay.updPlus': 'עדכנו הזמנה · תוספת {x}', 'pay.updMinus': 'עדכנו הזמנה · זיכוי {x}',
      'pay.cash': 'שלחו הזמנה · {x} במזומן', 'pay.card': 'שלמו {x}', 'pay.sending': 'שולחים…', 'pay.processing': 'מעבדים תשלום…',
      'err.name': 'חסר שם מלא', 'err.phone': 'מספר הטלפון לא תקין', 'err.addr': 'חסרה כתובת למשלוח', 'err.cnum': 'מספר הכרטיס קצר מדי', 'err.exp': 'תוקף הכרטיס צריך להיות בפורמט MM/YY', 'err.cvv': 'חסר CVV',
      'done.received': 'ההזמנה התקבלה!', 'done.updated': 'ההזמנה עודכנה!', 'eta.delivery': 'השליח יגיע בעוד {t}.', 'eta.pickup': 'ההזמנה תחכה לכם בעוד {t}. {addr}',
      'edit.open': 'טעיתם? אפשר לשנות או לבטל עוד {time} דקות, לפני ש{what}.', 'edit.courier': 'השליח יוצא', 'edit.prep': 'מתחילים להכין',
      'edit.closed': 'ההזמנה כבר {state}. לשינויים התקשרו: {phone}', 'state.onway': 'בדרך אליכם', 'state.prep': 'בהכנה',
      'pill.open': 'הזמנה {no} · שינוי עד {time}', 'pill.closed': 'הזמנה {no} · {state}', 'pill.onway': 'בדרך', 'pill.prep': 'בהכנה',
      'confirm.replace': 'בסל יש כבר פריטים. להחליף אותם בהזמנה הקודמת כדי לערוך אותה?', 'confirm.cancel': 'לבטל את הזמנה {no}? החיוב יבוטל.',
      'toast.cancelled': 'הזמנה {no} בוטלה', 'toast.editHint': 'אפשר לערוך: לחצו "עריכה" ליד פיצה, או שנו משקאות', 'toast.finishFirst': 'קודם סיימו את הפיצה שבהכנה', 'toast.rebake': 'שנו מה שצריך ושלחו שוב לתנור',
      'demo.added': "הוספתי להזמנה: {list}", 'wa.send': "שליחת ההזמנה לפיצרייה בוואטסאפ",'ai.label': "הזמנה חכמה: כתבו מה בא לכם", 'ai.ph': "למשל: משפחתית חצי זיתים חצי פטריות, ושתי קולות", 'ai.go': "הזמינו", 'ai.mic': "הזמנה בקול", 'ai.listening': "מקשיבים…", 'ai.thinking': "מבינים את ההזמנה…", 'ai.notConfigured': "ההזמנה החכמה עוד לא הופעלה באתר הזה.", 'ai.busy': "יותר מדי בקשות. נסו שוב בעוד רגע.", 'ai.fail': "לא הצלחנו להבין. נסו לנסח אחרת, או בנו את הפיצה ידנית.", 'ai.unavailable': "לא קיים אצלנו: {x}", 'ai.empty': "כתבו מה תרצו להזמין",
      skip: 'דלגו',
    },
    en: {
      title: 'Build your pizza', 'nav.build': 'Build a pizza', 'nav.drinks': 'Drinks', 'nav.info': 'Info', cart: 'Order',
      h1: 'Build your pizza', toppings: 'Toppings', 'place.right': 'Right half', 'place.full': 'Whole pizza', 'place.left': 'Left half',
      'opt.size': 'Size', 'opt.crust': 'Crust', 'opt.sauce': 'Sauce', morePizza: '+ Another pizza', toDrinks: 'Drinks',
      yourOrder: 'Your order', total: 'Total', 'drinks.q': 'Something to drink?', 'drinks.h': 'Cold drinks', toPay: 'Checkout',
      hours: 'Opening hours', where: 'Find us', delivery: 'Delivery & pickup', 'info.delivery': 'Delivery:', 'info.pickup': 'Pickup:', faq: 'FAQ',
      credit: 'Product photos: Unsplash & Open Food Facts (CC BY-SA)', demo: 'Demo mode · no real charge', checkout: 'Checkout',
      'm.delivery': 'Delivery', 'm.pickup': 'Pickup', 'f.name': 'Full name', 'f.phone': 'Phone', 'f.addr': 'Delivery address', 'f.addrPh': 'Street, number, city',
      'f.apt': 'Floor / apt.', 'f.note': 'Notes', 'f.notePh': 'No onion? Call first?', summary: 'Summary', toPayTotal: 'To pay',
      adult: 'Your order includes beer. Sale is 18+ only, with ID.', howPay: 'How would you like to pay?', 'pay.cardBtn': 'Credit card', 'pay.cashBtn': 'Cash',
      cardholder: 'Cardholder name', 'f.cnum': 'Card number (demo, do not enter a real card)', 'f.exp': 'Expiry', orderNoLabel: 'Order number',
      changeOrder: 'Change order', cancelOrder: 'Cancel order', demoDone: 'This is a demo. No real order was sent and nothing was charged.', close: 'Close',
      'a.toppings': 'Toppings', 'a.where': 'Where to put the topping', 'a.pizza': 'Your pizza', 'a.lid': 'Open the box and start an order', 'a.receipt': 'Order summary',
      'a.prev': 'Previous drink', 'a.next': 'Next drink', 'a.less1': 'Fewer', 'a.more1': 'More', 'a.close': 'Close', 'a.intro': 'Intro', 'a.langs': 'Language',
      pizza: '{size} pizza', crustLine: '{crust} crust', sauceLine: '{sauce} sauce', editingNo: 'Editing order {no}', edit: 'Edit',
      'a.editPizza': 'Edit pizza', 'a.removePizza': 'Remove pizza', inPrep: 'In progress', 'a.cancelPizza': 'Cancel pizza', 'a.less': 'One less {n}', 'a.more': 'One more {n}',
      empty: 'The box is still closed. Open it and start building.', 'btn.closed': 'Start an order', 'btn.building': 'Into the oven!', 'btn.baking': 'Baking…', 'btn.boxed': 'Checkout',
      'stamp.ready': 'Ready! Added to your order', 'toast.ready': 'Your pizza is ready and in the order', 'toast.ovenFirst': 'Into the oven first, then checkout', 'toast.empty': 'Your order is still empty',
      deliveryFee: 'Delivery fee', dfee: 'Delivery fee {fee}', 'pay.upd': 'Update order', 'pay.updPlus': 'Update order · add {x}', 'pay.updMinus': 'Update order · refund {x}',
      'pay.cash': 'Place order · {x} cash', 'pay.card': 'Pay {x}', 'pay.sending': 'Sending…', 'pay.processing': 'Processing payment…',
      'err.name': 'Please enter your full name', 'err.phone': 'That phone number doesn’t look right', 'err.addr': 'Please enter a delivery address', 'err.cnum': 'Card number is too short', 'err.exp': 'Expiry must be MM/YY', 'err.cvv': 'Please enter the CVV',
      'done.received': 'Order received!', 'done.updated': 'Order updated!', 'eta.delivery': 'Your courier will arrive in {t}.', 'eta.pickup': 'Your order will be ready in {t}. {addr}',
      'edit.open': 'Made a mistake? You can still change or cancel for {time}, before {what}.', 'edit.courier': 'the courier leaves', 'edit.prep': 'we start preparing it',
      'edit.closed': 'Your order is already {state}. To change it, call {phone}', 'state.onway': 'on its way', 'state.prep': 'being prepared',
      'pill.open': 'Order {no} · change until {time}', 'pill.closed': 'Order {no} · {state}', 'pill.onway': 'on its way', 'pill.prep': 'being prepared',
      'confirm.replace': 'Your cart already has items. Replace them with the previous order to edit it?', 'confirm.cancel': 'Cancel order {no}? The charge will be cancelled.',
      'toast.cancelled': 'Order {no} cancelled', 'toast.editHint': 'Tap "Edit" next to a pizza, or change the drinks', 'toast.finishFirst': 'Finish the pizza in progress first', 'toast.rebake': 'Make your changes and send it back to the oven',
      'demo.added': "Added to your order: {list}", 'wa.send': "Send the order to the pizzeria on WhatsApp",'ai.label': "Smart order: tell us what you feel like", 'ai.ph': "e.g. Family size, half olives half mushrooms, and two Cokes", 'ai.go': "Order", 'ai.mic': "Order by voice", 'ai.listening': "Listening…", 'ai.thinking': "Reading your order…", 'ai.notConfigured': "Smart ordering isn’t switched on for this site yet.", 'ai.busy': "Too many requests. Try again in a moment.", 'ai.fail': "We couldn’t understand that. Try rephrasing, or build the pizza yourself.", 'ai.unavailable': "Not on our menu: {x}", 'ai.empty': "Type what you’d like to order",
      skip: 'Skip',
    },
    ar: {
      title: 'اصنع البيتزا الخاصة بك', 'nav.build': 'اصنع بيتزا', 'nav.drinks': 'مشروبات', 'nav.info': 'معلومات', cart: 'الطلب',
      h1: 'اصنع البيتزا الخاصة بك', toppings: 'الإضافات', 'place.right': 'النصف الأيمن', 'place.full': 'كل البيتزا', 'place.left': 'النصف الأيسر',
      'opt.size': 'الحجم', 'opt.crust': 'العجينة', 'opt.sauce': 'الصلصة', morePizza: '+ بيتزا أخرى', toDrinks: 'للمشروبات',
      yourOrder: 'طلبك', total: 'المجموع', 'drinks.q': 'وماذا تشرب؟', 'drinks.h': 'مشروبات باردة', toPay: 'للدفع',
      hours: 'ساعات العمل', where: 'أين نحن', delivery: 'التوصيل والاستلام', 'info.delivery': 'توصيل:', 'info.pickup': 'استلام ذاتي:', faq: 'أسئلة شائعة',
      credit: 'صور المنتجات: Unsplash و Open Food Facts (CC BY-SA)', demo: 'وضع تجريبي · لا يتم أي دفع حقيقي', checkout: 'إتمام الطلب',
      'm.delivery': 'توصيل', 'm.pickup': 'استلام ذاتي', 'f.name': 'الاسم الكامل', 'f.phone': 'الهاتف', 'f.addr': 'عنوان التوصيل', 'f.addrPh': 'الشارع، الرقم، المدينة',
      'f.apt': 'الطابق / الشقة', 'f.note': 'ملاحظات', 'f.notePh': 'بدون بصل؟ الاتصال قبل الوصول؟', summary: 'الملخص', toPayTotal: 'للدفع',
      adult: 'يحتوي الطلب على بيرة. البيع لمن هم فوق 18 فقط مع إبراز الهوية.', howPay: 'كيف تريد الدفع؟', 'pay.cardBtn': 'بطاقة ائتمان', 'pay.cashBtn': 'نقدًا',
      cardholder: 'اسم حامل البطاقة', 'f.cnum': 'رقم البطاقة (تجريبي، لا تُدخل بطاقة حقيقية)', 'f.exp': 'تاريخ الانتهاء', orderNoLabel: 'رقم الطلب',
      changeOrder: 'تعديل الطلب', cancelOrder: 'إلغاء الطلب', demoDone: 'هذا عرض تجريبي، لم يُرسل طلب حقيقي ولم يتم أي دفع.', close: 'إغلاق',
      'a.toppings': 'الإضافات', 'a.where': 'أين توضع الإضافة', 'a.pizza': 'البيتزا الخاصة بك', 'a.lid': 'افتح العلبة وابدأ الطلب', 'a.receipt': 'ملخص الطلب',
      'a.prev': 'المشروب السابق', 'a.next': 'المشروب التالي', 'a.less1': 'أقل', 'a.more1': 'المزيد', 'a.close': 'إغلاق', 'a.intro': 'مقدمة', 'a.langs': 'اللغة',
      pizza: 'بيتزا {size}', crustLine: 'عجينة {crust}', sauceLine: 'صلصة {sauce}', editingNo: 'تعديل الطلب {no}', edit: 'تعديل',
      'a.editPizza': 'تعديل البيتزا', 'a.removePizza': 'حذف البيتزا', inPrep: 'قيد التحضير', 'a.cancelPizza': 'إلغاء البيتزا', 'a.less': 'تقليل {n}', 'a.more': 'زيادة {n}',
      empty: 'العلبة ما زالت مغلقة. افتحها وابدأ.', 'btn.closed': 'ابدأ الطلب', 'btn.building': 'إلى الفرن!', 'btn.baking': 'يُخبز…', 'btn.boxed': 'للدفع',
      'stamp.ready': 'جاهزة! أُضيفت إلى الطلب', 'toast.ready': 'البيتزا جاهزة وأُضيفت إلى الطلب', 'toast.ovenFirst': 'إلى الفرن أولًا، ثم الدفع', 'toast.empty': 'الطلب ما زال فارغًا',
      deliveryFee: 'رسوم التوصيل', dfee: 'رسوم التوصيل {fee}', 'pay.upd': 'تحديث الطلب', 'pay.updPlus': 'تحديث الطلب · إضافة {x}', 'pay.updMinus': 'تحديث الطلب · استرداد {x}',
      'pay.cash': 'أرسل الطلب · {x} نقدًا', 'pay.card': 'ادفع {x}', 'pay.sending': 'جارٍ الإرسال…', 'pay.processing': 'جارٍ معالجة الدفع…',
      'err.name': 'الاسم الكامل مطلوب', 'err.phone': 'رقم الهاتف غير صحيح', 'err.addr': 'عنوان التوصيل مطلوب', 'err.cnum': 'رقم البطاقة قصير جدًا', 'err.exp': 'يجب أن يكون تاريخ الانتهاء بصيغة MM/YY', 'err.cvv': 'رمز CVV مطلوب',
      'done.received': 'تم استلام الطلب!', 'done.updated': 'تم تحديث الطلب!', 'eta.delivery': 'سيصل المندوب خلال {t}.', 'eta.pickup': 'سيكون طلبك جاهزًا خلال {t}. {addr}',
      'edit.open': 'أخطأت؟ يمكنك التعديل أو الإلغاء خلال {time} قبل أن {what}.', 'edit.courier': 'يخرج المندوب', 'edit.prep': 'نبدأ التحضير',
      'edit.closed': 'الطلب {state}. للتعديل اتصل: {phone}', 'state.onway': 'في الطريق إليك', 'state.prep': 'قيد التحضير',
      'pill.open': 'الطلب {no} · تعديل حتى {time}', 'pill.closed': 'الطلب {no} · {state}', 'pill.onway': 'في الطريق', 'pill.prep': 'قيد التحضير',
      'confirm.replace': 'في السلة أصناف بالفعل. استبدالها بالطلب السابق لتعديله؟', 'confirm.cancel': 'إلغاء الطلب {no}؟ سيتم إلغاء الدفع.',
      'toast.cancelled': 'تم إلغاء الطلب {no}', 'toast.editHint': 'اضغط "تعديل" بجانب البيتزا، أو غيّر المشروبات', 'toast.finishFirst': 'أنهِ البيتزا قيد التحضير أولًا', 'toast.rebake': 'عدّل ما تريد وأعدها إلى الفرن',
      'demo.added': "أضفت إلى طلبك: {list}", 'wa.send': "إرسال الطلب إلى المطعم عبر واتساب",'ai.label': "طلب ذكي: اكتب ما تشتهي", 'ai.ph': "مثلًا: عائلية نصف زيتون نصف فطر، وكولا اثنتين", 'ai.go': "اطلب", 'ai.mic': "اطلب بالصوت", 'ai.listening': "نستمع…", 'ai.thinking': "نفهم طلبك…", 'ai.notConfigured': "الطلب الذكي غير مفعّل في هذا الموقع بعد.", 'ai.busy': "طلبات كثيرة. حاول مرة أخرى بعد لحظة.", 'ai.fail': "لم نفهم الطلب. جرّب صياغة أخرى أو اصنع البيتزا بنفسك.", 'ai.unavailable': "غير موجود لدينا: {x}", 'ai.empty': "اكتب ما تريد طلبه",
      skip: 'تخطٍّ',
    },
  };

  // site content per language (Hebrew lives in config.js)
  const CONTENT = {
    en: {
      name: 'Pizza Amit', tagline: 'Fresh dough. A blazing oven. Exactly the way you like it.', address: '1 Main St., The City', kosher: 'Kosher dairy',
      hours: [['Sunday to Thursday', '11:00 – 23:00'], ['Friday', '10:00 – 15:00'], ['Saturday night', 'One hour after Shabbat ends – 00:00']],
      deliveryTime: '35–45 minutes', pickupTime: '15–20 minutes',
      sizes: { s: 'Personal', m: 'Family', l: 'Giant' }, crusts: { reg: 'Regular', thin: 'Thin', gf: 'Gluten-free' }, sauces: { tomato: 'Tomato', cream: 'Cream', none: 'No sauce' },
      toppings: { mozz: 'Extra mozzarella', golive: 'Green olives', bolive: 'Black olives', mush: 'Mushrooms', onion: 'Onion', corn: 'Corn', tomato: 'Tomatoes', chili: 'Hot pepper', tuna: 'Tuna', feta: 'Bulgarian cheese' },
      drinks: {
        cola: ['Coca-Cola', '330 ml can, ice cold'], zero: ['Coke Zero', '330 ml can, no sugar'], sprite: ['Sprite', '330 ml can, lemon-lime'], fanta: ['Fanta', '330 ml can, orange'],
        fuze: ['Fuze Tea', 'Peach iced tea, bottle'], grape: ['Spring Grape', 'Grape drink, 330 ml can'], water: ['Water', 'Mineral water, 500 ml bottle'],
        gold: ['Goldstar', '330 ml can · 18+ only'], carl: ['Carlsberg', 'Beer, 330 ml · 18+ only'],
      },
      faq: [
        ['How long does delivery take?', 'Usually 35–45 minutes. At busy times it can take a bit longer, and we’ll call to let you know.'],
        ['Can I put a topping on half a pizza?', 'Yes. Choose "Right half" or "Left half" before tapping the topping, and pay half price.'],
        ['Do you have gluten-free dough?', 'Yes, for an extra charge. It is baked in the same oven, so it is not suitable for people with celiac disease.'],
        ['Where do you deliver?', 'Across the city and nearby towns. Not sure? Call us and we’ll check.'],
        ['How can I pay?', 'Credit card, Apple Pay, Google Pay, Bit, or cash to the courier.'],
      ],
    },
    ar: {
      name: 'بيتزا عميت', tagline: 'عجينة طازجة. فرن ملتهب. تمامًا كما تحبون.', address: 'الشارع الرئيسي 1، المدينة', kosher: 'كوشير حليبي',
      hours: [['الأحد إلى الخميس', '11:00 – 23:00'], ['الجمعة', '10:00 – 15:00'], ['مساء السبت', 'بعد ساعة من انتهاء السبت – 00:00']],
      deliveryTime: '35–45 دقيقة', pickupTime: '15–20 دقيقة',
      sizes: { s: 'شخصية', m: 'عائلية', l: 'عملاقة' }, crusts: { reg: 'عادية', thin: 'رقيقة', gf: 'خالية من الغلوتين' }, sauces: { tomato: 'طماطم', cream: 'كريمة', none: 'بدون صلصة' },
      toppings: { mozz: 'موتزاريلا إضافية', golive: 'زيتون أخضر', bolive: 'زيتون أسود', mush: 'فطر', onion: 'بصل', corn: 'ذرة', tomato: 'طماطم', chili: 'فلفل حار', tuna: 'تونة', feta: 'جبنة بلغارية' },
      drinks: {
        cola: ['كوكا كولا', 'علبة 330 مل، باردة'], zero: ['كولا زيرو', 'علبة 330 مل، بدون سكر'], sprite: ['سبرايت', 'علبة 330 مل، ليمون'], fanta: ['فانتا', 'علبة 330 مل، برتقال'],
        fuze: ['فيوز تي', 'شاي مثلج بالخوخ، زجاجة'], grape: ['سبرينغ عنب', 'مشروب عنب، علبة 330 مل'], water: ['مياه', 'مياه معدنية، زجاجة 500 مل'],
        gold: ['غولدستار', 'علبة 330 مل · فوق 18 فقط'], carl: ['كارلسبرغ', 'بيرة، 330 مل · فوق 18 فقط'],
      },
      faq: [
        ['كم يستغرق التوصيل؟', 'عادةً 35–45 دقيقة. في أوقات الذروة قد يستغرق أكثر قليلًا، وسنبلغك بالهاتف.'],
        ['هل يمكن وضع إضافة على نصف البيتزا فقط؟', 'نعم. اختر "النصف الأيمن" أو "النصف الأيسر" قبل الضغط على الإضافة، وادفع نصف السعر.'],
        ['هل توجد عجينة خالية من الغلوتين؟', 'نعم، مقابل رسوم إضافية. تُخبز في نفس الفرن، لذا فهي غير مناسبة لمرضى السيلياك.'],
        ['إلى أين توصلون؟', 'إلى كل المدينة والبلدات المجاورة. لست متأكدًا؟ اتصل بنا وسنتحقق.'],
        ['كيف أدفع؟', 'بطاقة ائتمان، Apple Pay، Google Pay، Bit، أو نقدًا للمندوب.'],
      ],
    },
  };

  let lang = 'he';
  try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('lang') || 'he'; } catch (e) {}
  if (!LANGS[lang]) lang = 'he';
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGS[lang].dir;

  // apply translated content onto the shared config
  const C = window.CONFIG, X = CONTENT[lang];
  if (X) {
    ['name', 'tagline', 'address', 'kosher', 'hours', 'deliveryTime', 'pickupTime', 'faq'].forEach((k) => (C[k] = X[k]));
    C.sizes.forEach((s) => (s.name = X.sizes[s.id] || s.name));
    C.crusts.forEach((s) => (s.name = X.crusts[s.id] || s.name));
    C.sauces.forEach((s) => (s.name = X.sauces[s.id] || s.name));
    C.toppings.forEach((s) => (s.name = X.toppings[s.id] || s.name));
    C.drinks.forEach((d) => { const v = X.drinks[d.id]; if (v) { d.name = v[0]; d.sub = v[1]; } });
  }

  const t = (key, vars) => {
    let s = (UI[lang] && UI[lang][key]) ?? UI.he[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
    return s;
  };
  window.t = t;
  window.LANG = lang;

  // static texts in the page
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));

  // language switcher in the header
  const sw = document.createElement('div');
  sw.className = 'langs'; sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', t('a.langs'));
  sw.innerHTML = Object.entries(LANGS).map(([k, v]) => `<button type="button" lang="${k}" data-lang="${k}" aria-label="${v.name}" aria-pressed="${k === lang}">${v.label}</button>`).join('');
  sw.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]'); if (!b || b.dataset.lang === lang) return;
    try { localStorage.setItem('lang', b.dataset.lang); } catch (err) {}
    if (window.__saveOrder) window.__saveOrder();
    const u = new URL(location.href); u.searchParams.delete('lang'); u.searchParams.delete('intro');
    location.replace(u.toString());
  });
  const header = document.querySelector('header.top');
  if (header) header.insertBefore(sw, header.querySelector('nav').nextSibling);
})();
