// End-to-end check that runs inside the page (paste into the browser console, or run by an automation tool).
// Clicks through every flow on the site and returns a list of [check, ok, detail].
(async () => {
  const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  const R = [];
  const ok = (name, cond, detail = '') => R.push([name, !!cond, String(detail).slice(0, 160)]);
  const finish = () => document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) {} });
  window.confirm = () => true;
  try { localStorage.removeItem('orders'); } catch (e) {}

  // 1. page basics
  ok('no intro overlay', !q('#intro'));
  ok('header, builder, drinks, info present', q('header.top') && q('#build') && q('#drinks') && q('#info'));
  ok('no horizontal scroll', document.documentElement.scrollWidth <= innerWidth + 1, `${document.documentElement.scrollWidth}/${innerWidth}`);
  await w(800);
  const broken = qa('img').filter((i) => i.complete && !i.naturalWidth).map((i) => i.getAttribute('src'));
  ok('no broken images', !broken.length, broken.join(' '));
  ok('trays disabled before opening box', qa('.tray').every((b) => b.disabled));

  // 2. manual build
  q('#lid').click(); await w(400);
  ok('lid opens -> building', document.body.dataset.phase === 'building');
  ok('trays enabled while building', qa('.tray').every((b) => !b.disabled));
  q('#sizeSeg [data-v=l]').click(); q('#crustSeg [data-v=gf]').click(); q('#sauceSeg [data-v=cream]').click();
  ok('options update draft', q('#sizeSeg [data-v=l]').getAttribute('aria-pressed') === 'true' && q('#lines').innerText.includes('₪10'));
  q('.tray[data-id=mush]').click();
  q('#placeSeg [data-v=right]').click(); q('.tray[data-id=corn]').click();
  q('#placeSeg [data-v=left]').click(); q('.tray[data-id=tuna]').click();
  await w(700);
  ok('toppings drawn on pizza', qa('#tops .piece').length > 10, qa('#tops .piece').length);
  q('#placeSeg [data-v=left]').click(); q('.tray[data-id=tuna]').click(); // same place again removes it
  ok('clicking a topping again removes it', !q('.tray[data-id=tuna]').classList.contains('on'));
  const priceBuilding = q('#rTotal').textContent;
  ok('price = 72 + 10 + 10 + 5', priceBuilding === '₪97', priceBuilding);
  ok('pizza described for screen readers', /שמנת|Cream|كريمة/.test(q('#pz').getAttribute('aria-label')), q('#pz').getAttribute('aria-label'));
  q('#primary').click(); await w(300);
  ok('baking phase', document.body.dataset.phase === 'baking');
  await w(3400);
  ok('boxed after bake', document.body.dataset.phase === 'boxed');
  ok('after-bake buttons visible', getComputedStyle(q('#after')).display !== 'none');

  // 3. second pizza, then edit / remove from the receipt
  q('#morePizza').click(); await w(300);
  ok('another pizza starts fresh', document.body.dataset.phase === 'building' && !Object.keys(q('.tray.on') ? { a: 1 } : {}).length);
  q('.tray[data-id=bolive]').click(); q('#primary').click(); await w(3500);
  ok('two pizzas in receipt', qa('#lines [data-rm-p]').length === 2);
  q('[data-ed-p="0"]').click(); await w(400);
  ok('edit puts pizza back in the box', document.body.dataset.phase === 'building' && q('.tray[data-id=mush]').classList.contains('on') && q('#sauceSeg [data-v=cream]').classList.contains('on'));
  q('#primary').click(); await w(3500);
  q('[data-rm-p="1"]').click(); await w(200);
  ok('remove pizza', qa('#lines [data-rm-p]').length === 1);

  // 4. drinks carousel
  const first = q('#dName').textContent;
  q('#dNext').click(); await w(200);
  ok('carousel next', q('#dName').textContent !== first);
  q('#dPrev').click(); await w(200);
  ok('carousel prev', q('#dName').textContent === first);
  q('#dPlus').click(); q('#dPlus').click(); q('#dMinus').click();
  ok('drink stepper', q('#dQty').textContent === '1');
  const dq = q('[data-dq][data-n="1"]'); dq.click(); await w(100);
  ok('receipt drink +', q('#lines .qty b').textContent === '2');

  // 5. checkout validation and payment
  q('#primary').click(); await w(300);
  ok('checkout opens', q('#checkout').open);
  q('#fName').value = ''; q('#payBtn').click();
  ok('validates name', q('#coErr').textContent.length > 0, q('#coErr').textContent);
  q('#fName').value = 'Test User'; q('#fPhone').value = '12'; q('#payBtn').click();
  ok('validates phone', q('#coErr').textContent.length > 0, q('#coErr').textContent);
  q('#fPhone').value = '0521234567'; q('#fAddr').value = ''; q('#payBtn').click();
  ok('validates address for delivery', q('#coErr').textContent.length > 0);
  q('#methodSeg [data-v=pickup]').click();
  ok('pickup hides address and fee', q('#checkout').classList.contains('pickup') && !q('#coLines').innerText.includes('15'));
  q('#methodSeg [data-v=delivery]').click(); q('#fAddr').value = 'Herzl 10, Tel Aviv';
  q('#pays [data-v=bit]').click();
  ok('non-card payment hides card form', q('#cardForm').hidden);
  q('#pays [data-v=card]').click();
  q('#cNum').value = '4580'; q('#cNum').dispatchEvent(new Event('input')); q('#payBtn').click();
  ok('validates card number', q('#coErr').textContent.length > 0);
  q('#cNum').value = '4580000000000000'; q('#cNum').dispatchEvent(new Event('input'));
  q('#cExp').value = '1229'; q('#cExp').dispatchEvent(new Event('input'));
  q('#cCvv').value = '123';
  ok('card expiry formats MM/YY', q('#cExp').value === '12/29', q('#cExp').value);
  const total = q('#coTotal').textContent;
  q('#payBtn').click(); await w(2000);
  ok('order received screen', !q('#coDone').hidden, total);
  ok('whatsapp link has the order', decodeURIComponent(q('#waLink').href).includes(q('#orderNo').textContent));
  let saved = []; try { saved = JSON.parse(localStorage.getItem('orders') || '[]'); } catch (e) {}
  ok('order saved for kitchen screen', saved.length === 1 && saved[0].status === 'new');
  ok('edit window countdown shown', /\d:\d\d/.test(q('#editMsg').textContent), q('#editMsg').textContent);

  // 6. change, update, cancel
  q('#newOrder').click(); await w(300);
  ok('closing keeps order pill', !q('#orderPill').hidden && q('#rTotal').textContent === '₪0');
  q('#orderPill').click(); await w(200); q('#changeOrder').click(); await w(400);
  ok('change order restores items', q('#lines').innerText.includes(saved[0].no));
  q('[data-dq][data-n="-1"]').click(); await w(100);
  q('#primary').click(); await w(300);
  ok('update button shows refund', /זיכוי|refund|استرداد/.test(q('#payBtn').textContent), q('#payBtn').textContent);
  q('#payBtn').click(); await w(2000);
  try { saved = JSON.parse(localStorage.getItem('orders') || '[]'); } catch (e) {}
  ok('update saved', saved[0] && saved[0].status === 'updated');
  q('#cancelOrder').click(); await w(400);
  try { saved = JSON.parse(localStorage.getItem('orders') || '[]'); } catch (e) {}
  ok('cancel saved and pill gone', saved[0] && saved[0].status === 'cancelled' && q('#orderPill').hidden);

  // 7. smart order (demo parser when no Claude key)
  q('#aiText').value = 'ענקית חצי זיתים חצי פטריות עם תירס, שתי קולות ופפרוני';
  q('#aiForm').requestSubmit(); await w(4200); finish();
  ok('smart order builds pizza', document.body.dataset.phase === 'building' && q('.tray[data-id=corn]').classList.contains('on'), q('#aiReply').textContent);
  ok('smart order flags unavailable', /פפרוני/.test(q('#aiReply').textContent));
  q('#aiText').value = 'בא לי משהו טעים'; q('#aiForm').requestSubmit(); await w(1200);
  ok('smart order handles nonsense', q('#aiReply').classList.contains('err'), q('#aiReply').textContent);

  // 8. accessibility menu
  q('.a11y-btn').click(); await w(100);
  ok('a11y menu opens', !q('.a11y-panel').hidden);
  q('.a11y-panel [data-k=contrast]').click(); q('.a11y-panel [data-size="1"]').click();
  ok('a11y settings apply', document.documentElement.classList.contains('a11y-contrast') && document.documentElement.classList.contains('a11y-zoom'));
  q('.a11y-reset').click();
  ok('a11y reset', !document.documentElement.classList.contains('a11y-contrast'));
  q('.a11y-st').click(); await w(100);
  ok('a11y statement opens', q('.a11y-statement').open);
  q('.a11y-statement').close();
  ok('skip link first', document.body.firstElementChild.classList.contains('skiplink'));

  // 9. FAQ / info
  ok('faq rendered', qa('#faq details').length >= 5);
  ok('hours rendered', qa('#hours dt').length >= 3);
  const errs = window.__errors || [];
  ok('no JS errors captured', !errs.length, errs.join(' | '));

  const failed = R.filter((r) => !r[1]);
  return JSON.stringify({ passed: R.length - failed.length, total: R.length, failed });
})();
