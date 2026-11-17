(() => {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const fmt = (n) => '₪' + (Number.isInteger(n) ? n : n.toFixed(1));
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const t = window.t;
  const PLACE = { full: t('place.full'), right: t('place.right'), left: t('place.left') };
  const BAKE_SECONDS = 3;

  /* ---------- פיזור החתיכות על הפיצה ---------- */
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // נקודות בפיזור אחיד בתוך עיגול; היחידות הן אחוזים מרוחב הפיצה
  function spots(seed, n, maxR) {
    const r = rng(seed * 977 + 13), off = r() * 6.28, jit = maxR * 0.09, out = [];
    for (let i = 0; i < n; i++) {
      const ang = i * 2.39996 + off, rad = maxR * Math.sqrt((i + 0.6) / n);
      out.push({ x: Math.cos(ang) * rad + (r() - 0.5) * jit, y: Math.sin(ang) * rad + (r() - 0.5) * jit, a: Math.round(r() * 360), s: 0.85 + r() * 0.3 });
    }
    return out;
  }

  /* ---------- מצב ---------- */
  const newDraft = () => ({ size: C.sizes[Math.min(1, C.sizes.length - 1)].id, crust: C.crusts[0].id, sauce: C.sauces[0].id, tops: {} });
  const state = { phase: 'closed', draft: newDraft(), pizzas: [], drinks: {}, place: 'full', di: 0, method: 'delivery', pay: 'card', wantCheckout: false };

  const pizzaPrice = (p) => {
    const size = byId(C.sizes, p.size);
    return size.price + byId(C.crusts, p.crust).price +
      Object.values(p.tops).reduce((s, pl) => s + size.topping * (pl === 'full' ? 1 : 0.5), 0);
  };
  const draftActive = () => state.phase === 'building' || state.phase === 'baking';
  const subtotal = () =>
    state.pizzas.reduce((s, p) => s + pizzaPrice(p), 0) +
    (draftActive() ? pizzaPrice(state.draft) : 0) +
    C.drinks.reduce((s, d) => s + (state.drinks[d.id] || 0) * d.price, 0);
  const hasItems = () => state.pizzas.length > 0 || C.drinks.some((d) => state.drinks[d.id]);

  /* ---------- טקסטים קבועים מההגדרות ---------- */
  function fillStatic() {
    document.title = C.name + ' · ' + t('title');
    $$('[data-brand]').forEach((el) => {
      if (C.logo) el.innerHTML = `<img src="${C.logo}" alt="${C.name}">`;
      else el.textContent = C.name;
    });
    $$('[data-tagline]').forEach((el) => (el.textContent = C.tagline));
    $$('[data-kosher]').forEach((el) => (el.textContent = C.kosher));
    $$('[data-address]').forEach((el) => (el.textContent = C.address));
    $$('[data-phone]').forEach((el) => { el.textContent = C.phone; el.href = 'tel:' + C.phone.replace(/\D/g, ''); });
    $$('[data-dtime]').forEach((el) => (el.textContent = C.deliveryTime));
    $$('[data-ptime]').forEach((el) => (el.textContent = C.pickupTime));
    $$('[data-dfee]').forEach((el) => (el.textContent = t('dfee', { fee: fmt(C.deliveryFee) })));
    $('#hours').innerHTML = C.hours.map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join('');
    $('#faq').innerHTML = C.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
  }

  /* ---------- בחירות: גודל, בצק, רוטב, מיקום ---------- */
  function seg(el, items, get, set) {
    el.innerHTML = items.map((it) => `<button type="button" data-v="${it.id}">${it.label}</button>`).join('');
    const sync = () => [...el.children].forEach((b) => { const on = b.dataset.v === get(); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      set(b.dataset.v); sync(); render();
    });
    sync();
    return sync;
  }
  let syncSegs = [];
  function buildOptions() {
    syncSegs = [
      seg($('#sizeSeg'), C.sizes.map((s) => ({ id: s.id, label: s.name })), () => state.draft.size, (v) => (state.draft.size = v)),
      seg($('#crustSeg'), C.crusts.map((s) => ({ id: s.id, label: s.name + (s.price ? ' +' + fmt(s.price) : '') })), () => state.draft.crust, (v) => (state.draft.crust = v)),
      seg($('#sauceSeg'), C.sauces.map((s) => ({ id: s.id, label: s.name })), () => state.draft.sauce, (v) => (state.draft.sauce = v)),
    ];
    $('#placeSeg').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.place = b.dataset.v;
      [...$('#placeSeg').children].forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    });
  }

  /* ---------- מגשי תוספות ---------- */
  function buildTrays() {
    $('#trays').innerHTML = C.toppings.map((t) => `
      <button type="button" class="tray" data-id="${t.id}" aria-pressed="false">
        <span class="badge"></span>
        <span class="pan"><img src="img/t_${t.id}.webp" alt="" draggable="false"></span>
        <span class="tn">${t.name}</span><span class="tp"></span>
      </button>`).join('');
    $('#trays').addEventListener('click', (e) => {
      const b = e.target.closest('.tray'); if (!b || state.phase !== 'building') return;
      const id = b.dataset.id, cur = state.draft.tops[id];
      if (cur === state.place) delete state.draft.tops[id];
      else state.draft.tops[id] = state.place;
      render();
    });
    // טעינה מוקדמת של תמונות החתיכות, כדי שהתוספת תיפול מיד בלחיצה
    C.toppings.forEach((t) => t.imgs.forEach((n) => { new Image().src = 'img/' + n + '.webp'; }));
  }
  function renderTrays() {
    const size = byId(C.sizes, state.draft.size);
    $$('.tray').forEach((b) => {
      const pl = state.draft.tops[b.dataset.id];
      b.classList.toggle('on', !!pl);
      b.setAttribute('aria-pressed', !!pl);
      b.querySelector('.badge').textContent = pl ? (pl === 'full' ? '✓' : PLACE[pl]) : '';
      b.querySelector('.tp').textContent = '+' + fmt(size.topping);
    });
  }

  /* ---------- הפיצה: צילום בסיס + חתיכות מצולמות ---------- */
  function buildPizza() {
    $('#tops').innerHTML = C.toppings.map((t) => `<div class="tg" data-id="${t.id}" data-place=""></div>`).join('');
    // every stage is a real photo layer; load them all up front
    ['l_sauce_cream', 'l_cheese_raw'].concat(C.sauces.map((s) => `pz_${s.id}_baked`)).forEach((n) => { new Image().src = `img/${n}.webp`; });
  }
  // dough first, then the sauce is spread on it, then the cheese goes on
  let shownSauce = null, layTimer = 0;
  function laySauce(sauce) {
    const pz = $('#pz'), img = $('#pzSauce');
    clearTimeout(layTimer);
    pz.classList.remove('sauced', 'cheesed');
    if (sauce !== 'none') img.src = `img/l_sauce_${sauce}.webp`;
    void pz.offsetWidth; // restart the spread animation
    layTimer = setTimeout(() => {
      if (sauce !== 'none') pz.classList.add('sauced');
      layTimer = setTimeout(() => pz.classList.add('cheesed'), sauce === 'none' ? 0 : 650);
    }, 350);
  }
  function renderPizza() {
    const p = state.draft, size = byId(C.sizes, p.size);
    $('#pz').style.transform = `scale(${size.scale})`;
    const baked = `img/pz_${p.sauce}_baked.webp`;
    if (!$('#pzBaked').src.endsWith(baked)) $('#pzBaked').src = baked;
    const want = state.phase === 'closed' ? null : p.sauce;
    if (want !== shownSauce) {
      shownSauce = want;
      if (want) laySauce(want); else { clearTimeout(layTimer); $('#pz').classList.remove('sauced', 'cheesed'); }
    }
    $('#pz').classList.toggle('thin', p.crust === 'thin');
    // the pizza describes itself to screen readers: size, sauce, toppings
    const desc = [t('pizza', { size: size.name }), byId(C.sauces, p.sauce).name].concat(C.toppings.filter((x) => p.tops[x.id]).map((x) => x.name + (p.tops[x.id] === 'full' ? '' : ' (' + PLACE[p.tops[x.id]] + ')')));
    $('#pz').setAttribute('aria-label', desc.join(', '));
    C.toppings.forEach((t, ti) => {
      const g = $(`#tops .tg[data-id="${t.id}"]`), pl = p.tops[t.id] || '';
      if (g.dataset.place === pl) return;
      g.dataset.place = pl;
      if (!pl) { g.innerHTML = ''; return; }
      const pts = spots(ti + 1, t.count, 50 - 13 - t.size / 2).filter((s) => pl === 'full' || (pl === 'right' ? s.x > 1.5 : s.x < -1.5));
      g.innerHTML = pts.map((s, i) => {
        const w = t.size * s.s;
        return `<img class="piece" src="img/${t.imgs[i % t.imgs.length]}.webp" alt="" draggable="false" style="left:${(50 + s.x - w / 2).toFixed(2)}%;top:${(50 + s.y - w / 2).toFixed(2)}%;width:${w.toFixed(2)}%;--r:${s.a}deg;animation-delay:${i * 24}ms">`;
      }).join('');
    });
  }

  /* ---------- קבלה ---------- */
  function pizzaHTML(p, extra) {
    const size = byId(C.sizes, p.size), crust = byId(C.crusts, p.crust), sauce = byId(C.sauces, p.sauce);
    let h = `<div class="line"><span>${t('pizza', { size: size.name })}${extra || ''}</span><span>${fmt(size.price)}</span></div>`;
    h += `<div class="line sub"><span>${t('crustLine', { crust: crust.name })} · ${sauce.id === 'none' ? sauce.name : t('sauceLine', { sauce: sauce.name })}</span><span>${crust.price ? '+' + fmt(crust.price) : ''}</span></div>`;
    C.toppings.forEach((t) => {
      const pl = p.tops[t.id]; if (!pl) return;
      h += `<div class="line sub"><span>+ ${t.name}${pl === 'full' ? '' : ' (' + PLACE[pl] + ')'}</span><span>${fmt(size.topping * (pl === 'full' ? 1 : 0.5))}</span></div>`;
    });
    return h;
  }
  function linesHTML() {
    let h = '';
    if (state.editing) h += `<div class="editing">${t('editingNo', { no: state.editing.no })}</div>`;
    state.pizzas.forEach((p, i) => (h += pizzaHTML(p, `<button type="button" class="ed" data-ed-p="${i}" aria-label="${t('a.editPizza')}">${t('edit')}</button><button type="button" class="x" data-rm-p="${i}" aria-label="${t('a.removePizza')}">✕</button>`)));
    if (draftActive()) h += pizzaHTML(state.draft, `<span class="tag">${t('inPrep')}</span>` + (state.phase === 'building' ? `<button type="button" class="x" data-rm-d aria-label="${t('a.cancelPizza')}">✕</button>` : ''));
    C.drinks.forEach((d) => {
      const q = state.drinks[d.id]; if (!q) return;
      h += `<div class="line"><span>${d.name}<span class="qty"><button type="button" data-dq="${d.id}" data-n="-1" aria-label="${t('a.less', { n: d.name })}">−</button><b>${q}</b><button type="button" data-dq="${d.id}" data-n="1" aria-label="${t('a.more', { n: d.name })}">+</button></span></span><span>${fmt(q * d.price)}</span></div>`;
    });
    return h || `<div class="empty">${t('empty')}</div>`;
  }
  const LABEL = { closed: t('btn.closed'), building: t('btn.building'), baking: t('btn.baking'), boxed: t('btn.boxed') };
  function renderReceipt() {
    const total = fmt(subtotal());
    $('#lines').innerHTML = linesHTML();
    $('#rTotal').textContent = $('#barTotal').textContent = $('#cartTotal').textContent = total;
    [$('#primary'), $('#barPrimary')].forEach((b) => { b.textContent = LABEL[state.phase]; b.disabled = state.phase === 'baking'; });
    if ($('#checkout').open) renderCheckout();
  }
  function render() {
    renderPizza(); renderTrays(); renderReceipt(); renderDrinkInfo();
    // toppings and options only work while building: take them out of the keyboard order otherwise
    const off = state.phase !== 'building';
    $$('.tray, #sizeSeg button, #crustSeg button, #sauceSeg button, #placeSeg button').forEach((b) => (b.disabled = off));
  }

  /* ---------- שלבים: סגור > בנייה > אפייה > ארוז ---------- */
  function setPhase(ph) {
    state.phase = ph;
    document.body.dataset.phase = ph;
    const box = $('#box');
    box.classList.toggle('open', ph === 'building' || ph === 'baking');
    box.classList.toggle('baking', ph === 'baking');
    box.classList.toggle('baked', ph === 'baking' || ph === 'boxed');
    $('#stamp').textContent = ph === 'boxed' ? t('stamp.ready') : t('btn.closed');
    $('#lid').tabIndex = ph === 'closed' ? 0 : -1;
    render();
  }
  function startPizza() {
    state.draft = newDraft();
    shownSauce = null;
    syncSegs.forEach((f) => f());
    setPhase('building');
  }
  function bake() {
    if (state.phase !== 'building') return;
    setPhase('baking');
    let left = BAKE_SECONDS;
    $('#timerNum').textContent = left;
    const iv = setInterval(() => {
      left--;
      if (left > 0) { $('#timerNum').textContent = left; return; }
      clearInterval(iv);
      state.pizzas.push(state.draft);
      setPhase('boxed');
      toast(t('toast.ready'));
      if (state.wantCheckout) { state.wantCheckout = false; setTimeout(openCheckout, 900); }
    }, 1000);
  }
  function primary() {
    if (state.phase === 'closed') startPizza();
    else if (state.phase === 'building') bake();
    else if (state.phase === 'boxed') openCheckout();
  }

  /* ---------- משקאות ---------- */
  let cans = [];
  function buildDrinks() {
    $('#ring').innerHTML = C.drinks.map((d, i) =>
      `<button type="button" class="can" data-i="${i}" aria-label="${d.name}"><img src="img/${d.img}.webp" alt="" draggable="false"></button>`).join('');
    cans = $$('.can');
    const ring = $('#ring');
    let sx = null, moved = false;
    ring.addEventListener('pointerdown', (e) => { sx = e.clientX; moved = false; });
    window.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 30) { moved = true; go(dx < 0 ? 1 : -1); }
    });
    ring.addEventListener('click', (e) => {
      if (moved) { moved = false; return; }
      const b = e.target.closest('.can'); if (!b) return;
      const i = +b.dataset.i;
      if (i === state.di) addDrink(1); else { state.di = i; layoutRing(); }
    });
    $('#dots').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.di = +b.dataset.i; layoutRing(); } });
    $('#dPrev').onclick = () => go(-1);
    $('#dNext').onclick = () => go(1);
    $('#dPlus').onclick = () => addDrink(1);
    $('#dMinus').onclick = () => addDrink(-1);
    $('#drinks').addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
    window.addEventListener('resize', layoutRing);
  }
  function go(dir) { const n = C.drinks.length; state.di = (state.di + dir + n) % n; layoutRing(); }
  function addDrink(n) {
    const d = C.drinks[state.di], q = Math.max(0, Math.min(20, (state.drinks[d.id] || 0) + n));
    if (q) state.drinks[d.id] = q; else delete state.drinks[d.id];
    renderReceipt(); renderDrinkInfo();
  }
  function layoutRing() {
    const ring = $('#ring'), n = cans.length, step = (2 * Math.PI) / n;
    const R = Math.min(ring.clientWidth * 0.43, 410), big = (ring.clientHeight / 186) * 0.84;
    cans.forEach((el, i) => {
      let d = i - state.di;
      d = ((((d + n / 2) % n) + n) % n) - n / 2;
      const a = d * step, x = Math.sin(a) * R, z = Math.cos(a), act = i === state.di;
      const s = act ? big : 0.5 + 0.38 * ((z + 1) / 2);
      el.style.transform = `translate(${x.toFixed(1)}px, ${act ? 0 : ((z - 1) * 26).toFixed(1)}px) scale(${s.toFixed(3)}) rotate(${act ? 9 : 0}deg)`;
      el.style.zIndex = Math.round(z * 100) + 100;
      el.style.opacity = z < -0.25 ? 0.4 : 1;
      el.style.filter = act ? 'none' : `brightness(${(0.4 + 0.3 * ((z + 1) / 2)).toFixed(2)})`;
      el.tabIndex = act ? 0 : -1;
    });
    [...$('#dots').children].forEach((b, i) => { b.classList.toggle('on', i === state.di); if (i === state.di) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    $('#drinks').style.setProperty('--glow', C.drinks[state.di].glow);
    renderDrinkInfo();
  }
  function renderDrinkInfo() {
    const d = C.drinks[state.di];
    $('#bigName').textContent = $('#dName').textContent = d.name;
    $('#dSub').textContent = d.sub;
    $('#dPrice').textContent = fmt(d.price);
    $('#dQty').textContent = state.drinks[d.id] || 0;
  }

  /* ---------- תשלום (דמו) ---------- */
  const dlg = $('#checkout');
  function openCheckout() {
    if (state.phase === 'baking') { state.wantCheckout = true; return; }
    if (state.phase === 'building') {
      state.wantCheckout = true;
      $('#build').scrollIntoView();
      toast(t('toast.ovenFirst'));
      bake();
      return;
    }
    if (!hasItems()) { toast(t('toast.empty')); $('#build').scrollIntoView(); return; }
    $('#coForm').hidden = false; $('#coDone').hidden = true; $('#coErr').textContent = '';
    renderCheckout();
    if (!dlg.open) dlg.showModal();
  }
  function renderCheckout() {
    if (!hasItems() && !$('#coForm').hidden) { dlg.close(); return; }
    const delivery = state.method === 'delivery';
    dlg.classList.toggle('pickup', !delivery);
    const total = subtotal() + (delivery ? C.deliveryFee : 0);
    $('#coLines').innerHTML = linesHTML() + (delivery ? `<div class="line"><span>${t('deliveryFee')}</span><span>${fmt(C.deliveryFee)}</span></div>` : '');
    $('#coTotal').textContent = fmt(total);
    $('#adultNote').style.display = C.drinks.some((d) => d.adult && state.drinks[d.id]) ? 'block' : 'none';
    $('#cardForm').hidden = state.pay !== 'card' || !!state.editing;
    if (state.editing) {
      const diff = total - state.editing.total;
      $('#payBtn').textContent = diff > 0 ? t('pay.updPlus', { x: fmt(diff) }) : diff < 0 ? t('pay.updMinus', { x: fmt(-diff) }) : t('pay.upd');
    } else $('#payBtn').textContent = state.pay === 'cash' ? t('pay.cash', { x: fmt(total) }) : t('pay.card', { x: fmt(total) });
  }
  const orderTotal = () => subtotal() + (state.method === 'delivery' ? C.deliveryFee : 0);
  function validate() {
    const v = (id) => $(id).value.trim();
    if (v('#fName').length < 2) return t('err.name');
    if (!/^0\d{8,9}$/.test(v('#fPhone').replace(/\D/g, ''))) return t('err.phone');
    if (state.method === 'delivery' && v('#fAddr').length < 5) return t('err.addr');
    if (state.pay === 'card' && !state.editing) {
      if (v('#cNum').replace(/\D/g, '').length < 15) return t('err.cnum');
      if (!/^(0[1-9]|1[0-2])\/\d\d$/.test(v('#cExp'))) return t('err.exp');
      if (!/^\d{3,4}$/.test(v('#cCvv'))) return t('err.cvv');
    }
    return '';
  }
  function pay() {
    const err = validate();
    $('#coErr').textContent = err;
    if (err) return;
    const btn = $('#payBtn');
    btn.disabled = true; btn.classList.add('spin');
    btn.textContent = state.pay === 'cash' ? t('pay.sending') : t('pay.processing');
    setTimeout(() => {
      btn.disabled = false; btn.classList.remove('spin');
      const updated = !!state.editing;
      const no = updated ? state.editing.no : '#' + (1000 + Math.floor(Math.random() * 9000));
      // keep a copy of the order so it can still be changed until the courier leaves
      state.placed = {
        no, method: state.method, total: orderTotal(),
        pizzas: JSON.parse(JSON.stringify(state.pizzas)), drinks: { ...state.drinks },
        until: updated ? state.editing.until : Date.now() + C.editWindowMin * 60000,
      };
      state.editing = null;
      showDone(updated);
      notifyOrder(updated ? "updated" : "new");
    }, 1700);
  }
  /* ---------- אוטומציה: כל הזמנה נשמרת בגיליון, נשלחת ל-Webhook (אם מוגדר) ומוכנה לוואטסאפ ---------- */
  function orderText(p) {
    const n = (arr, id) => byId(arr, id).name;
    const lines = p.pizzas.map((z) => {
      const tops = Object.entries(z.tops).map(([id, pl]) => n(C.toppings, id) + (pl === 'full' ? '' : ` (${PLACE[pl]})`));
      return `• ${t('pizza', { size: n(C.sizes, z.size) })}, ${n(C.crusts, z.crust)}, ${n(C.sauces, z.sauce)}${tops.length ? ': ' + tops.join(', ') : ''}`;
    });
    Object.entries(p.drinks).forEach(([id, q]) => lines.push(`• ${q}× ${n(C.drinks, id)}`));
    return lines.join('\n');
  }
  function notifyOrder(status) {
    const p = state.placed; if (!p) return;
    const rec = {
      no: p.no, status, time: new Date().toISOString(), method: p.method, total: p.total, pay: state.pay,
      name: $('#fName').value.trim(), phone: $('#fPhone').value.trim(), address: [$('#fAddr').value.trim(), $('#fApt').value.trim()].filter(Boolean).join(', '),
      note: $('#fNote').value.trim(), items: orderText(p), lang: window.LANG,
    };
    // demo "sheet": this browser keeps the orders, the kitchen page (orders.html) shows them live
    try {
      const all = JSON.parse(localStorage.getItem('orders') || '[]').filter((o) => o.no !== rec.no);
      all.unshift(rec); localStorage.setItem('orders', JSON.stringify(all.slice(0, 200)));
    } catch (e) {}
    // real: send the order to Make / Zapier / n8n / Apps Script, which forwards it to WhatsApp, a Google Sheet, email...
    if (C.orderWebhook) fetch(C.orderWebhook, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(rec) }).catch(() => {});
    // one tap to send the order to the pizzeria on WhatsApp
    const head = { new: '🍕 הזמנה חדשה', updated: '✏️ הזמנה עודכנה', cancelled: '❌ הזמנה בוטלה' }[status];
    const msg = `${head} ${rec.no}\n${rec.items}\n${t('toPayTotal')}: ${fmt(rec.total)}\n${rec.name} · ${rec.phone}${rec.method === 'delivery' ? '\n' + rec.address : ' · ' + t('m.pickup')}${rec.note ? '\n' + rec.note : ''}`;
    const wa = $('#waLink');
    if (wa) { wa.href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`; wa.hidden = status === 'cancelled'; }
  }

  /* ---------- שינוי או ביטול אחרי ההזמנה, עד שהשליח יוצא ---------- */
  let tick = 0;
  const left = () => (state.placed ? Math.max(0, state.placed.until - Date.now()) : 0);
  const mmss = (ms) => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  function showDone(updated) {
    const p = state.placed;
    $('#orderNo').textContent = p.no;
    $('#coDone h2').textContent = updated ? t('done.updated') : t('done.received');
    $('#eta').textContent = p.method === 'delivery' ? t('eta.delivery', { t: C.deliveryTime }) : t('eta.pickup', { t: C.pickupTime, addr: C.address });
    $('#coForm').hidden = true; $('#coDone').hidden = false;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    updateWindow();
  }
  function updateWindow() {
    clearTimeout(tick);
    const ms = left(), open = ms > 0, p = state.placed;
    $('#editMsg').textContent = !p ? '' : open
      ? t('edit.open', { time: mmss(ms), what: t(p.method === 'delivery' ? 'edit.courier' : 'edit.prep') })
      : t('edit.closed', { state: t(p.method === 'delivery' ? 'state.onway' : 'state.prep'), phone: C.phone });
    $('#changeOrder').disabled = $('#cancelOrder').disabled = !open;
    const pill = $('#orderPill');
    pill.hidden = !p;
    if (p) pill.textContent = open ? t('pill.open', { no: p.no, time: mmss(ms) }) : t('pill.closed', { no: p.no, state: t(p.method === 'delivery' ? 'pill.onway' : 'pill.prep') });
    if (p && open) tick = setTimeout(updateWindow, 1000);
  }
  function changeOrder() {
    if (!left()) return;
    if (state.pizzas.length || Object.keys(state.drinks).length || draftActive()) {
      if (!confirm(t('confirm.replace'))) return;
    }
    const p = state.placed;
    state.pizzas = JSON.parse(JSON.stringify(p.pizzas)); state.drinks = { ...p.drinks };
    state.method = p.method;
    [...$('#methodSeg').children].forEach((x) => x.classList.toggle('on', x.dataset.v === p.method));
    state.editing = { no: p.no, total: p.total, until: p.until };
    dlg.close();
    setPhase(state.pizzas.length ? 'boxed' : 'closed');
    $('#build').scrollIntoView({ behavior: 'smooth' });
    toast(t('toast.editHint'));
  }
  function cancelOrder() {
    if (!left() || !confirm(t('confirm.cancel', { no: state.placed.no }))) return;
    const no = state.placed.no;
    notifyOrder("cancelled");
    state.placed = null; state.editing = null;
    updateWindow();
    resetOrder();
    toast(t('toast.cancelled', { no }));
  }
  function resetOrder() {
    state.pizzas = []; state.drinks = {}; state.draft = newDraft(); state.wantCheckout = false; state.editing = null;
    $$('#cNum, #cExp, #cCvv, #fNote').forEach((i) => (i.value = ''));
    $('#ccNum').textContent = '•••• •••• •••• ••••'; $('#ccExp').textContent = 'MM/YY';
    dlg.close();
    syncSegs.forEach((f) => f());
    setPhase('closed');
    window.scrollTo({ top: 0 });
  }
  function afterDoneClosed() {
    if ($('#coDone').hidden || state.editing || !state.placed) return;
    const keep = state.placed; resetOrder(); state.placed = keep; updateWindow();
  }
  function bindCheckout() {
    $('#methodSeg').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.method = b.dataset.v;
      [...$('#methodSeg').children].forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      renderCheckout();
    });
    $('#pays').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state.pay = b.dataset.v;
      [...$('#pays').children].forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      renderCheckout();
    });
    $('#cNum').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = d.replace(/(.{4})(?=.)/g, '$1 ');
      $('#ccNum').textContent = (d + '•'.repeat(16 - d.length)).replace(/(.{4})(?=.)/g, '$1 ');
    });
    $('#cExp').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      $('#ccExp').textContent = e.target.value || 'MM/YY';
    });
    $('#cCvv').addEventListener('input', (e) => (e.target.value = e.target.value.replace(/\D/g, '')));
    $('#fName').addEventListener('input', (e) => ($('#ccWho').textContent = e.target.value || t('cardholder')));
    $('#payBtn').onclick = pay;
    $('#newOrder').onclick = () => { dlg.close(); afterDoneClosed(); };
    $('#changeOrder').onclick = changeOrder;
    $('#cancelOrder').onclick = cancelOrder;
    $('#orderPill').onclick = () => { if (state.placed) showDone(false); };
    // closing the confirmation empties the cart for a new order; the placed order stays editable from the header
    dlg.addEventListener('close', afterDoneClosed);
  }

  /* ---------- כללי ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function editPizza(i) {
    if (state.phase === 'building' || state.phase === 'baking') { toast(t('toast.finishFirst')); return; }
    state.draft = state.pizzas.splice(i, 1)[0];
    shownSauce = null;
    if (dlg.open) dlg.close();
    syncSegs.forEach((f) => f());
    setPhase('building');
    $('#build').scrollIntoView({ behavior: 'smooth' });
    toast(t('toast.rebake'));
  }
  document.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-ed-p]');
    if (ed) return editPizza(+ed.dataset.edP);
    const dq = e.target.closest('[data-dq]');
    if (dq) {
      const id = dq.dataset.dq, q = Math.max(0, Math.min(20, (state.drinks[id] || 0) + +dq.dataset.n));
      if (q) state.drinks[id] = q; else delete state.drinks[id];
      return render();
    }
    const b = e.target.closest('[data-rm-p],[data-rm-d],[data-rm-k]'); if (!b) return;
    if (b.dataset.rmP !== undefined) {
      state.pizzas.splice(+b.dataset.rmP, 1);
      if (state.phase === 'boxed' && !state.pizzas.length) return setPhase('closed');
    } else if (b.dataset.rmD !== undefined) {
      return setPhase(state.pizzas.length ? 'boxed' : 'closed');
    } else delete state.drinks[b.dataset.rmK];
    render();
  });

  fillStatic(); buildOptions(); buildTrays(); buildPizza(); buildDrinks(); bindCheckout();
  $('#lid').onclick = (e) => {
    if (state.phase !== 'closed') return;
    startPizza();
    // opened with the keyboard: the lid disappears, so move focus to the first option
    if (e.detail === 0) setTimeout(() => $('#sizeSeg button.on')?.focus(), 50);
  };
  $('#primary').onclick = $('#barPrimary').onclick = primary;
  $('#morePizza').onclick = startPizza;
  $('#cartBtn').onclick = $('#toCheckout').onclick = openCheckout;
  /* ---------- הזמנה חכמה: טקסט חופשי -> Claude -> פיצה נבנית מול העיניים ---------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let aiBusy = false;
  // is Claude switched on for this site? (no server or no key -> the built-in demo parser)
  const aiReady = fetch('api/ai-status').then((r) => (r.ok ? r.json() : { ai: false })).then((j) => !!j.ai).catch(() => false);
  async function aiOrder(text) {
    const reply = $('#aiReply'), go = $('#aiGo');
    if (!text) { reply.textContent = t('ai.empty'); return; }
    if (aiBusy) return;
    aiBusy = true; go.disabled = true; go.classList.add('spin');
    reply.className = 'aireply'; reply.textContent = t('ai.thinking');
    let res, data = {};
    if (!(await aiReady)) { res = { ok: false, status: 0 }; await wait(500); }
    else try {
      res = await fetch('api/order-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, lang: window.LANG }) });
      data = await res.json().catch(() => ({}));
    } catch (e) { res = { ok: false, status: 0 }; }
    go.disabled = false; go.classList.remove('spin');
    // no Claude key on this site (or no server at all): fall back to the built-in parser
    if (!res.ok && (data.error === 'not_configured' || res.status === 0 || res.status === 404 || res.status === 405) && window.demoParse) {
      const local = window.demoParse(text);
      if (local) { res = { ok: true }; data = local; }
    }
    if (!res.ok) {
      aiBusy = false;
      reply.className = 'aireply err';
      reply.textContent = data.error === 'not_configured' ? t('ai.notConfigured') : res.status === 429 ? t('ai.busy') : t('ai.fail');
      return;
    }
    reply.textContent = data.reply + (data.unavailable && data.unavailable.length ? ' · ' + t('ai.unavailable', { x: data.unavailable.join(', ') }) : '');
    await buildFromAi(data);
    aiBusy = false;
  }
  async function buildFromAi(o) {
    Object.entries(o.drinks || {}).forEach(([id, q]) => { state.drinks[id] = Math.min(20, (state.drinks[id] || 0) + q); });
    const pizzas = o.pizzas || [];
    if (!pizzas.length) { render(); return; }
    if (state.phase === 'baking') { pizzas.forEach((p) => state.pizzas.push(p)); render(); return; }
    // every pizza but the last goes straight into the order; the last is built live in the box
    pizzas.slice(0, -1).forEach((p) => state.pizzas.push(p));
    const last = pizzas[pizzas.length - 1];
    if (dlg.open) dlg.close();
    $('#build').scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.draft = { size: last.size, crust: last.crust, sauce: last.sauce, tops: {} };
    shownSauce = null;
    syncSegs.forEach((f) => f());
    setPhase('building');
    await wait(1300); // the sauce spreads and the cheese goes on first
    for (const [id, place] of Object.entries(last.tops)) {
      if (state.phase !== 'building') break;
      state.draft.tops[id] = place;
      render();
      await wait(450);
    }
    toast(t('toast.rebake'));
  }
  $('#aiForm').addEventListener('submit', (e) => { e.preventDefault(); aiOrder($('#aiText').value.trim()); });
  // voice ordering where the browser supports speech recognition
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const mic = $('#aiMic');
    mic.hidden = false;
    mic.addEventListener('click', () => {
      const rec = new SR();
      rec.lang = { he: 'he-IL', en: 'en-US', ar: 'ar-IL' }[window.LANG] || 'he-IL';
      rec.interimResults = true;
      mic.classList.add('on'); $('#aiReply').className = 'aireply'; $('#aiReply').textContent = t('ai.listening');
      rec.onresult = (e) => { $('#aiText').value = [...e.results].map((r) => r[0].transcript).join(' '); };
      rec.onend = () => { mic.classList.remove('on'); const v = $('#aiText').value.trim(); if (v) aiOrder(v); else $('#aiReply').textContent = ''; };
      rec.onerror = () => { mic.classList.remove('on'); };
      rec.start();
    });
  }

  // switching language reloads the page: keep the order across the reload
  window.__saveOrder = () => {
    try { sessionStorage.setItem('pizzaOrder', JSON.stringify({ pizzas: state.pizzas, drinks: state.drinks, draft: state.draft, phase: state.phase, method: state.method, placed: state.placed, editing: state.editing })); } catch (e) {}
  };
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem('pizzaOrder') || 'null'); sessionStorage.removeItem('pizzaOrder'); } catch (e) {}
  if (saved) {
    Object.assign(state, { pizzas: saved.pizzas || [], drinks: saved.drinks || {}, draft: saved.draft || newDraft(), method: saved.method || 'delivery', placed: saved.placed || null, editing: saved.editing || null });
    [...$('#methodSeg').children].forEach((x) => x.classList.toggle('on', x.dataset.v === state.method));
    syncSegs.forEach((f) => f());
    setPhase(saved.phase === 'building' || saved.phase === 'baking' ? 'building' : state.pizzas.length ? 'boxed' : 'closed');
    if (state.placed) updateWindow();
  } else setPhase('closed');
  layoutRing();
})();
