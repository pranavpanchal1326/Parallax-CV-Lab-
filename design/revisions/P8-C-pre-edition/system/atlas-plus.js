// Atlas+ Studio layer: scroll progress, active section pill, reveal, instrument tilt, swatch copy.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = $('.progress');
  const links = $$('header nav a'), secs = links.map(a => $(a.getAttribute('href')));
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0);
    let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // reveal on scroll
  const targets = $$('.facts>div,.swatch,.type-specimen,.rules article,.handoff-grid a,.section-intro,.library-top,.handoff h2,.handoff>p');
  if ('IntersectionObserver' in window && !reduce) {
    targets.forEach((t, i) => { t.classList.add('rv'); t.style.transitionDelay = (i % 4) * 70 + 'ms'; });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    targets.forEach(t => io.observe(t));
  }

  // gentle 3D tilt on the opening instrument
  const card = $('.opening-instrument');
  if (card && !reduce && matchMedia('(hover:hover)').matches) {
    card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; card.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`; });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  }

  // copy swatch value (swatches are generated asynchronously)
  document.addEventListener('click', async e => {
    const sw = e.target.closest('.swatch'); if (!sw) return;
    const hex = (sw.textContent.match(/#[0-9A-Fa-f]{6}/) || [])[0]; if (!hex) return;
    try { await navigator.clipboard.writeText(hex); } catch { }
    sw.classList.add('copied'); setTimeout(() => sw.classList.remove('copied'), 1400);
  });

  // ghost component id behind the heading follows the selected component
  const idEl = $('#component-id'), head = $('.component-heading');
  if (idEl && head) new MutationObserver(() => { head.dataset.id = (idEl.textContent.match(/C\d{2}/) || [''])[0]; }).observe(idEl, { childList: true, characterData: true, subtree: true });
})();
