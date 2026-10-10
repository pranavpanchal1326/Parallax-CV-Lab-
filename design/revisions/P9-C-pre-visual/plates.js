// Full-size viewer for .plate buttons. Each plate carries data-full (image), data-id, data-title and optional data-note.
// Arrow keys move between plates in page order; Escape closes; focus returns to the plate that opened it.
(() => {
  const plates = [...document.querySelectorAll('button.plate[data-full]')];
  if (!plates.length || !('HTMLDialogElement' in window)) return;
  const d = document.createElement('dialog');
  d.className = 'pv'; d.setAttribute('aria-label', 'Screen viewer');
  d.innerHTML = '<div class="pv-top"><span class="pv-id"></span><p class="pv-title"></p><span class="pv-count"></span><button type="button" class="pv-close">Close</button></div>' +
    '<div class="pv-stage" tabindex="0"><img alt=""></div>' +
    '<div class="pv-bot"><p class="pv-note"></p><div class="pv-nav"><button type="button" class="pv-prev">← Previous</button><button type="button" class="pv-next">Next →</button></div></div>';
  document.body.append(d);
  const $ = s => d.querySelector(s), img = $('img'), stage = $('.pv-stage');
  let i = 0, opener = null;
  function show(n) {
    i = (n + plates.length) % plates.length; const p = plates[i];
    img.src = p.dataset.full; img.alt = p.dataset.title || ''; img.classList.toggle('phone', p.closest('.phones') !== null);
    $('.pv-id').textContent = p.dataset.id || ''; $('.pv-title').textContent = p.dataset.title || '';
    $('.pv-note').textContent = p.dataset.note || ''; $('.pv-count').textContent = (i + 1) + ' / ' + plates.length;
    stage.scrollTop = 0;
  }
  plates.forEach((p, n) => p.addEventListener('click', () => { opener = p; show(n); d.showModal(); $('.pv-close').focus(); }));
  $('.pv-close').onclick = () => d.close();
  $('.pv-prev').onclick = () => show(i - 1);
  $('.pv-next').onclick = () => show(i + 1);
  d.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); } });
  d.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus(); });
  // Deep links: #v-13 scrolls to that plate and marks it; #view-13 opens it full size.
  function route() {
    const m = location.hash.match(/^#(v|view)-([a-z0-9]+)$/); if (!m) return;
    const n = plates.findIndex(p => p.id === 'v-' + m[2]); if (n < 0) return;
    const p = plates[n];
    if (m[1] === 'view') { opener = p; show(n); if (!d.open) d.showModal(); return; }
    p.scrollIntoView({ block: 'center' }); p.focus({ preventScroll: true });
    p.classList.add('hit'); setTimeout(() => p.classList.remove('hit'), 2400);
  }
  addEventListener('hashchange', route); route();
})();
