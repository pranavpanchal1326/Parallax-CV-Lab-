// PARALLAX P8-A Lab Map. Plan-first; 3D is optional and loads only when requested (G16.13–15).
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const GEO_URL = '/spatial/lab_geometry.json';
const GLB_URL = '/spatial/exports/lab_interactive.glb';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let G, R, selected = null, mode = 'plan', reviewState = 'normal', three = null;

const ZONE_NAMES = { CMP: 'Computing', STO: 'Kit storage', C1: 'Controlled capture', SPN: 'Circulation spine', FAC: 'Faculty', COL: 'Collaboration', S1: 'Signal bench' };
const ZONE_FILL = { CMP: '#E6E9FF', STO: '#EAE6DC', C1: '#2A323D', SPN: '#F4F1E9', FAC: '#EAE6DC', COL: '#EFEBDF', S1: '#E8F3EC' };

function tone(r) {
  const a = r.availability;
  if (a.startsWith('Restricted')) return 'bad';
  if (a.startsWith('Location unknown')) return 'warn';
  if (a.startsWith('Bookable') || a.startsWith('Open')) return 'ok';
  return '';
}
function occTone(o) { return o.startsWith('In use') ? 'info' : o === 'Unknown' ? 'warn' : ''; }
function el(tag, attrs = {}, parent) { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (parent) parent.append(e); return e; }

// ---------- data ----------
const [geo, res] = await Promise.all([fetch(GEO_URL).then(r => r.json()), fetch('/design/phase-08/data/resources.json').then(r => r.json())]);
G = geo; R = res;
let projectionTime = null;
for (const r of R.resources) { r.availability = 'Unknown'; r.occupancy = 'Unknown'; delete r.note; }
const byId = Object.fromEntries(R.resources.map(r => [r.id, r]));
const furn = Object.fromEntries(G.furniture.map(f => [f.id, f]));

// ---------- freshness (G16.08–09) ----------
function renderFresh() {
  $('#fresh').textContent = projectionTime ? 'REACT EXAMPLE · updated at example time ' + projectionTime + (reviewState === 'stale' ? ' · delayed projection demonstration' : '') : 'Waiting for React projection';
  document.body.dataset.stale = reviewState === 'stale';
}

// ---------- list ----------
let zoneFilter = null;
function renderChips() {
  const w = $('#zonechips'); w.innerHTML = '';
  for (const z of [null, ...new Set(R.resources.map(r => r.zone))]) {
    const b = document.createElement('button'); b.textContent = z || 'All'; b.setAttribute('aria-pressed', zoneFilter === z); if (z) b.title = ZONE_NAMES[z];
    b.onclick = () => { zoneFilter = z; renderChips(); renderList($('#q').value); };
    w.append(b);
  }
}
function renderList(filter = '') {
  const f = filter.trim().toLowerCase();
  const wrap = $('#groups'); wrap.innerHTML = '';
  const zones = [...new Set(R.resources.map(r => r.zone))];
  let total = 0;
  for (const z of zones) {
    if (zoneFilter && z !== zoneFilter) continue;
    const items = R.resources.filter(r => r.zone === z && (!f || (r.id + ' ' + r.name + ' ' + z + ' ' + ZONE_NAMES[z]).toLowerCase().includes(f)));
    if (!items.length) continue;
    total += items.length;
    const g = document.createElement('div'); g.className = 'group';
    g.innerHTML = `<h3>${z} · ${ZONE_NAMES[z].toUpperCase()}</h3>`;
    for (const r of items) {
      const b = document.createElement('button'); b.className = 'res'; b.dataset.id = r.id;
      b.setAttribute('aria-current', selected === r.id);
      b.innerHTML = `<span class="id">${r.id}</span><span class="nm">${r.name}</span><span class="st"><b class="${tone(r)}">${r.availability}</b> · ${r.occupancy}</span>`;
      b.addEventListener('click', () => select(r.id, true));
      g.append(b);
    }
    wrap.append(g);
  }
  if (!wrap.children.length) wrap.innerHTML = '<p class="small muted" style="padding:12px 8px">No resource matches. Try a zone code such as C1 or S1, or clear the zone filter.</p>';
  $('#count').textContent = `${total} of ${R.resources.length} resources`;
}
$('#q').addEventListener('input', e => renderList(e.target.value));
addEventListener('keydown', e => {
  const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName);
  if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); $('#q').select(); }
  else if (e.key === 'Escape' && !$('#safety').open) { if (typing && $('#q').value) { $('#q').value = ''; renderList(''); } else if (selected) { selected = null; for (const b of document.querySelectorAll('.res')) b.setAttribute('aria-current', 'false'); renderDetail(); highlightPlan(false); if (three) three.highlight(null); } }
});
const openSafety = () => { const d = $('#safety'); if (!d.open) d.showModal(); };
document.querySelector('.shell .safety').addEventListener('click', e => { e.preventDefault(); openSafety(); });
if (location.hash === '#safety') openSafety();
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $('#groups .res'); if (first) select(first.dataset.id, true); } });

// ---------- detail drawer (G16.03) ----------
function renderDetail() {
  const d = $('#detail');
  if (!selected) {
    d.innerHTML = `<p class="tag">NOTHING SELECTED</p><h2>Choose a resource</h2><p class="muted small" style="margin:0">Pick from the list, the plan or the model. Details always appear here as text — the model never holds information on its own.</p>
    <div class="facts"><div class="fact"><span>AVAILABILITY</span>Can it be booked?</div><div class="fact"><span>OCCUPANCY</span>Is someone using it now?</div></div>
    <p class="small muted" style="margin:0">Different facts, never merged into one colour.</p>
    <p class="small muted" style="margin:auto 0 0;line-height:2"><span class="kbd">/</span> search · <span class="kbd">Enter</span> open first match · <span class="kbd">Esc</span> clear</p>`;
    return;
  }
  const r = byId[selected], f = furn[r.id];
  const restricted = r.availability.startsWith('Restricted'), unknownLoc = r.availability.startsWith('Location unknown');
  const bookable = r.availability === 'Bookable';
  d.innerHTML = `<p class="tag">${r.zone} · ${ZONE_NAMES[r.zone].toUpperCase()} · ${r.kind.toUpperCase()}</p>
  <div class="ident">${r.id}</div><p class="nm2">${r.name}</p>
  <div class="facts"><div class="fact"><span>AVAILABILITY</span><b class="chip ${tone(r)}">${r.availability}</b></div><div class="fact"><span>OCCUPANCY</span><b class="chip ${occTone(r.occupancy)}">${r.occupancy}</b></div></div>
  ${document.body.dataset.stale === 'true' ? '<div class="notice"><strong>This information may be out of date</strong>Delayed projection demonstration. Check the React record before relying on it.</div>' : ''}
  ${r.note ? `<p class="small" style="margin:0">${r.note}</p>` : ''}
  ${unknownLoc ? '<div class="notice"><strong>Location unknown</strong>The plan marks its home position, not where it is now.</div>' : ''}
  <dl class="kv">${f ? `<dt>Plan position</dt><dd>x ${f.x.toFixed(2)} m · y ${f.y.toFixed(2)} m</dd><dt>Footprint</dt><dd>${f.w} × ${f.d} m</dd>` : r.home ? `<dt>Home position</dt><dd>x ${r.home.x.toFixed(2)} m · y ${r.home.y.toFixed(2)} m (dashed on the plan)</dd>` : '<dt>Plan position</dt><dd>Not recorded</dd>'}<dt>Viewpoint</dt><dd>${R.views[r.view].label}</dd></dl>
  <div class="siblings"><span class="k">ALSO IN ${r.zone}</span><div>${R.resources.filter(o => o.zone === r.zone && o.id !== r.id).map(o => `<button class="sib" data-id="${o.id}" title="${o.name}">${o.id}</button>`).join('') || '<span class="muted small">Nothing else here.</span>'}</div></div>
  <div class="seg">${bookable ? '<button class="btn primary" id="open-react-asset">Open React asset record</button>' : `<button class="btn primary" disabled aria-describedby="why">Book this setup</button>`}
  <button class="btn" id="show-view">Show in ${mode === '3d' ? 'model' : 'plan'}</button></div>
  ${!bookable ? `<p class="small muted" id="why" style="margin:0">${restricted ? 'Booking is unavailable while this item is restricted.' : unknownLoc ? 'Not bookable until located.' : 'Not booked through PARALLAX.'}</p>` : ''}`;
  for (const b of d.querySelectorAll('.sib')) b.onclick = () => select(b.dataset.id, true);
  $('#show-view').addEventListener('click', () => { if (mode === '3d' && three) three.goTo(r.view, r.id); else highlightPlan(true); });
}

function select(id, fromList) {
  selected = id;
  for (const b of document.querySelectorAll('.res')) b.setAttribute('aria-current', b.dataset.id === id);
  renderDetail(); highlightPlan(false);
  if (three) { three.highlight(id); if ($('#follow').checked && mode === '3d') three.goTo(byId[id].view, id); }
  if (fromList && innerWidth < 760) $('#viewer').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}

// ---------- plan (always available; core lookup works without WebGL) ----------
let svg;
function renderPlan() {
  const v = $('#viewer'); v.innerHTML = '';
  svg = el('svg', { viewBox: '-0.9 -0.9 11.8 9.5', role: 'group', 'aria-labelledby': 'pt pd' }, v);
  el('title', { id: 'pt' }, svg).textContent = 'Lab floor plan, P4-D, 10 by 7 metres';
  el('desc', { id: 'pd' }, svg).textContent = 'Computing and capture to the north, a 1.5 metre spine east to west, faculty, collaboration and the signal bench to the south. Select a resource to show it.';
  // drafting sheet: paper, 1 m grid ticks, wall outline
  el('rect', { x: -.9, y: -.9, width: 11.8, height: 9.5, rx: .08, fill: '#F4F1E9' }, svg);
  for (let i = 0; i <= 10; i++) { el('line', { x1: i, y1: -.3, x2: i, y2: -.18, stroke: '#9AA0AA', 'stroke-width': .02 }, svg); if (i % 2 === 0) el('text', { x: i, y: -.38, 'font-size': .11, 'text-anchor': 'middle', fill: '#535B66', 'font-family': 'JetBrains Mono, monospace' }, svg).textContent = i; }
  for (let j = 0; j <= 7; j++) { el('line', { x1: -.3, y1: j, x2: -.18, y2: j, stroke: '#9AA0AA', 'stroke-width': .02 }, svg); if (j % 2 === 0) el('text', { x: -.4, y: j + .04, 'font-size': .11, 'text-anchor': 'end', fill: '#535B66', 'font-family': 'JetBrains Mono, monospace' }, svg).textContent = j; }
  el('rect', { x: -.1, y: -.1, width: 10.2, height: 7.2, fill: 'none', stroke: '#20232B', 'stroke-width': .08 }, svg);
  for (const z of G.zones) {
    el('rect', { x: z.x, y: z.y, width: z.w, height: z.d, fill: ZONE_FILL[z.id], stroke: '#F4F1E9', 'stroke-width': .03, 'data-zone': z.id }, svg);
    const dark = z.id === 'C1', ty = z.y + (z.id === 'CMP' || z.id === 'STO' ? z.d - .12 : .24), tx = z.x + (z.id === 'CMP' ? .85 : .1);
    const t = el('text', { x: tx, y: ty, 'font-size': .15, 'font-weight': 700, fill: dark ? '#6EE7C5' : '#3A4150', 'font-family': 'JetBrains Mono, monospace' }, svg);
    t.textContent = z.id === 'SPN' ? 'SPN · 1.5 m spine' : z.id;
    if (z.w >= 1.7 && z.id !== 'SPN') { const n = el('text', { x: tx + .15 * .62 * (z.id.length + 1), y: ty, 'font-size': .115, fill: dark ? '#BDC7D9' : '#535B66', 'font-family': 'JetBrains Mono, monospace' }, svg); n.textContent = ZONE_NAMES[z.id].toUpperCase(); }
  }
  for (const o of G.openings.filter(o => o.type === 'door')) { const x = o.wall === 'W' ? -.1 : 10.1; el('line', { x1: x, y1: o.from, x2: x, y2: o.to, stroke: '#3346D3', 'stroke-width': .14 }, svg); const t = el('text', { x: o.wall === 'W' ? -.55 : 10.2, y: o.from - .12, 'font-size': .14, fill: '#3346D3', 'font-family': 'JetBrains Mono, monospace' }, svg); t.textContent = o.id; }
  for (const f of G.furniture) {
    const r = byId[f.id];
    const g = el('g', r ? { class: 'plan-res', tabindex: 0, role: 'button', 'aria-label': `${f.id}, ${r.name}, ${r.availability}, ${r.occupancy}`, 'data-id': f.id } : {}, svg);
    el('rect', { x: f.x, y: f.y, width: f.w, height: f.d, rx: .03, fill: f.type === 'partition' || f.type === 'backdrop' ? '#20232B' : '#FFFFFF', stroke: '#535B66', 'stroke-width': .015 }, g);
    if (r) {
      const holds = R.resources.some(o => o.home && o.home.x >= f.x && o.home.x <= f.x + f.w && o.home.y >= f.y && o.home.y <= f.y + f.d);
      const cx = f.x + f.w / 2, cy = holds ? f.y + f.d * .85 : f.y + f.d / 2, t = tone(r);
      // status marker: shape as well as colour (restricted triangle, unknown ring, available dot)
      if (t === 'bad') el('path', { d: `M${cx} ${cy - .13} l.13 .22 h-.26z`, fill: '#B42318' }, g);
      else if (t === 'warn') el('circle', { cx, cy, r: .09, fill: 'none', stroke: '#795700', 'stroke-width': .04 }, g);
      else el('circle', { cx, cy, r: .06, fill: t === 'ok' ? '#1C7148' : '#747B87' }, g);
      if (f.w >= .6 || f.d >= .6) { const lt = el('text', { x: f.x + .05, y: f.y + .19, 'font-size': .14, fill: f.type === 'backdrop' ? '#F4F6FB' : '#20232B', 'font-family': 'JetBrains Mono, monospace' }, g); lt.textContent = f.id; }
      g.addEventListener('click', () => select(f.id));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(f.id); } });
    }
  }
  // Portable items without plan geometry: dashed home outline (G16.12 — not silently missing)
  for (const r of R.resources.filter(r => r.home && !furn[r.id])) {
    const h = r.home, g = el('g', { class: 'plan-res', tabindex: 0, role: 'button', 'aria-label': `${r.id}, ${r.name}, home position, ${r.availability}`, 'data-id': r.id }, svg);
    el('rect', { x: h.x, y: h.y, width: h.w, height: h.d, fill: 'none', stroke: '#795700', 'stroke-width': .025, 'stroke-dasharray': '.05 .03' }, g);
    el('circle', { cx: h.x + h.w / 2, cy: h.y + h.d / 2, r: .07, fill: 'none', stroke: '#795700', 'stroke-width': .035 }, g);
    g.addEventListener('click', () => select(r.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(r.id); } });
  }
  const a = G.camera_axis; el('line', { x1: a.from[0], y1: a.from[1], x2: a.to[0], y2: a.to[1], stroke: '#D9EF73', 'stroke-width': .03, 'stroke-dasharray': '.08 .05' }, svg);
  const lg = el('g', { transform: 'translate(0 7.35)', 'font-size': .14, 'font-family': 'DM Sans, sans-serif', fill: '#20232B' }, svg);
  el('circle', { cx: .08, cy: 0, r: .06, fill: '#1C7148' }, lg); el('text', { x: .22, y: .05 }, lg).textContent = 'Bookable';
  el('path', { d: 'M1.6 -.1 l.11 .19 h-.22z', fill: '#B42318' }, lg); el('text', { x: 1.82, y: .05 }, lg).textContent = 'Restricted';
  el('circle', { cx: 3.35, cy: 0, r: .07, fill: 'none', stroke: '#795700', 'stroke-width': .035 }, lg); el('text', { x: 3.5, y: .05 }, lg).textContent = 'Location / occupancy unknown';
  el('text', { x: 6.9, y: .05, fill: '#535B66' }, lg).textContent = 'Not an emergency route plan';
  // title block, north arrow and scale bar
  const tb = el('g', { transform: 'translate(0 7.85)', 'font-family': 'JetBrains Mono, monospace' }, svg);
  el('rect', { x: 0, y: 0, width: 10, height: .62, fill: 'none', stroke: '#20232B', 'stroke-width': .02 }, tb);
  el('line', { x1: 6.1, y1: 0, x2: 6.1, y2: .62, stroke: '#20232B', 'stroke-width': .02 }, tb);
  el('text', { x: .14, y: .27, 'font-size': .17, 'font-weight': 700, fill: '#20232B', 'font-family': 'Familjen Grotesk, Arial, sans-serif' }, tb).textContent = 'PARALLAX · SIGNAL & COMPUTER VISION LAB';
  el('text', { x: .14, y: .5, 'font-size': .11, fill: '#535B66' }, tb).textContent = 'FLOOR PLAN · P4-D · 10 × 7 m ENVELOPE · CONCEPTUAL, NOT SURVEYED';
  el('text', { x: 6.25, y: .27, 'font-size': .11, fill: '#535B66' }, tb).textContent = 'SCALE';
  el('rect', { x: 6.8, y: .17, width: .5, height: .08, fill: '#20232B' }, tb); el('rect', { x: 7.3, y: .17, width: .5, height: .08, fill: '#fff', stroke: '#20232B', 'stroke-width': .015 }, tb);
  el('text', { x: 6.8, y: .45, 'font-size': .1, fill: '#535B66' }, tb).textContent = '0'; el('text', { x: 7.8, y: .45, 'font-size': .1, fill: '#535B66', 'text-anchor': 'middle' }, tb).textContent = '1 m';
  const na = el('g', { transform: 'translate(9.45 .31)' }, tb); el('path', { d: 'M0 -.2 L.11 .14 L0 .07 L-.11 .14Z', fill: '#20232B' }, na); el('text', { x: 0, y: .27, 'font-size': .1, 'text-anchor': 'middle', fill: '#20232B' }, na).textContent = 'N';
  highlightPlan(false);
}
function highlightPlan(focus) {
  if (!svg) return;
  for (const g of svg.querySelectorAll('.plan-res')) { const on = g.dataset.id === selected; const r = g.querySelector('rect'); r.setAttribute('stroke', on ? '#3346D3' : '#535B66'); r.setAttribute('stroke-width', on ? .07 : .015); if (on && focus) g.focus(); }
  svg.querySelector('.sel-ring')?.remove();
  const sg = selected && svg.querySelector(`.plan-res[data-id="${selected}"] rect`);
  if (sg) { const b = sg.getBBox(); el('rect', { class: 'sel-ring', x: b.x - .06, y: b.y - .06, width: b.width + .12, height: b.height + .12, rx: .06 }, svg); }
  const z = selected && byId[selected].zone;
  for (const zr of svg.querySelectorAll('[data-zone]')) zr.setAttribute('opacity', !z || zr.dataset.zone === z || zr.dataset.zone === 'SPN' ? 1 : .55);
}

// ---------- 3D (optional) ----------
function webglAvailable() {
  if (reviewState === 'no-webgl') return false;
  try { const c = document.createElement('canvas'); return !!(window.WebGL2RenderingContext && c.getContext('webgl2')); } catch { return false; }
}
function overlay(html) { const o = document.createElement('div'); o.className = 'overlay'; o.innerHTML = html; $('#viewer').append(o); return o; }

async function enter3D() {
  if (!webglAvailable()) {
    setMode('plan');
    overlay(`<p class="tag">3D UNAVAILABLE ON THIS DEVICE</p><h2>Showing the floor plan instead</h2><p class="small muted">This browser cannot draw the 3D model. Every resource, status and booking action is available from the plan and the list.</p><button class="btn" id="ok-plan">Continue with the plan</button>`).querySelector('#ok-plan').onclick = e => e.target.closest('.overlay').remove();
    return;
  }
  if (three) { setMode('3d'); three.attach(); return; }
  setMode('3d');
  const v = $('#viewer'); v.innerHTML = '';
  const ask = overlay(`<p class="tag">OPTIONAL 3D MODEL</p><h2>Load the interactive model?</h2><p class="small muted">About ${(R.modelBytes / 1048576 || 2.5).toFixed(1)} MB. The plan already holds everything needed to find and book a resource.</p><div class="seg"><button class="btn primary" id="load">Load 3D model</button><button class="btn" id="cancel">Stay on plan</button></div>`);
  ask.querySelector('#cancel').onclick = () => { setMode('plan'); renderPlan(); };
  ask.querySelector('#load').onclick = async () => {
    ask.innerHTML = '<p class="tag">LOADING</p><p role="status">Loading the model… the plan remains one click away.</p>';
    try {
      if (reviewState === 'model-fail') throw new Error('Simulated load failure');
      const mod = await import('./model.js');
      three = await mod.create($('#viewer'), GLB_URL, R, { onPick: id => byId[id] && select(id), reduceMotion });
      ask.remove(); three.attach(); three.setHalos($('#halos').checked); renderViews();
      if (selected) three.highlight(selected);
    } catch (err) {
      three = null; setMode('plan'); renderPlan();
      overlay(`<p class="tag">MODEL COULD NOT LOAD</p><h2>You are on the floor plan</h2><p class="small muted">${err.message}. Nothing you selected was lost.</p><button class="btn" id="ok2">Continue with the plan</button>`).querySelector('#ok2').onclick = e => e.target.closest('.overlay').remove();
    }
  };
}
function renderViews() {
  const w = $('#views'); w.hidden = mode !== '3d' || !three; w.innerHTML = '';
  for (const [k, v] of Object.entries(R.views)) { const b = document.createElement('button'); b.className = 'btn'; b.textContent = v.label; b.onclick = () => three.goTo(k); w.append(b); }
  const reset = document.createElement('button'); reset.className = 'btn'; reset.textContent = 'Reset view'; reset.onclick = () => three.goTo('overview'); w.append(reset);
}
function setMode(m) {
  mode = m; $('#mode-plan').setAttribute('aria-pressed', m === 'plan'); $('#mode-3d').setAttribute('aria-pressed', m === '3d');
  if (m === 'plan' && three) three.detach();
  renderViews(); if (selected) renderDetail();
}
$('#halos').onchange = e => { if (three) three.setHalos(e.target.checked); };
$('#mode-plan').onclick = () => { setMode('plan'); renderPlan(); };
$('#mode-3d').onclick = () => enter3D();
$('#state').onchange = e => { reviewState = e.target.value; renderFresh(); renderDetail(); if (reviewState === 'no-webgl' || reviewState === 'model-fail') { if (three) { three.dispose(); three = null; } setMode('plan'); renderPlan(); } };

renderFresh(); renderChips(); renderList(); renderPlan(); renderDetail();
const deep = new URLSearchParams(location.search).get('id'); if (deep && byId[deep]) select(deep);

// Only accept the same-origin parent projection. Private records never enter this frame.
const escapeProjection = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'parallax-react-map') return;
  const incoming = event.data.resources;
  if (!incoming || typeof incoming !== 'object' || typeof event.data.time !== 'string') return;
  for (const r of R.resources) {
    const o = incoming[r.id];
    if (!o || typeof o.availability !== 'string' || typeof o.occupancy !== 'string') continue;
    r.availability = escapeProjection(o.availability); r.occupancy = escapeProjection(o.occupancy);
    delete r.note;
    if (o.availability.startsWith('Restricted')) r.note = 'Being checked. Staff notes are excluded from this projection.';
    if (o.availability.startsWith('Location unknown')) r.note = 'Location unknown; the model shows its home position only.';
  }
  projectionTime = event.data.time;
  $('.lm-foot').textContent = 'React example availability and occupancy. Model positions show home geometry, not tracked movement. No live observations.';
  renderFresh(); renderList($('#q').value); renderDetail();
  // Recreate status shapes and accessible names from the same received projection.
  // Restore a focused plan resource without moving focus from any other control.
  if (mode === 'plan') {
    const focusedResource = document.activeElement?.closest('.plan-res')?.dataset.id;
    renderPlan();
    if (focusedResource) [...svg.querySelectorAll('.plan-res')].find(node => node.dataset.id === focusedResource)?.focus();
  } else highlightPlan(false);
  if(three) three.highlight(selected);
});
parent.postMessage({type:'parallax-map-ready'},location.origin);
document.addEventListener('click', event => { if(event.target?.id === 'open-react-asset' && selected) parent.postMessage({type:'parallax-map-open',asset:selected},location.origin); });

addEventListener('pagehide', () => three?.dispose(), {once:true});
