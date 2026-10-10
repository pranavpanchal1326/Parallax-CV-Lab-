// Edition layer: reading-progress line and opt-in reveal. Content stays visible without this file.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = document.querySelector('.ed-progress');
  if (bar) {
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0); };
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  }
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  const adopt = () => document.querySelectorAll('[data-rv]:not(.rv)').forEach((e, i) => { e.classList.add('rv'); e.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(e); });
  document.documentElement.classList.add('js-rv'); adopt();
  // anything still hidden after load (print preview, background tab) is shown rather than lost
  addEventListener('load', () => setTimeout(() => document.querySelectorAll('.rv:not(.in)').forEach(e => { const r = e.getBoundingClientRect(); if (r.top < innerHeight) e.classList.add('in'); }), 1200));
  window.edAdopt = adopt;
})();
