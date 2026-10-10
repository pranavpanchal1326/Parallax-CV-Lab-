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

// Part dock (P9-C): previous and next part in one fixed place, plus a jump menu for the sections of this page.
// Built from the page's own sections, so it needs no per-page markup. Tool pages (Lab Map, Scene Studio) do not load this file.
(() => {
  const main = document.querySelector('main'); if (!main || document.querySelector('.ed-dock')) return;
  const src = [...document.scripts].map(s => s.src).find(s => /\/edition\.js(\?|$)/.test(s)); if (!src) return;
  const base = new URL('.', src);
  const PARTS = [['index.html', 'Contents', ''], ['research.html', 'Research', '02'], ['direction.html', 'Direction', '03'], ['review.html', 'Space', '04'], ['system/index.html', 'System', '05'], ['journey.html', 'Journey', '06'], ['complete.html', 'Roles', '07'], ['phase-08/index.html', 'In 3D', '08'], ['../prototype/index.html', 'Prototype', '09']]
    .map(([p, label, n]) => ({ href: new URL(p, base).href, path: new URL(p, base).pathname, label, n }));
  const at = PARTS.findIndex(p => p.path === location.pathname);
  const prev = at > 0 ? PARTS[at - 1] : at < 0 ? PARTS[0] : null, next = at >= 0 && at < PARTS.length - 1 ? PARTS[at + 1] : null;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clean = s => s.replace(/\s+/g, ' ').replace(/^\s*(part\s*)?\d+\s*[·.:–-]\s*/i, '').trim();
  let secs = [];
  function collect() {
    let els = [...main.querySelectorAll('section')].filter(s => s.querySelector('h1,h2') && !s.closest('dialog') && s.offsetParent !== null);
    if (els.length < 2) els = [...main.querySelectorAll('h2')].filter(h => h.offsetParent !== null);
    secs = els.map((el, i) => {
      if (!el.id) el.id = 'sec-' + (i + 1);
      const k = el.matches('section') ? (el.querySelector('.ed-kicker') || el.querySelector('h2,h1')) : el;
      let t = clean(k.textContent); if (t.length > 42) t = t.slice(0, 40).replace(/\s+\S*$/, '') + '…';
      return { el, id: el.id, t };
    });
  }
  const link = (p, dir) => p ? `<a class="ed-btn${dir > 0 ? ' primary' : ''}" href="${p.href}" rel="${dir > 0 ? 'next' : 'prev'}">${dir < 0 ? '<span class="arr" aria-hidden="true">←</span>' : ''}<span class="pl">${p.n ? `<i>${p.n}</i>` : ''}${p.label}</span>${dir > 0 ? '<span class="arr" aria-hidden="true">→</span>' : ''}</a>` : '<span></span>';
  const dock = document.createElement('nav'); dock.className = 'ed-dock'; dock.setAttribute('aria-label', 'Parts and sections');
  dock.innerHTML = `<div>${link(prev, -1)}</div><div class="ed-dock-mid"><button type="button" class="ed-dock-sec" aria-expanded="false" aria-controls="ed-secs"><span class="n"></span><span class="t"></span><span class="car" aria-hidden="true">▴</span></button><ol id="ed-secs" hidden></ol><span class="ed-meter" aria-hidden="true"></span></div><div class="end">${link(next, 1)}</div>`;
  (document.querySelector('.ed-colophon') || main).after(dock);
  document.body.classList.add('has-dock');
  const btn = dock.querySelector('.ed-dock-sec'), list = dock.querySelector('#ed-secs'), meter = dock.querySelector('.ed-meter');
  let cur = -1;
  function paint(force) {
    if (!secs.length) { btn.hidden = true; meter.hidden = true; return; }
    const line = innerHeight * .4; let i = 0;
    secs.forEach((s, n) => { if (s.el.getBoundingClientRect().top <= line) i = n; });
    if (i === cur && !force) return; cur = i;
    btn.hidden = false; meter.hidden = false;
    btn.querySelector('.n').textContent = `${i + 1} / ${secs.length}`; btn.querySelector('.t').textContent = secs[i].t;
    btn.setAttribute('aria-label', `Sections on this page. Now at ${i + 1} of ${secs.length}: ${secs[i].t}`);
    meter.innerHTML = secs.map((_, n) => `<i class="${n === i ? 'cur' : n < i ? 'on' : ''}"></i>`).join('');
    list.innerHTML = secs.map((s, n) => `<li><a href="#${esc(s.id)}"${n === i ? ' aria-current="true"' : ''}><i>${String(n + 1).padStart(2, '0')}</i>${esc(s.t)}</a></li>`).join('');
  }
  const refresh = () => { collect(); paint(true); };
  const toggle = open => { list.hidden = !open; btn.setAttribute('aria-expanded', open); if (open) { refresh(); (list.querySelector('[aria-current]') || list.querySelector('a'))?.focus(); } };
  btn.addEventListener('click', () => toggle(list.hidden));
  list.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !list.hidden) { toggle(false); btn.focus(); } });
  document.addEventListener('click', e => { if (!list.hidden && !e.target.closest('.ed-dock-mid')) toggle(false); });
  // a control that takes focus under the fixed dock is scrolled clear of it
  document.addEventListener('focusin', e => { if (!main.contains(e.target)) return; const r = e.target.getBoundingClientRect(), top = dock.getBoundingClientRect().top; if (r.bottom > top - 8 && r.height < top) scrollBy(0, r.bottom - top + 24); });
  addEventListener('scroll', () => paint(false), { passive: true }); addEventListener('resize', () => paint(true));
  refresh(); addEventListener('load', () => setTimeout(refresh, 1500));
})();

// Folded detail is still part of the record: open every disclosure before printing.
addEventListener('beforeprint', () => document.querySelectorAll('details').forEach(d => { d.open = true; }));
