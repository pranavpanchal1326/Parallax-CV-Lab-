// Part 04 page layer: proportional area bars; callouts and legend describe the revised study only.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // proportional bars under each programme row (rows are added after the geometry loads)
  const areas = $('#areas');
  if (areas) new MutationObserver(() => {
    const rows = $$('tr', areas), vals = rows.map(r => parseFloat(r.lastElementChild?.textContent)), max = Math.max(...vals.filter(Number.isFinite));
    rows.forEach((r, i) => { const td = r.firstElementChild; if (td && Number.isFinite(vals[i]) && !td.querySelector('.bar')) { const b = document.createElement('i'); b.className = 'bar'; b.setAttribute('aria-hidden', 'true'); b.style.setProperty('--w', (vals[i] / max * 100).toFixed(1) + '%'); td.append(b); } });
  }).observe(areas, { childList: true });

  const hero = $('.hero'), before = $('#before');
  if (hero && before) new MutationObserver(() => hero.classList.toggle('prev', before.getAttribute('aria-pressed') === 'true')).observe(before, { attributes: true, attributeFilter: ['aria-pressed'] });
})();
