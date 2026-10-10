// Review page layer: progress, active nav, reveal, area bars, hide callouts on the previous study.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = $('.progress'), links = $$('header nav a[href^="#"]'), secs = links.map(a => $(a.getAttribute('href')));
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0);
    let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if ('IntersectionObserver' in window && !reduce) {
    const t = $$('.spec p,.plan,.table-scroll,.detail img,.chips li,.model-wrap,.split>div>h2,.pending');
    t.forEach((e, i) => { e.classList.add('rv'); e.style.transitionDelay = (i % 4) * 80 + 'ms'; });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
    t.forEach(e => io.observe(e));
  }

  // proportional bars under each programme row (rows are added after the geometry loads)
  const areas = $('#areas');
  if (areas) new MutationObserver(() => {
    const rows = $$('tr', areas), vals = rows.map(r => parseFloat(r.lastElementChild?.textContent)), max = Math.max(...vals.filter(Number.isFinite));
    rows.forEach((r, i) => { const td = r.firstElementChild; if (td && Number.isFinite(vals[i]) && !td.querySelector('.bar')) { const b = document.createElement('i'); b.className = 'bar'; b.style.setProperty('--w', (vals[i] / max * 100).toFixed(1) + '%'); td.append(b); } });
  }).observe(areas, { childList: true });

  // callouts only describe the revised study
  const hero = $('.hero'); const sync = () => hero.classList.toggle('prev', $('#before').getAttribute('aria-pressed') === 'true');
  new MutationObserver(sync).observe($('#before'), { attributes: true, attributeFilter: ['aria-pressed'] });
})();
