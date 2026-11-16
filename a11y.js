/* ============================================================
   נגישות: תפריט התאמות + הצהרת נגישות (עברית / English / العربية)
   ההגדרות נשמרות בדפדפן של המשתמש.
   ============================================================ */
(() => {
  const C = window.CONFIG, lang = window.LANG || 'he';
  const A = C.a11y || {};
  const S = {
    he: {
      open: 'תפריט נגישות', title: 'התאמות נגישות', bigger: 'הגדלת טקסט', smaller: 'הקטנת טקסט', contrast: 'ניגודיות גבוהה', mono: 'שחור לבן',
      links: 'הדגשת קישורים וכפתורים', font: 'גופן קריא', still: 'עצירת אנימציות', cursor: 'סמן גדול', reset: 'איפוס הגדרות', statement: 'הצהרת נגישות',
      skip: 'דלגו לתוכן הראשי', size: 'גודל טקסט: {n}%', close: 'סגירה',
      stTitle: 'הצהרת נגישות',
      st: [
        ['', `${C.name} רואה חשיבות רבה במתן שירות שוויוני לכל הלקוחות, ובכלל זה לאנשים עם מוגבלות. האתר הונגש בהתאם לתקן הישראלי ת"י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA.`],
        ['מה עשינו באתר', 'ניווט מלא במקלדת, כולל בונה הפיצה, המשקאות והתשלום · סימון פוקוס ברור · תיאור טקסטואלי של הפיצה ושל ההזמנה לקוראי מסך · הודעות קופצות שמוקראות אוטומטית · תמיכה בהגדרת "הפחתת תנועה" של מערכת ההפעלה · האתר זמין בעברית, באנגלית ובערבית · תפריט נגישות להגדלת טקסט, ניגודיות, הדגשת קישורים, גופן קריא, עצירת אנימציות וסמן גדול.'],
        ['מגבלות ידועות', 'תמונות המוצרים (פחיות המשקאות) הן צילומים של המוצר עצמו ואינן מכילות טקסט חלופי מפורט מעבר לשם המוצר. האתר במצב הדגמה ואינו מבצע הזמנות אמיתיות.'],
        ['נתקלתם בבעיה?', `נשמח לשמוע ולתקן. רכז/ת הנגישות: ${A.name}, טלפון ${A.phone}, דוא"ל ${A.email}. נשתדל לחזור אליכם תוך 3 ימי עבודה.`],
        ['', `ההצהרה עודכנה בתאריך ${A.updated}.`],
      ],
    },
    en: {
      open: 'Accessibility menu', title: 'Accessibility settings', bigger: 'Larger text', smaller: 'Smaller text', contrast: 'High contrast', mono: 'Grayscale',
      links: 'Highlight links & buttons', font: 'Readable font', still: 'Stop animations', cursor: 'Large cursor', reset: 'Reset settings', statement: 'Accessibility statement',
      skip: 'Skip to main content', size: 'Text size: {n}%', close: 'Close',
      stTitle: 'Accessibility statement',
      st: [
        ['', `${C.name} is committed to giving every customer equal service, including people with disabilities. This site follows Israeli Standard IS 5568, based on WCAG 2.0 level AA.`],
        ['What we did', 'Full keyboard navigation, including the pizza builder, drinks and checkout · clear focus outlines · a text description of the pizza and the order for screen readers · pop-up messages that are read out automatically · support for the operating system’s "reduce motion" setting · the site is available in Hebrew, English and Arabic · an accessibility menu for larger text, contrast, highlighted links, a readable font, stopping animations and a large cursor.'],
        ['Known limitations', 'Product photos (drink cans) are photos of the product and have no detailed alternative text beyond the product name. The site is in demo mode and does not place real orders.'],
        ['Found a problem?', `We want to hear about it and fix it. Accessibility coordinator: ${A.name}, phone ${A.phone}, email ${A.email}. We aim to reply within 3 business days.`],
        ['', `Last updated: ${A.updated}.`],
      ],
    },
    ar: {
      open: 'قائمة إمكانية الوصول', title: 'إعدادات إمكانية الوصول', bigger: 'تكبير النص', smaller: 'تصغير النص', contrast: 'تباين عالٍ', mono: 'أبيض وأسود',
      links: 'إبراز الروابط والأزرار', font: 'خط سهل القراءة', still: 'إيقاف الحركة', cursor: 'مؤشر كبير', reset: 'إعادة الضبط', statement: 'بيان إمكانية الوصول',
      skip: 'انتقل إلى المحتوى الرئيسي', size: 'حجم النص: {n}%', close: 'إغلاق',
      stTitle: 'بيان إمكانية الوصول',
      st: [
        ['', `تحرص ${C.name} على تقديم خدمة متساوية لجميع الزبائن، بمن فيهم الأشخاص ذوو الإعاقة. تمت ملاءمة الموقع وفق المعيار الإسرائيلي 5568 المبني على إرشادات WCAG 2.0 بمستوى AA.`],
        ['ما قمنا به', 'تنقّل كامل بلوحة المفاتيح، بما في ذلك صانع البيتزا والمشروبات والدفع · إبراز واضح للعنصر المحدد · وصف نصي للبيتزا والطلب لقارئات الشاشة · رسائل تُقرأ تلقائيًا · دعم إعداد "تقليل الحركة" في نظام التشغيل · الموقع متوفر بالعبرية والإنجليزية والعربية · قائمة لتكبير النص والتباين وإبراز الروابط وخط سهل القراءة وإيقاف الحركة ومؤشر كبير.'],
        ['قيود معروفة', 'صور المنتجات (علب المشروبات) هي صور للمنتج نفسه ولا تحتوي على نص بديل مفصّل سوى اسم المنتج. الموقع في وضع تجريبي ولا ينفّذ طلبات حقيقية.'],
        ['واجهت مشكلة؟', `يسعدنا أن نسمع ونصلح. منسّق/ة إمكانية الوصول: ${A.name}، هاتف ${A.phone}، بريد إلكتروني ${A.email}. نسعى للرد خلال 3 أيام عمل.`],
        ['', `آخر تحديث: ${A.updated}.`],
      ],
    },
  }[lang];
  const tx = (k, v) => (v ? S[k].replace(/\{(\w+)\}/g, (_, x) => v[x]) : S[k]);

  // settings
  const KEY = 'a11y';
  let st = { size: 0, contrast: false, mono: false, links: false, font: false, still: false, cursor: false };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const root = document.documentElement;
  const apply = () => {
    root.style.setProperty('--a11y-zoom', String(1 + st.size * 0.12));
    root.classList.toggle('a11y-zoom', st.size > 0);
    ['contrast', 'mono', 'links', 'font', 'still', 'cursor'].forEach((k) => root.classList.toggle('a11y-' + k, !!st[k]));
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    if (panel) panel.querySelectorAll('[data-k]').forEach((b) => b.setAttribute('aria-pressed', String(!!st[b.dataset.k])));
    if (sizeOut) sizeOut.textContent = tx('size', { n: Math.round((1 + st.size * 0.12) * 100) });
  };

  // skip link (first focusable element on the page)
  const skip = document.createElement('a');
  skip.className = 'skiplink'; skip.href = '#main'; skip.textContent = tx('skip');
  document.body.prepend(skip);

  // floating button + panel
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'a11y-btn'; btn.setAttribute('aria-label', tx('open')); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'a11yPanel');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M5 8.5c2.3.6 4.6.9 7 .9s4.7-.3 7-.9M12 9.4V15m0 0-3 6m3-6 3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const panel = document.createElement('div');
  panel.id = 'a11yPanel'; panel.className = 'a11y-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', tx('title'));
  const toggle = (k) => `<button type="button" data-k="${k}" aria-pressed="false">${tx(k)}</button>`;
  panel.innerHTML = `
    <div class="a11y-head"><h2>${tx('title')}</h2><button type="button" class="a11y-x" aria-label="${tx('close')}">✕</button></div>
    <div class="a11y-size"><button type="button" data-size="-1">${tx('smaller')}</button><output aria-live="polite"></output><button type="button" data-size="1">${tx('bigger')}</button></div>
    <div class="a11y-grid">${['contrast', 'mono', 'links', 'font', 'still', 'cursor'].map(toggle).join('')}</div>
    <div class="a11y-foot"><button type="button" class="a11y-reset">${tx('reset')}</button><button type="button" class="a11y-st">${tx('statement')}</button></div>`;
  const sizeOut = panel.querySelector('output');
  document.body.append(btn, panel);

  const openPanel = (open) => {
    panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('button').focus(); else btn.focus();
  };
  btn.addEventListener('click', () => openPanel(panel.hidden));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') openPanel(false); });
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('a11y-x')) return openPanel(false);
    if (b.dataset.size) st.size = Math.max(0, Math.min(3, st.size + +b.dataset.size));
    else if (b.dataset.k) st[b.dataset.k] = !st[b.dataset.k];
    else if (b.classList.contains('a11y-reset')) st = { size: 0, contrast: false, mono: false, links: false, font: false, still: false, cursor: false };
    else if (b.classList.contains('a11y-st')) return showStatement();
    apply();
  });

  // accessibility statement
  const dlg = document.createElement('dialog');
  dlg.className = 'a11y-statement'; dlg.setAttribute('aria-labelledby', 'a11yStTitle');
  dlg.innerHTML = `<form method="dialog" class="closeform"><button aria-label="${tx('close')}">✕</button></form>
    <h2 id="a11yStTitle">${tx('stTitle')}</h2>${S.st.map(([h, p]) => (h ? `<h3>${h}</h3>` : '') + `<p>${p}</p>`).join('')}
    <form method="dialog"><button class="btn primary wide">${tx('close')}</button></form>`;
  document.body.append(dlg);
  function showStatement() { openPanel(false); dlg.showModal(); }
  // footer link to the statement (required to be reachable from every page)
  const foot = document.querySelector('footer');
  if (foot) {
    const a = document.createElement('a');
    a.href = '#accessibility'; a.textContent = tx('statement'); a.className = 'a11y-link';
    a.addEventListener('click', (e) => { e.preventDefault(); showStatement(); });
    foot.append(document.createTextNode(' · '), a);
  }
  if (location.hash === '#accessibility') setTimeout(showStatement, 300);

  apply();
})();
