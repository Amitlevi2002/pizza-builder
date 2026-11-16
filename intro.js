/* ============================================================
   Opening intro: a camera that flies forward from the street,
   through the door, past the counter and oven, to the pizza.
   Plays once per visit. ?intro=1 in the URL shows it again.
   ============================================================ */
(() => {
  const el = document.getElementById('intro');
  if (!el) return;
  const force = /[?&]intro=(1|hold)/.test(location.search), hold = /[?&]intro=hold/.test(location.search);
  let seen = false;
  try { seen = sessionStorage.getItem('introSeen') === '1'; } catch (e) {}
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-still');
  if ((seen || reduce) && !force) { el.remove(); return; }

  // each shot: image, start/end in ms, where the camera flies to (transform-origin), zoom amount
  const SHOTS = [
    { img: 'img/i3_oven.webp', t0: 0, t1: 1700, origin: '50% 54%', z: 0.45 },
  ];
  const FINAL_AT = 1250, END_AT = 3000, XF = 420; // crossfade length

  document.documentElement.classList.add('intro-on');
  el.hidden = false;
  el.innerHTML =
    SHOTS.map((s, i) => `<div class="ishot" data-i="${i}"><img src="${s.img}" alt="" draggable="false"></div>`).join('') +
    `<div class="ishot ifinal"><div class="ibox"><div class="iliner"><img src="img/pz_tomato_baked.webp" alt="" draggable="false"></div></div><div class="isteam"></div></div>
     <div class="igrade" aria-hidden="true"></div>
     <button type="button" class="iskip">${window.t ? window.t('skip') : 'דלגו'}</button>`;

  let done = false;
  const anims = [];
  function finish() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    el.classList.add('out');
    document.documentElement.classList.remove('intro-on');
    window.scrollTo(0, 0);
    setTimeout(() => { anims.forEach((a) => a.cancel()); el.remove(); }, 750);
  }
  el.querySelector('.iskip').addEventListener('click', finish);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });

  function run() {
    if (done) return;
    el.classList.add('go');
    const shots = el.querySelectorAll('.ishot');
    SHOTS.forEach((s, i) => {
      const d = s.t1 - s.t0, f = XF / d, z0 = s.z0 || 1;
      const node = shots[i];
      node.style.transformOrigin = s.origin;
      // steady forward glide, then a fast push "through" into the next space
      anims.push(node.animate([
        { opacity: i ? 0 : 1, filter: i ? 'blur(10px)' : 'blur(0px)', transform: `scale(${z0})` },
        { offset: f, opacity: 1, filter: 'blur(0px)', transform: `scale(${z0 + s.z * f})` },
        { offset: 1 - f, opacity: 1, filter: 'blur(0px)', transform: `scale(${z0 + s.z * (1 - f)})` },
        { offset: 1, opacity: 1, filter: 'blur(9px)', transform: `scale(${z0 + s.z + 0.5})` },
      ], { duration: d, delay: s.t0, easing: 'linear', fill: 'both' }));
    });
    // final: the camera tilts down onto the pizza in its box and settles
    const fin = shots[SHOTS.length];
    anims.push(fin.animate([
      { opacity: 0, filter: 'blur(10px)', transform: 'scale(1.35) rotate(-8deg)' },
      { offset: 0.3, opacity: 1, filter: 'blur(0px)', transform: 'scale(1.22) rotate(-6deg)' },
      { offset: 0.8, opacity: 1, filter: 'blur(0px)', transform: 'scale(1.02) rotate(0deg)' },
      { offset: 1, opacity: 1, filter: 'blur(0px)', transform: 'scale(1) rotate(0deg)' },
    ], { duration: END_AT - FINAL_AT, delay: FINAL_AT, easing: 'cubic-bezier(.25,.6,.3,1)', fill: 'both' }));
    if (!hold) setTimeout(finish, END_AT + 150);
  }

  // start once the images are ready; if the connection is too slow, skip the intro
  const srcs = SHOTS.map((s) => s.img).concat("img/pz_tomato_baked.webp", "img/surface.webp", "img/kraft.webp");
  let left = srcs.length;
  const ready = () => { if (--left === 0) run(); };
  srcs.forEach((src) => { const im = new Image(); im.onload = im.onerror = ready; im.src = src; });
  setTimeout(() => { if (!el.classList.contains('go')) finish(); }, 5000);
})();
