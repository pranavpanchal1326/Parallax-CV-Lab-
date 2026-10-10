// PARALLAX P9-B demonstrator: views over the shared state in store.js. Hash routes; native controls only.
// P9-B changes presentation and navigation only; every rule still lives in store.js.
import * as S from './store.js';

const [fx, geo] = await Promise.all([fetch('fixtures.json').then(r => r.json()), fetch('../spatial/lab_geometry.json').then(r => r.json()).catch(() => null)]);
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const id = v => `<span class="id">${esc(v)}</span>`;

// ---------- state ----------
let state = load();
let flash = null;            // { kind, html } shown once at the top of the next render
let seen = state.log.length; // log entries already shown, so new ones can be marked
const demo = { failSave: false, dropAck: false };
function load() {
  try { const raw = JSON.parse(localStorage.getItem(S.STORAGE_KEY)); if (raw && raw.revision === fx.revision) return raw; } catch { }
  return S.createState(fx);
}
function save() {
  try {
    localStorage.setItem(S.STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem('parallax-proto-labmap', JSON.stringify({ saved: Date.now(), resources: S.labMapOverrides(state, fx) }));
  } catch { }
}
const say = (kind, html) => { flash = { kind, html }; };

// ---------- icons (line, 24 px grid, inherit colour) ----------
const ICON = {
  camera: '<path d="M3 8h4l1.5-2h7L17 8h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
  light: '<path d="M5 4h14v9H5zM12 13v7M8 20h8"/>',
  tripod: '<path d="M9 4h6M12 4v8M12 12l-6 8M12 12l6 8M12 12v8"/>',
  target: '<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>',
  desk: '<path d="M4 5h16v10H4zM9 19h6M12 15v4"/>',
  area: '<path d="M4 4h16v16H4z" stroke-dasharray="3 2.5"/>',
  wave: '<path d="M2 12c2-7 4-7 6 0s4 7 6 0 4-7 6 0"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cross: '<path d="M6 6l12 12M18 6L6 18"/>',
  lock: '<path d="M7 11V8a5 5 0 0110 0v3M5 11h14v9H5z"/>',
  alert: '<path d="M12 4l9 16H3zM12 10v4M12 17v.5"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 00-5.2 5.2L4 17l3 3 5.3-5.3a4 4 0 005.2-5.2l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
  display: '<path d="M3 5h18v12H3zM8 21h8"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5"/>',
  next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  note: '<path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-6-5.5-6-10a6 6 0 0112 0c0 4.500-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  flask: '<path d="M9 3h6M10 3v6L5 19h14L14 9V3"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  cube: '<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9zM12 12l8-4.500M12 12v9M12 12L4 7.500"/>'
};
const icon = (n, cls = '') => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const itemIcon = i => /^CV-/.test(i) ? 'desk' : i === 'C1' ? 'area' : i === 'C1-CAM' ? 'camera' : /^(LGT|C1-L)/.test(i) ? 'light' : i === 'TRP-04' ? 'tripod' : i === 'CAL-01' ? 'target' : 'wave';
const logIcon = l => /Reserved/.test(l.action) ? 'clock' : /Checked in|Started/.test(l.action) ? 'pin' : /evidence/.test(l.action) ? 'camera' : /Report|stopped|acknowledged/.test(l.action) ? 'alert' : /Restricted|restriction/.test(l.action) ? 'lock' : /repair|Classified|Verif|Located/i.test(l.action) ? 'wrench' : /Submitted/.test(l.action) ? 'send' : /notebook/.test(l.action) ? 'note' : 'box';

// ---------- shared pieces ----------
const STAGES = [['prepare', 'Prepare', 'flask'], ['reserve', 'Reserve', 'clock'], ['arrive', 'Arrive', 'pin'], ['bench', 'Bench', 'camera'], ['notebook', 'Notebook', 'note'], ['submit', 'Submit', 'send'], ['return', 'Return', 'box']];
function stageInfo(exp) {
  const ses = state.sessions[exp], b = S.myBooking(state, exp);
  const open = { prepare: true, reserve: true, arrive: !!b, bench: ses.checkedIn, notebook: ses.started, submit: ses.started, return: ses.checkedIn };
  const complete = { prepare: state.prepared[exp].every(Boolean), reserve: !!b, arrive: ses.started, bench: fx.experiments[exp].evidence.every(e => ses.captures.some(c => c.id === e.id)), notebook: !!ses.noteSaved && ses.noteSaved === ses.note, submit: !!ses.receipt, return: ses.closed };
  return { open, complete };
}
const doneCount = exp => Object.values(stageInfo(exp).complete).filter(Boolean).length;
function stages(exp, current) {
  const { open, complete } = stageInfo(exp);
  return `<nav class="stepper" aria-label="Steps for ${exp}"><ol>${STAGES.map(([k, label, ic], n) => {
    const s = k === current ? 'now' : complete[k] ? 'done' : open[k] ? 'open' : 'locked', prev = n && complete[STAGES[n - 1][0]] ? ' data-prev="done"' : '';
    const mk = `<span class="mk">${icon(s === 'done' ? 'check' : s === 'locked' ? 'lock' : k === 'bench' && exp === 'E01' ? 'wave' : ic)}${s === 'now' && complete[k] ? `<span class="tick">${icon('check')}</span>` : ''}</span><span class="lb">${label}</span><span class="vh">${complete[k] ? ' (done)' : open[k] ? '' : ' (not available yet)'}</span>`;
    return `<li data-s="${s}"${prev}>${open[k] ? `<a href="#/${exp}/${k}"${k === current ? ' aria-current="step"' : ''}>${mk}</a>` : `<span class="off" aria-disabled="true">${mk}</span>`}</li>`;
  }).join('')}</ol></nav>`;
}
const head = (exp, n) => `<p class="ed-kicker">${exp} · ${esc(fx.experiments[exp].strand)} · Step ${n} of 7</p>`;
const availTag = r => { const a = S.availability(state, r); return `<span class="tag ${a.state === 'bookable' ? 'ok' : a.state === 'restricted' ? 'bad' : 'warn'}">${esc(a.label)}</span>`; };
const occTag = r => { const o = S.occupancy(state, fx, r); return `<span class="tag ${o.state === 'in-use' ? 'info' : 'plain'}">${esc(o.label)}</span>`; };
const itemName = i => i.name || fx.resources.find(r => r.id === i.id)?.name || i.id;
const itemState = i => { const m = (i.members || [i.id]).map(x => S.availability(state, x).state); return m.includes('restricted') ? 'restricted' : m.includes('unknown') ? 'unknown' : 'bookable'; };

// Kit as cards. mode: 'view' shows the whole manifest with availability; 'kit' and 'ret' count the portable items.
function kitCards(exp, mode = 'view') {
  const e = fx.experiments[exp], k = fx.kits[e.kit], ses = state.sessions[exp];
  if (mode === 'view') return `<ul class="kit" aria-label="Manifest ${esc(e.kit)}">${[...k.fixed, ...k.portable].map(i => { const a = itemState(i);
    return `<li data-a="${a}">${icon(itemIcon(i.id), 'lg')}<span class="q">×${i.qty}</span><b>${id(i.id)}</b><span class="nm">${esc(itemName(i))}</span>${a === 'bookable' ? '<span class="vh">Bookable</span>' : `<span class="tag ${a === 'restricted' ? 'bad' : 'warn'}">${a === 'restricted' ? 'Restricted' : 'Not located'}</span>`}</li>`; }).join('')}</ul>`;
  const field = mode === 'kit' ? 'kit' : 'returned', pre = mode === 'kit' ? 'kit' : 'ret';
  return `<ul class="kit">${k.portable.map(i => { const have = ses[field][i.id] ?? 0;
    return `<li data-ok="${have >= i.qty ? 1 : 0}">${icon(itemIcon(i.id), 'lg')}<label for="${pre}-${i.id}"><b>${id(i.id)}</b><br><span class="nm">${esc(itemName(i))}</span></label><span class="cnt"><input type="number" id="${pre}-${i.id}" min="0" max="${i.qty}" value="${have}" data-act="${pre}" data-exp="${exp}" data-item="${i.id}"${mode === 'kit' && ses.started ? ' disabled' : ''}> of ${i.qty}</span></li>`; }).join('')}</ul>`;
}
const kitMini = kitId => { const k = fx.kits[kitId]; return `<ul class="kit mini" aria-label="${esc(kitId)}">${[...k.fixed, ...k.portable].map(i => `<li>${icon(itemIcon(i.id))}<span class="id">${esc(i.id)}</span></li>`).join('')}</ul>`; };

// Floor plan drawn from spatial/lab_geometry.json. Status is shape and colour; the list view carries the same facts as text.
function plan(hi = []) {
  if (!geo) return '';
  const known = Object.fromEntries(fx.resources.map(r => [r.id, r])), c = { bookable: 0, restricted: 0, unknown: 0, use: 0 };
  for (const r of fx.resources) { const a = S.availability(state, r.id).state; c[a]++; if (S.occupancy(state, fx, r.id).state === 'in-use') c.use++; }
  const zones = geo.zones.map(z => { const low = z.id === 'CMP' || z.id === 'STO';
    return `<rect class="pz${hi.includes(z.id) ? ' hi' : ''}" data-z="${z.id}" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.d}"/><text class="pzl" data-z="${z.id}" x="${z.x + (z.id === 'CMP' ? .85 : .1)}" y="${z.y + (low ? z.d - .14 : .3)}">${z.id}</text>`; }).join('');
  const mark = (rid, cx, cy) => { const a = S.availability(state, rid).state, u = S.occupancy(state, fx, rid).state === 'in-use';
    return a === 'restricted' ? `<path class="m-bad" d="M${cx} ${cy - .17}l.18 .3h-.36z"/>` : a === 'unknown' ? `<circle class="m-warn" cx="${cx}" cy="${cy}" r=".11"/>` : u ? `<rect class="m-use" x="${cx - .12}" y="${cy - .12}" width=".24" height=".24"/>` : `<circle class="m-ok" cx="${cx}" cy="${cy}" r=".1"/>`; };
  const furn = geo.furniture.map(f => { const r = known[f.id], dark = f.type === 'partition' || f.type === 'backdrop';
    if (!r) return `<rect class="pf ${dark ? 'dark' : 'mute'}" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.d}"/>`;
    const wide = f.w >= 1.2, cx = wide ? f.x + f.w - .26 : f.x + f.w / 2, cy = f.y + f.d / 2;
    return `<g class="${hi.includes(f.id) ? 'hi' : ''}"><title>${f.id}: ${S.availability(state, f.id).label}, ${S.occupancy(state, fx, f.id).label}</title><rect class="pf" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.d}"/>${wide ? `<text class="pl" x="${f.x + .1}" y="${cy + .07}">${f.id}</text>` : ''}${mark(f.id, cx, cy)}</g>`; }).join('');
  const doors = geo.openings.filter(o => o.type === 'door').map(o => `<line class="door" x1="${o.wall === 'W' ? 0 : 10}" x2="${o.wall === 'W' ? 0 : 10}" y1="${o.from}" y2="${o.to}"/>`).join('');
  return `<svg class="plan" viewBox="-.2 -.2 10.4 7.4" role="img" aria-label="Floor plan of the lab. ${c.bookable} items bookable, ${c.restricted} restricted, ${c.unknown} not located, ${c.use} in use. The equipment list gives the same facts as text.">${zones}${furn}<rect class="wall" x="0" y="0" width="10" height="7"/>${doors}</svg>
   <ul class="legend"><li><span class="gl ok"></span>Bookable</li><li><span class="gl use"></span>In use</li><li><span class="gl bad"></span>Restricted</li><li><span class="gl warn"></span>Not located</li></ul>`;
}
function counts() { const c = { bookable: 0, restricted: 0, unknown: 0, use: 0 }; for (const r of fx.resources) { c[S.availability(state, r.id).state]++; if (S.occupancy(state, fx, r.id).state === 'in-use') c.use++; } return c; }

function reportForm(asset, back) {
  const open = state.issues.find(i => i.asset === asset && i.status !== 'Closed');
  if (open) return `<div class="msg"><p><strong>${id(open.id)} is open for ${id(asset)}</strong> · ${esc(open.status)}. No need to send it again.</p></div>`;
  return `<form data-form="report" data-back="${esc(back)}" novalidate>
   <div class="field"><label for="rep-asset">Item</label><select id="rep-asset" name="asset">${fx.resources.map(r => `<option value="${r.id}"${r.id === asset ? ' selected' : ''}>${r.id} · ${esc(r.name)}</option>`).join('')}</select></div>
   <div class="field"><label for="rep-sym">What you saw</label><select id="rep-sym" name="symptom">${fx.fault.symptoms.map(x => `<option>${esc(x)}</option>`).join('')}</select></div>
   <div class="field"><label for="rep-detail">Detail <span class="hint">(optional)</span></label><textarea id="rep-detail" name="detail" rows="2" style="min-height:72px"></textarea></div>
   <div class="acts"><button class="pbtn primary" type="submit">${icon('send')}Send report</button></div></form>`;
}

// ---------- illustrations ----------
function scene(side, bare = false) {
  const sh = side ? '<path d="M118 142 L196 142 L172 128 L118 128Z" fill="#05070A"/><path d="M190 142 L276 142 L250 130 L190 130Z" fill="#05070A"/><path d="M262 142 L318 142 L300 134 L262 134Z" fill="#05070A"/>' : '<ellipse cx="88" cy="143" rx="34" ry="4" fill="#05070A"/><ellipse cx="168" cy="143" rx="24" ry="4" fill="#05070A"/><ellipse cx="244" cy="143" rx="22" ry="4" fill="#05070A"/>';
  const f = side ? ['#9BA4B4', '#4A5261', '#7B8494', '#3D4553', '#565E6C'] : ['#C9D0DC', '#B4BCCB', '#C2C9D6', '#AEB6C4', '#B9C1CE'];
  return `<svg viewBox="0 0 320 180" ${bare ? 'aria-hidden="true"' : `role="img" aria-label="${side ? 'Illustration, side light: long shadows fall to the right and object 03 sits partly in the shadow of the cylinder.' : 'Illustration, frontal light: three objects evenly lit with short shadows.'}"`}>
   <rect width="320" height="180" fill="#151922"/><rect y="142" width="320" height="38" fill="#202936"/>${sh}
   <rect x="58" y="92" width="52" height="50" fill="${f[0]}"/><rect x="110" y="92" width="10" height="50" fill="${f[1]}"/>
   <rect x="148" y="78" width="40" height="64" fill="${f[2]}"/><rect x="${side ? 174 : 188}" y="78" width="${side ? 14 : 0}" height="64" fill="${f[3]}"/><ellipse cx="168" cy="78" rx="20" ry="6" fill="${side ? '#B4BCCB' : '#DDE2EB'}"/>
   <path d="M224 142 L244 100 L264 142Z" fill="${f[4]}"/>
   <g fill="none" stroke="#6EE7C5" stroke-width="1.2" stroke-dasharray="4 3"><rect x="54" y="88" width="70" height="58"/><rect x="144" y="68" width="48" height="78"/><rect x="220" y="96" width="48" height="50"/></g>
   ${bare ? '' : `<g font-family="JetBrains Mono, monospace" font-size="8" fill="#6EE7C5"><text x="54" y="84">01 BOX</text><text x="144" y="64">02 CYLINDER</text><text x="220" y="92">03 EXPECTED OBJECT</text></g>
   <text x="8" y="14" font-family="JetBrains Mono, monospace" font-size="8" fill="#BDC7D9">${side ? 'ILL-L2-v1 · SIDE LIGHT' : 'ILL-L1-v1 · FRONTAL LIGHT'} · ILLUSTRATION</text>`}</svg>`;
}
const F = fx.experiments.E01.source.frequencyHz;
const samples = rate => Array.from({ length: Math.floor(rate) + 1 }, (_, i) => ({ t: i / rate, v: Math.sin(2 * Math.PI * F * i / rate) }));
const aliasHz = rate => F - Math.round(F / rate) * rate;
function plot(rate) {
  const W = 520, H = 230, L = 46, R = 12, T = 14, B = 40, x = t => L + t * (W - L - R), y = v => T + (1 - v) / 2 * (H - T - B);
  const curve = f => Array.from({ length: 201 }, (_, i) => { const t = i / 200; return `${i ? 'L' : 'M'}${x(t).toFixed(1)} ${y(Math.sin(2 * Math.PI * f * t)).toFixed(1)}`; }).join('');
  const fa = aliasHz(rate), pts = samples(rate);
  const alias = Math.abs(fa) !== F ? `<path d="${curve(fa)}" fill="none" stroke="#F2C14E" stroke-width="1.6" stroke-dasharray="6 4"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Plot, ${rate} hertz sampling of the 2 hertz reference over 0 to 1 second. ${pts.length} samples. ${alias ? `The samples also fit a ${Math.abs(fa)} hertz curve, drawn dashed.` : 'The samples follow the reference closely.'}">
   <g stroke="#3A4250" stroke-width="1">${[-1, -.5, 0, .5, 1].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>`).join('')}${[0, .25, .5, .75, 1].map(t => `<line y1="${T}" y2="${H - B}" x1="${x(t)}" x2="${x(t)}"/>`).join('')}</g>
   <g font-family="JetBrains Mono, monospace" font-size="10" fill="#BDC7D9">${[-1, 0, 1].map(v => `<text x="${L - 8}" y="${y(v) + 3}" text-anchor="end">${v > 0 ? '+' : ''}${v}</text>`).join('')}${[0, .25, .5, .75, 1].map(t => `<text x="${x(t)}" y="${H - B + 14}" text-anchor="middle">${t}</text>`).join('')}
    <text x="${(L + W - R) / 2}" y="${H - 6}" text-anchor="middle">time, s</text><text x="12" y="${(T + H - B) / 2}" text-anchor="middle" transform="rotate(-90 12 ${(T + H - B) / 2})">voltage, V</text></g>
   <path d="${curve(F)}" fill="none" stroke="#8D98AB" stroke-width="1.4"/>${alias}
   <g fill="#6EE7C5" stroke="#151922" stroke-width="1">${pts.map(p => `<rect x="${(x(p.t) - 3.5).toFixed(1)}" y="${(y(p.v) - 3.5).toFixed(1)}" width="7" height="7"/>`).join('')}</g></svg>
   <p class="cap">Grey: reference. Squares: ${pts.length} samples.${alias ? ` Gold dashes: a ${Math.abs(fa)} Hz curve through the same samples.` : ''}</p>
   <details><summary>Sample values</summary><table><thead><tr><th scope="col">t, s</th><th scope="col">V</th></tr></thead><tbody>${pts.map(p => `<tr><td>${p.t.toFixed(3)}</td><td>${(Math.abs(p.v) < 5e-4 ? 0 : p.v).toFixed(3)}</td></tr>`).join('')}</tbody></table></details>`;
}
// small decorative version of a plot for cards and thumbnails
function miniPlot(rate) {
  const x = t => 16 + t * 288, y = v => 90 - v * 62, curve = f => Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${x(i / 120).toFixed(1)} ${y(Math.sin(2 * Math.PI * f * i / 120)).toFixed(1)}`).join(''), fa = aliasHz(rate);
  return `<svg viewBox="0 0 320 180" aria-hidden="true"><rect width="320" height="180" fill="#151922"/><line x1="16" x2="304" y1="90" y2="90" stroke="#3A4250"/><path d="${curve(F)}" fill="none" stroke="#8D98AB" stroke-width="1.6"/>${Math.abs(fa) !== F ? `<path d="${curve(fa)}" fill="none" stroke="#F2C14E" stroke-width="2" stroke-dasharray="7 5"/>` : ''}<g fill="#6EE7C5">${samples(rate).map(p => `<rect x="${(x(p.t) - 4).toFixed(1)}" y="${(y(p.v) - 4).toFixed(1)}" width="8" height="8"/>`).join('')}</g></svg>`;
}
const evThumb = (exp, ev) => exp === 'E06' ? scene(ev.id === 'ILL-L2-v1', true) : miniPlot(ev.rateHz);
function thumbs(exp) {
  const e = fx.experiments[exp], ses = state.sessions[exp];
  return `<ul class="thumbs">${e.evidence.map(ev => { const c = ses.captures.find(x => x.id === ev.id);
    return `<li>${c ? `<div class="th">${evThumb(exp, ev)}</div>` : `<div class="none">Not recorded</div>`}<div class="meta"><b>${esc(ev.id)}</b> · ${esc(ev.label)}${c ? `<br>${esc(c.source)} · ${esc(c.time)}` : ''}</div></li>`; }).join('')}</ul>`;
}

// ---------- views ----------
const views = {
  home() {
    const notices = S.publicNotices(state, fx), c = counts();
    const next = (b, ses) => !b ? ['prepare', 'Start'] : ses.closed ? ['return', 'Closed'] : ses.receipt ? ['return', 'Return the kit'] : ses.started ? ['bench', 'Continue'] : ['arrive', 'Check in'];
    return { title: 'Today', html: `<p class="ed-kicker">Student · ${esc(fx.clock.today)}</p><h1 tabindex="-1">Today in <em>the lab.</em></h1>
     ${notices.length ? `<div class="msg warn"><p>${notices.map(n => `<strong>${id(n.asset)}</strong> ${esc(n.text)}`).join(' ')}</p></div>` : ''}
     <div class="cards">${Object.keys(fx.experiments).map(exp => { const e = fx.experiments[exp], b = S.myBooking(state, exp), ses = state.sessions[exp], [k, label] = next(b, ses), hit = b && S.bookingImpact(state, b), n = doneCount(exp);
       return `<article class="xcard"><div class="thumb">${exp === 'E06' ? scene(true, true) : miniPlot(3)}</div><div class="body"><span class="k">${exp} · ${esc(e.strand)} · ${esc(e.duration)}</span><h2>${esc(e.title)}</h2>
        <div class="meter" role="img" aria-label="${n} of 7 steps done">${STAGES.map((_, i) => `<i${i < n ? ' class="on"' : ''}></i>`).join('')}</div>
        <div class="row">${b ? `${id(b.id)}<span>${esc(b.slot)}</span>${hit.affected ? `<span class="tag bad">Affected · ${esc(hit.by.join(', '))}</span>` : `<span class="tag ${b.status === 'Closed' ? 'plain' : 'ok'}">${esc(b.status)}</span>`}` : `<span>${n} of 7 steps</span>`}</div>
        <div><a class="pbtn${ses.closed ? '' : ' primary'}" href="#/${exp}/${k}">${esc(label)}<span class="vh">: ${exp}</span>${icon('next')}</a></div></div></article>`; }).join('')}</div>
     <section class="split" aria-labelledby="h-av"><div><h2 class="cap2" id="h-av">The lab right now</h2>${plan()}</div>
      <div><ul class="figs"><li><b>${c.bookable}</b><span><i class="gl ok"></i>bookable</span></li><li><b>${c.use}</b><span><i class="gl use"></i>in use</span></li><li><b>${c.restricted}</b><span><i class="gl bad"></i>restricted</span></li><li><b>${c.unknown}</b><span><i class="gl warn"></i>not located</span></li></ul>
       <ul class="links"><li><a href="../design/phase-08/lab-map.html">${icon('map')}Lab Map</a></li><li><a href="#/report">${icon('alert')}Report a problem</a></li><li><a href="../design/phase-08/scene-studio.html">${icon('cube')}Scene Studio</a></li></ul></div></section>
     <details class="more"><summary>${icon('list')}Equipment list</summary>
      <div class="scroll" tabindex="0" role="group" aria-label="Equipment list, scrolls sideways"><table class="led"><thead><tr><th scope="col">ID</th><th scope="col">Item</th><th scope="col">Zone</th><th scope="col">Availability</th><th scope="col">Occupancy</th></tr></thead><tbody>
      ${fx.resources.map(r => `<tr><th scope="row">${id(r.id)}</th><td>${esc(r.name)}</td><td>${esc(r.zone)}</td><td>${availTag(r.id)}</td><td>${occTag(r.id)}</td></tr>`).join('')}</tbody></table></div></details>` };
  },

  prepare(exp) {
    const e = fx.experiments[exp];
    return { title: `Prepare ${exp}`, html: `${head(exp, 1)}<h1 tabindex="-1">${esc(e.title)}</h1>${stages(exp, 'prepare')}
     <p class="pull">${esc(e.question)}</p>
     <div class="split"><section aria-labelledby="h-kit"><h2 class="cap2" id="h-kit">Your kit · ${esc(e.kit)}</h2>${kitCards(exp)}
       ${e.source ? `<p class="small" style="margin-top:12px">Input ${id(e.source.id)} · ${esc(e.source.formula)} · generated</p>` : ''}</section>
      <section aria-labelledby="h-chk"><h2 class="cap2" id="h-chk">Confirm before reserving</h2>
       <fieldset><legend class="vh">Preparation checklist for ${exp}</legend>
       ${e.prepare.map((t, i) => `<label class="check"><input type="checkbox" id="prep-${i}" data-act="prep" data-exp="${exp}" data-i="${i}"${state.prepared[exp][i] ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</fieldset></section></div>` };
  },

  reserve(exp) {
    const e = fx.experiments[exp], b = S.myBooking(state, exp), kit = S.kitStatus(state, fx, e.kit), other = exp === 'E06' ? 'E01' : 'E06';
    return { title: `Reserve ${exp}`, html: `${head(exp, 2)}<h1 tabindex="-1">Reserve the <em>whole</em> kit.</h1>${stages(exp, 'reserve')}
     ${b ? `<div class="ticket" style="max-width:640px"><p class="ed-kicker" style="margin:0">Booking confirmed</p><p class="big">${esc(b.id)}</p><p class="when"><span>${esc(b.day)}</span><span>${esc(b.slot)}</span><span>${id(e.station)}</span></p>${kitMini(e.kit)}</div>`
      : `${kit.ok ? '' : `<div class="msg bad"><p><strong>${id(e.kit)} cannot be reserved.</strong> ${kit.blockers.map(x => `${id(x)}: ${esc(S.availability(state, x).label.toLowerCase())}`).join('; ')}.${S.kitStatus(state, fx, fx.experiments[other].kit).ok ? ` <a class="ed-link" href="#/${other}/prepare">${other} is still available</a>.` : ''}</p></div>`}
      <div class="split"><section aria-labelledby="h-slots"><h2 class="cap2" id="h-slots">${esc(fx.clock.today)} · pick a time</h2><ul class="slots">
      ${fx.slots.map(slot => { const st = S.slotStatus(state, fx, exp, slot); return `<li class="slot" data-s="${st.state}"><b>${slot}</b><span class="tag ${st.state === 'free' ? 'ok' : st.state === 'taken' ? 'warn' : 'bad'}">${st.state === 'free' ? 'Free' : st.state === 'taken' ? 'Taken' : 'Kit unavailable'}</span>${st.state === 'free' ? '' : `<span class="small">${esc(st.reason)}</span>`}
        <button class="pbtn${st.state === 'free' ? ' primary' : ''}" type="button" data-act="reserve" data-exp="${exp}" data-slot="${slot}" id="slot-${slot.replace(':', '')}">Reserve<span class="vh"> ${slot} for ${exp}</span></button></li>`; }).join('')}</ul></section>
       <section aria-labelledby="h-holds"><h2 class="cap2" id="h-holds">One booking holds all of this</h2>${kitCards(exp)}</section></div>`}` };
  },

  arrive(exp) {
    const e = fx.experiments[exp], b = S.myBooking(state, exp), ses = state.sessions[exp], kit = fx.kits[e.kit], hit = S.bookingImpact(state, b);
    return { title: `Arrive ${exp}`, html: `${head(exp, 3)}<h1 tabindex="-1">Check in at <em>${esc(e.station)}.</em></h1>${stages(exp, 'arrive')}
     ${hit.affected && !ses.started ? `<div class="msg bad"><p><strong>${id(b.id)} is affected.</strong> ${hit.by.map(id).join(', ')} is unavailable, so the session cannot start yet.</p></div>` : ''}
     <div class="split even"><section class="panel" aria-labelledby="h-st"><h2 id="h-st"><span class="num">1</span>Station</h2>
      ${plan([e.station, ...kit.fixed.map(i => i.id)])}
      ${ses.checkedIn ? `<p style="margin:16px 0 0"><span class="tag ok">Checked in · ${esc(ses.station)}</span></p>`
       : `<form data-form="checkin" data-exp="${exp}" novalidate style="margin-top:16px"><div class="field"><label for="station">Type the ID on the desk label</label><input class="big" type="text" id="station" name="station" placeholder="${esc(e.station)}" autocomplete="off" autocapitalize="characters" aria-describedby="station-e"><span id="station-e"></span></div><div class="acts"><button class="pbtn primary" type="submit">${icon('pin')}Check in</button></div></form>`}</section>
     <section class="panel" aria-labelledby="h-vk"><h2 id="h-vk"><span class="num">2</span>Kit</h2>
     ${kit.portable.length ? `${kitCards(exp, 'kit')}${ses.started ? '' : `<div class="acts"><button class="pbtn" type="button" data-act="kit-all" data-exp="${exp}" id="kit-all">${icon('check')}All here</button></div>`}`
      : `${kitMini(e.kit)}<p class="small" style="margin-top:12px">Nothing portable to count. Both items are fixed.</p>`}
     <div class="acts" style="margin-top:22px;padding-top:18px;border-top:1px solid var(--ed-rule)">${ses.started ? `<span class="tag ok">Session started</span>` : `<button class="pbtn primary" type="button" data-act="start" data-exp="${exp}" id="start">Start session${icon('next')}</button>`}</div></section></div>` };
  },

  bench(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], has = x => ses.captures.find(c => c.id === x), all = e.evidence.every(x => has(x.id));
    const camIssue = state.issues.find(i => i.asset === 'C1-CAM' && i.status !== 'Closed'), camRestricted = !!state.resources['C1-CAM'].restriction;
    let body;
    if (exp === 'E06') {
      const down = ses.interrupted || camRestricted;
      body = `${down ? `<div class="msg bad"><p><strong>${camRestricted ? `C1-CAM is restricted · ${esc(state.resources['C1-CAM'].restriction)}.` : 'The camera feed has stopped.'}</strong> ${ses.captures.length ? `Saved evidence is safe: ${ses.captures.map(c => id(c.id)).join(', ')}.` : 'Nothing was lost.'}${camIssue ? ` ${id(camIssue.id)} is with the technician.` : ''}</p></div>
        ${camIssue ? '' : `<section class="panel" aria-labelledby="h-rep" style="margin-bottom:22px;max-width:640px"><h2 id="h-rep">Report it</h2>${reportForm('C1-CAM', `#/${exp}/bench`)}</section>`}` : ''}
       <figure class="plate"><div class="pair">${e.evidence.map((ev, n) => `<div>${scene(n === 1)}<div class="acts">${has(ev.id) ? `<span class="tag ok">Recorded ${esc(has(ev.id).time)}</span>` : down ? (camIssue ? `<button class="pbtn" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" data-prepared="1" id="cap-${ev.id}">Use prepared ${esc(ev.label.toLowerCase())}</button>` : `<button class="pbtn" type="button" disabled aria-describedby="why-${n}">Record ${esc(ev.label.toLowerCase())}</button><span class="cap" id="why-${n}" style="margin:0">Camera unavailable</span>`) : `<button class="pbtn primary" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" id="cap-${ev.id}">${icon('camera')}Record ${esc(ev.label.toLowerCase())}</button>`}</div></div>`).join('')}</div>
        <ul class="chips" aria-label="Settings kept with each record"><li><span>Exposure</span>${esc(e.settings.exposure)}</li><li><span>Gain</span>${esc(e.settings.gain)}</li><li><span>Light</span>${esc(e.settings.lightIntensity)}</li></ul>
        <figcaption>Illustration, not a camera capture. Dashed outlines are annotations; no confidence or accuracy is shown.</figcaption></figure>
       ${ses.started && !down && !all ? `<div class="demo"><p class="k">Demo control</p><button class="pbtn quiet" type="button" data-act="interrupt" id="interrupt">${icon('alert')}Stop the camera feed</button><span class="small">Plays the device-failure path. No camera is connected.</span></div>` : ''}`;
    } else {
      body = `<div class="plate"><div class="pair">${e.evidence.map(ev => `<div><h2>${esc(ev.label)} · ${id(ev.id)}</h2>${has(ev.id) ? plot(ev.rateHz) : `<div style="aspect-ratio:52/23;display:grid;place-items:center;border:1px dashed var(--ed-plate-rule)"><button class="pbtn primary" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" id="cap-${ev.id}">${icon('wave')}Run at ${ev.rateHz} Hz</button></div>`}</div>`).join('')}</div>
       <ul class="chips" aria-label="Signal settings"><li><span>Reference</span>${esc(e.source.formula)}</li><li><span>Window</span>0–1 s</li><li><span>Range</span>±1 V</li></ul>
       <p class="cap">Computed in this browser from a generated reference, not acquired from a device.</p></div>`;
    }
    return { title: `Bench ${exp}`, html: `${head(exp, 4)}<h1 tabindex="-1">${exp === 'E06' ? 'Same scene, <em>two</em> lights.' : 'Same signal, <em>two</em> rates.'}</h1>${stages(exp, 'bench')}${body}` };
  },

  notebook(exp) {
    const ses = state.sessions[exp], dirty = ses.note !== (ses.noteSaved ?? ''), locked = !!ses.receipt;
    return { title: `Notebook ${exp}`, html: `${head(exp, 5)}<h1 tabindex="-1">What can you <em>claim?</em></h1>${stages(exp, 'notebook')}
     <div class="split even"><section aria-labelledby="h-ev"><h2 class="cap2" id="h-ev">Evidence</h2>${thumbs(exp)}</section>
     <section aria-labelledby="h-claim"><h2 class="cap2" id="h-claim">Claim</h2>
      <form data-form="note" data-exp="${exp}" novalidate><div class="field" style="max-width:none"><label for="note">What changed between the two, and what can this evidence not show?</label>
       <textarea id="note" name="note" rows="6" aria-describedby="note-h"${locked ? ' readonly' : ''}>${esc(ses.note)}</textarea>
       <span class="hint" id="note-h">${locked ? 'Frozen: this revision was submitted.' : dirty && ses.noteSaved ? 'Unsaved changes.' : ses.noteSaved ? 'Saved.' : 'Not saved yet. 40 characters or more.'}</span></div>
       ${locked ? '' : `<div class="acts"><button class="pbtn primary" type="submit">${icon('check')}Save</button></div>`}</form>
      ${locked ? '' : `<div class="demo"><p class="k">Demo control</p><label class="check"><input type="checkbox" id="fail-save" data-act="demo" data-key="failSave"${demo.failSave ? ' checked' : ''}><span>Make the next save fail</span></label></div>`}</section></div>` };
  },

  submit(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], gaps = S.evidenceGaps(state, fx, exp);
    if (ses.receipt) return { title: `Receipt ${exp}`, html: `${head(exp, 6)}<h1 tabindex="-1">Submitted, and <em>frozen.</em></h1>${stages(exp, 'submit')}
      <div class="receipt"><p class="ed-kicker" style="margin:0">Receipt · example</p><p class="big">${esc(ses.receipt)}</p>${thumbs(exp)}
      <dl class="kv"><dt>Revision</dt><dd>${id(e.revision)}</dd><dt>Request</dt><dd>${id(e.request)}</dd><dt>Booking</dt><dd>${id(e.booking)} · ${id(e.session)}</dd>${ses.usedPrepared ? '<dt>Note</dt><dd>Includes a prepared condition, used after the camera stopped.</dd>' : ''}</dl></div>` };
    const evOk = ses.captures.length === e.evidence.length, noteOk = !!ses.noteSaved && ses.noteSaved === ses.note;
    const line = (ok, text) => `<li>${ok ? `<span class="y">${icon('check')}</span>` : `<span class="n">${icon('cross')}</span>`}<span>${text}<span class="vh">${ok ? ' (ready)' : ' (missing)'}</span></span></li>`;
    return { title: `Submit ${exp}`, html: `${head(exp, 6)}<h1 tabindex="-1">Review, then <em>freeze.</em></h1>${stages(exp, 'submit')}
     ${ses.ackPending ? `<div class="msg warn"><p><strong>Not confirmed.</strong> No acknowledgement for ${id(e.request)}. Trying again reuses the same request, so it cannot be submitted twice.</p></div>` : ''}
     <div class="split even"><section aria-labelledby="h-rev"><h2 class="cap2" id="h-rev">Revision ${esc(e.revision)}</h2>${thumbs(exp)}${ses.noteSaved ? `<blockquote class="quote">${esc(ses.noteSaved)}</blockquote>` : ''}</section>
     <section aria-labelledby="h-rdy"><h2 class="cap2" id="h-rdy">Ready to submit?</h2>
      <ul class="ready">${line(evOk, `Evidence ${ses.captures.length} of ${e.evidence.length}`)}${line(noteOk, noteOk ? 'Claim saved' : ses.noteSaved ? 'Claim has unsaved changes' : 'Claim not saved')}</ul>
      ${gaps.length ? `<div class="msg bad" id="gaps"><p><strong>Not ready.</strong> <a class="ed-link" href="#/${exp}/${evOk ? 'notebook' : 'bench'}">Finish ${evOk ? 'the notebook' : 'at the bench'}</a></p><ul class="vh">${gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>` : ''}
      <div class="acts"><button class="pbtn primary" type="button" data-act="submit" data-exp="${exp}" id="do-submit">${icon('send')}${ses.ackPending ? 'Try again' : 'Submit'}</button></div>
      ${ses.ackPending ? '' : `<div class="demo"><p class="k">Demo control</p><label class="check"><input type="checkbox" id="drop-ack" data-act="demo" data-key="dropAck"${demo.dropAck ? ' checked' : ''}><span>Lose the first acknowledgement</span></label></div>`}</section></div>` };
  },

  return(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], kit = fx.kits[e.kit], short = S.kitShortfall(state, fx, exp, 'returned');
    if (ses.closed) return { title: `Closed ${exp}`, html: `${head(exp, 7)}<h1 tabindex="-1">Session <em>closed.</em></h1>${stages(exp, 'return')}
      <div class="msg ${ses.followUp ? 'warn' : 'good'}"><p>${ses.followUp ? `<strong>Closed with a missing item.</strong> ${id(ses.followUp)} asks the technician to find it.` : `<strong>Everything is back.</strong> ${kit.fixed.map(i => id(i.id)).join(' and ')} are free again.`}</p></div>${plan(kit.fixed.map(i => i.id))}` };
    return { title: `Return ${exp}`, html: `${head(exp, 7)}<h1 tabindex="-1">${kit.portable.length ? 'Return <em>every</em> item.' : 'Clear the <em>bench.</em>'}</h1>${stages(exp, 'return')}
     ${ses.receipt ? '' : `<div class="msg warn"><p><strong>Not submitted yet.</strong> Saved evidence stays, but nothing has been handed in.</p></div>`}
     <section aria-labelledby="h-ret"><h2 class="cap2" id="h-ret">${kit.portable.length ? 'Count back into STO-1' : 'Fixed items stay in place'}</h2>
     ${kit.portable.length ? kitCards(exp, 'ret') : kitMini(e.kit)}</section>
     <div class="acts" style="margin-top:22px"><button class="pbtn primary" type="button" data-act="close" data-exp="${exp}" id="close">${icon('box')}${kit.portable.length ? 'Complete return' : 'Close session'}</button>
     ${short.length && kit.portable.length ? `<button class="pbtn" type="button" data-act="close-fu" data-exp="${exp}" id="close-fu">I cannot find an item</button>` : ''}</div>` };
  },

  report() {
    return { title: 'Report a problem', html: `<p class="ed-kicker">Any role</p><h1 tabindex="-1">Report a <em>problem.</em></h1><div class="split"><div class="panel">${reportForm('C1-CAM', '#/')}</div><div>${plan(['C1-CAM'])}</div></div>` };
  },

  tech(issueId) {
    const list = state.issues;
    if (!issueId) { const open = list.filter(i => i.status !== 'Closed'), hit = state.bookings.filter(b => S.bookingImpact(state, b).affected), fus = S.openFollowUps(state);
      return { title: 'Technician console', html: `<p class="ed-kicker">Technician</p><h1 tabindex="-1">What needs <em>attention?</em></h1>
      <ul class="tiles"><li><b>${open.length}</b><span>open issue${open.length === 1 ? '' : 's'}</span></li><li><b>${hit.length}</b><span>booking${hit.length === 1 ? '' : 's'} affected</span></li><li><b>${fus.length}</b><span>follow-up${fus.length === 1 ? '' : 's'}</span></li></ul>
      <div class="split"><div><section aria-labelledby="h-iss"><h2 class="cap2" id="h-iss">Issues</h2>
      ${list.length ? list.map(i => `<a class="icard" href="#/tech/${i.id}">${icon(itemIcon(i.asset), 'lg')}<b>${esc(i.id)}</b><span class="tag ${i.status === 'Closed' ? 'ok' : i.restriction ? 'bad' : 'warn'}">${esc(i.status)}</span><span class="s">${esc(i.asset)} · ${esc(i.symptom)}</span></a>`).join('')
        : `<p class="small">Nothing reported. <a class="ed-link" href="#/report">Report one</a>, or stop the camera from the student bench.</p>`}</section>
      ${Object.entries(state.sessions).filter(([, v]) => v.followUp).map(([exp, v]) => `<section aria-labelledby="h-fu" style="margin-top:24px"><h2 class="cap2" id="h-fu">Follow-up</h2><div class="panel"><p style="margin:0 0 12px"><b>${id(v.followUp)}</b> · item missing at the return of ${id(fx.experiments[exp].booking)}</p>${v.followUpClosed ? '<span class="tag ok">Located and closed</span>' : `<button class="pbtn primary" type="button" data-act="locate" data-exp="${exp}" id="locate">${icon('check')}Found, back in STO-1</button>`}</div></section>`).join('')}</div>
      <section aria-labelledby="h-bk"><h2 class="cap2" id="h-bk">Bookings</h2>${bookingList()}</section></div>` }; }
    const i = list.find(x => x.id === issueId);
    if (!i) return { title: 'Issue not found', html: `<h1 tabindex="-1">That issue does not exist.</h1><p><a class="ed-link" href="#/tech">Back to the console</a></p>` };
    const cls = fx.fault.classifications, c = cls.find(x => x.id === i.classification), closed = i.status === 'Closed', skip = c && !c.restrict;
    // the one step that can be acted on now; an interrupted verification returns to step 4 with the restriction still on
    const at = closed ? 6 : !i.classification ? 1 : skip ? 5 : !i.restriction ? 2 : !i.repair ? 3 : !i.verification ? 4 : 5;
    const T = [['Classify', 'alert', c ? c.label.split(':')[0] : ''], ['Restrict', 'lock', i.restriction || ''], ['Repair', 'wrench', i.repair?.id || ''], ['Verify', 'check', i.verification?.id || (/interrupted/.test(i.status) ? 'Interrupted' : '')], ['Release', 'next', closed ? 'Closed' : '']];
    const impact = S.previewImpact(state, i.asset);
    const panels = {
      1: `<h2 id="st-1">What does this fault put at risk?</h2><form data-form="triage" data-issue="${i.id}" novalidate><fieldset><legend class="vh">Choose the highest consequence that applies</legend><div class="ladder">${cls.map((x, n) => { const [a, b] = x.label.split(': '); return `<label><input type="radio" name="cls" id="cls-${x.id}" value="${x.id}"${n === 1 ? ' checked' : ''}><b>${esc(a)}</b><span>${esc(b)}</span>${x.restrict ? '<span class="tag bad">Restricts</span>' : '<span class="tag plain">Stays bookable</span>'}</label>`; }).join('')}</div></fieldset><div class="acts"><button class="pbtn primary" type="submit">Record classification</button></div></form>`,
      2: `<h2 id="st-2">Restrict ${esc(i.asset)} only</h2><p class="small">The rest of the lab stays bookable. ${impact.length} booking${impact.length === 1 ? '' : 's'} hold it: ${impact.map(id).join(', ') || 'none'}.</p><div class="acts"><button class="pbtn primary" type="button" data-act="restrict" data-issue="${i.id}" id="restrict">${icon('lock')}Apply ${esc(fx.fault.restriction)}</button></div>`,
      3: `<h2 id="st-3">Record what was done</h2><form data-form="repair" data-issue="${i.id}" novalidate><div class="field"><label for="repair">Repair note <span class="hint">(example text, edit it)</span></label><textarea id="repair" name="repair" rows="2" style="min-height:72px">${esc(i.repair?.text || fx.fault.repairText)}</textarea></div><div class="acts"><button class="pbtn primary" type="submit">${icon('wrench')}Record ${esc(fx.fault.repair)}</button></div></form>`,
      4: `<h2 id="st-4">Verify under the reported conditions</h2><p class="small">${esc(fx.fault.verificationText.replace(/; no interruption observed \(example\)/, ''))}. An unverified repair does not release the asset.</p><div class="acts"><button class="pbtn primary" type="button" data-act="verify" data-issue="${i.id}" data-out="pass" id="verify-pass">${icon('check')}No interruption</button><button class="pbtn" type="button" data-act="verify" data-issue="${i.id}" data-out="interrupted" id="verify-int">Interrupted</button></div>`,
      5: `<h2 id="st-5">${skip ? 'Close without restricting' : 'Lift the restriction'}</h2><p class="small">${skip ? `${esc(i.asset)} stays bookable; the report stays in its history.` : 'Every affected booking is restored.'}</p><div class="acts"><button class="pbtn primary" type="button" data-act="release" data-issue="${i.id}" id="release">${skip ? 'Close issue' : 'Lift restriction and close'}${icon('next')}</button></div>`
    };
    return { title: i.id, html: `<p class="ed-kicker"><a class="ed-link" href="#/tech">Technician</a> · ${esc(i.id)}</p><h1 tabindex="-1">${id(i.asset)}: <em>${esc(i.status.toLowerCase())}.</em></h1>
     <div class="asset">${icon(itemIcon(i.asset), 'lg')}<p class="sym" style="margin:0">“${esc(i.symptom)}”${i.detail ? `<br><span class="who" style="font-style:normal">${esc(i.detail)}</span>` : ''}</p><span class="who">${esc(i.reporter)}${i.booking ? ` · ${esc(i.booking)}` : ''}</span><span>${availTag(i.asset)} ${occTag(i.asset)}</span></div>
     <ol class="tracker" aria-label="Progress of ${esc(i.id)}">${T.map(([label, ic, val], n) => { const s = skip && n > 0 && n < 4 ? 'skip' : n + 1 < at ? 'done' : n + 1 === at ? 'now' : 'todo'; return `<li data-s="${s}"${s === 'now' ? ' aria-current="step"' : ''}>${icon(s === 'done' ? 'check' : ic)}<b>${label}</b><span>${s === 'skip' ? 'Not needed' : esc(val) || (s === 'now' ? 'Now' : s === 'done' ? 'Done' : '–')}<span class="vh">${s === 'done' ? ' (done)' : ''}</span></span></li>`; }).join('')}</ol>
     <div class="split"><div>${closed ? `<div class="msg good"><p><strong>Closed.</strong> ${id(i.asset)} is ${esc(S.availability(state, i.asset).label.toLowerCase())}.</p></div>` : `<section class="panel" aria-labelledby="st-${at}">${panels[at]}</section>`}
       <details class="more"${closed ? ' open' : ''}><summary>${icon('list')}History · ${i.history.length}</summary><ol class="timeline">${i.history.map(h => `<li><b>${esc(h.time)} · ${esc(h.actor)}</b> ${esc(h.text)}</li>`).join('')}</ol></details></div>
      <section aria-labelledby="h-bk"><h2 class="cap2" id="h-bk">Who is affected</h2>${plan([i.asset])}<div style="height:16px"></div>${bookingList()}</section></div>` };
  },

  wall() {
    const notices = S.publicNotices(state, fx), stations = fx.resources.filter(r => r.kind === 'Station'), use = stations.map(r => S.occupancy(state, fx, r.id).state === 'in-use'), free = use.filter(u => !u).length;
    return { title: 'Wall display', html: `<div class="wall"><p class="ed-kicker">Wall display · read-only · ${esc(fx.clock.today)}</p><h1 tabindex="-1">Now in the <em>lab.</em></h1>
     <div class="free"><span class="n">${free}</span><span class="of">of ${stations.length} computing stations free</span><ul class="desks" aria-hidden="true">${use.map(u => `<li${u ? ' class="use"' : ''}></li>`).join('')}</ul></div>
     <h2>Equipment notices</h2>
     ${notices.length ? `<ul class="nt">${notices.map(n => `<li>${icon('alert', 'lg')}${esc(n.text)}</li>`).join('')}</ul>` : '<p style="margin:0">None.</p>'}
     <p class="small">No names, bookings, results or fault details are ever shown here. Example state.</p></div>` };
  },

  record() {
    return { title: 'Record and limits', html: `<p class="ed-kicker">Part 09 · P9-B</p><h1 tabindex="-1">The record, and its <em>limits.</em></h1>
     <section class="sec" aria-labelledby="h-full"><h2 class="cap2" id="h-full">Every change in this session</h2>
     ${state.log.length ? `<div class="scroll" tabindex="0" role="group" aria-label="Session record, scrolls sideways"><table class="led"><thead><tr><th scope="col">#</th><th scope="col">Time</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Reference</th><th scope="col">Reason</th></tr></thead><tbody>${state.log.map(l => `<tr><td>${l.n}</td><td>${esc(l.time)}</td><td>${esc(l.actor)}</td><th scope="row">${esc(l.action)}</th><td>${id(l.ref)}</td><td>${esc(l.reason)}</td></tr>`).join('')}</tbody></table></div><p class="small" style="margin-top:10px">Example times; three minutes per action.</p>` : '<p>Nothing has happened yet.</p>'}</section>
     <section class="sec" aria-labelledby="h-lim"><h2 class="cap2" id="h-lim">What this demonstrator is not</h2><ul class="ready">
      <li><span class="n">${icon('cross')}</span><span>No camera, signal source, booking system or account is connected.</span></li>
      <li><span class="n">${icon('cross')}</span><span>Nothing leaves this browser. “Start again” clears it.</span></li>
      <li><span class="n">${icon('cross')}</span><span>Faculty, mobile and signage are not modelled; see Part 07.</span></li>
      <li><span class="n">${icon('cross')}</span><span>No participant has tested it.</span></li></ul></section>` };
  }
};

function bookingList() {
  return `<ul class="bk">${state.bookings.map(b => { const hit = S.bookingImpact(state, b); return `<li><b>${id(b.id)}</b><span>${esc(b.day)} ${esc(b.slot)}<br><span class="w">${esc(b.who)}</span></span>${hit.affected ? `<span class="tag bad">Affected · ${esc(hit.by.join(', '))}</span>` : `<span class="tag ${b.status === 'Closed' ? 'plain' : 'ok'}">${esc(b.status)}</span>`}</li>`; }).join('')}</ul>`;
}

// Back and next stay in one place on every step; next explains itself when it is not available yet.
function dock(r) {
  const idx = STAGES.findIndex(s => s[0] === r.name), exp = r.args[0];
  if (idx < 0 || r.role !== 'student') return '';
  const { open, complete } = stageInfo(exp), cur = STAGES[idx], nxt = STAGES[idx + 1], ses = state.sessions[exp];
  const why = { arrive: 'Reserve a time first', bench: 'Start the session first', notebook: 'Start the session first', submit: 'Start the session first', return: 'Check in first' };
  const back = idx ? `<a class="pbtn" id="dock-back" href="#/${exp}/${STAGES[idx - 1][0]}">${icon('back')}${STAGES[idx - 1][1]}</a>` : `<a class="pbtn" id="dock-back" href="#/">${icon('back')}Today</a>`;
  const next = !nxt ? `<a class="pbtn${ses.closed ? ' primary' : ''}" id="dock-next" href="#/">Today${icon('next')}</a>`
    : open[nxt[0]] ? `<a class="pbtn${complete[cur[0]] ? ' primary' : ''}" id="dock-next" href="#/${exp}/${nxt[0]}">${nxt[1]}${icon('next')}</a>`
    : `<span class="why" id="dock-why">${why[nxt[0]]}</span><span class="pbtn" id="dock-next" aria-disabled="true" role="link" aria-describedby="dock-why">${nxt[1]}${icon('lock')}</span>`;
  return `<div>${back}</div><div class="mid"><span class="t">${exp} · ${cur[1]} · ${idx + 1} of 7</span><span class="meter" aria-hidden="true">${STAGES.map(([k], n) => `<i class="${n === idx ? 'cur' : complete[k] ? 'on' : ''}"></i>`).join('')}</span></div><div class="end">${next}</div>`;
}

// ---------- routing and render ----------
function route() {
  const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!p.length) return { name: 'home', role: 'student', args: [] };
  if (fx.experiments[p[0]]) {
    const k = STAGES.some(s => s[0] === p[1]) ? p[1] : 'prepare';
    return stageInfo(p[0]).open[k] ? { name: k, role: 'student', args: [p[0]] } : { name: 'prepare', role: 'student', args: [p[0]], redirected: k };
  }
  if (p[0] === 'tech') return { name: 'tech', role: 'tech', args: [p[1]] };
  if (p[0] === 'wall') return { name: 'wall', role: 'wall', args: [] };
  if (p[0] === 'report' || p[0] === 'record') return { name: p[0], role: p[0] === 'report' ? 'student' : 'record', args: [] };
  return { name: 'home', role: 'student', args: [] };
}
let lastHash = null, actOpen = false;
try { actOpen = localStorage.getItem('parallax-proto-activity') === '1'; } catch { }
function paintActivity() {
  document.body.classList.toggle('act-open', actOpen); $('#activity').hidden = !actOpen;
  const b = $('#act-toggle'); b.setAttribute('aria-expanded', actOpen); b.innerHTML = `${icon('list')}Activity <span class="n">${state.log.length}</span>`;
  const l = state.log[state.log.length - 1];
  $('#act-last').innerHTML = l ? `<b>${esc(l.time)}</b> ${esc(l.action)} ${esc(l.ref)}` : '';
}
function render({ focus = false } = {}) {
  const r = route(), keep = document.activeElement?.id;
  if (r.redirected) history.replaceState(null, '', `#/${r.args[0]}/prepare`);
  if (r.redirected) say('warn', `<p><strong>${esc(STAGES.find(s => s[0] === r.redirected)[1])} is not available yet.</strong> Start here.</p>`);
  const v = views[r.name](...r.args);
  $('#view').innerHTML = (flash ? `<div class="msg ${flash.kind}" id="flash" tabindex="-1" role="${flash.kind === 'bad' ? 'alert' : 'status'}">${flash.html}</div>` : '') + v.html;
  document.title = `${v.title} — PARALLAX prototype`;
  const d = dock(r); $('#dock').innerHTML = d; $('#dock').hidden = !d; document.body.classList.toggle('has-dock', !!d);
  const open = state.issues.filter(i => i.status !== 'Closed').length + S.openFollowUps(state).length, notices = S.publicNotices(state, fx).length;
  $('#roles').innerHTML = [['student', '#/', 'Student', 0, 'user'], ['tech', '#/tech', 'Technician', open, 'wrench'], ['wall', '#/wall', 'Wall display', notices, 'display']].map(([k, h, label, n, ic]) => `<a href="${h}"${r.role === k ? ' aria-current="page"' : ''}>${icon(ic)}${label}${n ? `<span class="n" aria-hidden="true">${n}</span><span class="vh"> (${n} ${k === 'tech' ? 'open item' : 'notice'}${n > 1 ? 's' : ''})</span>` : ''}</a>`).join('');
  $('#log').innerHTML = state.log.length ? state.log.slice(-10).reverse().map(l => `<li${l.n > seen ? ' class="new"' : ''}>${icon(logIcon(l))}<b>${esc(l.time)} · ${esc(l.actor)}</b><span>${esc(l.action)} ${id(l.ref)}</span></li>`).join('') : '<li class="empty">Nothing yet.</li>';
  seen = state.log.length; paintActivity();
  const moved = lastHash !== location.hash; lastHash = location.hash;
  if (flash) { $('#flash').focus(); $('#announce').textContent = ''; }
  else if (moved || focus) { if (moved) scrollTo(0, 0); $('#view h1')?.focus({ preventScroll: true }); $('#announce').textContent = v.title; }
  else if (keep) document.getElementById(keep)?.focus({ preventScroll: true });
  flash = null;
}
function commit(res, { good, go } = {}) {
  save();
  if (!res.ok) say('bad', `<p><strong>${esc(res.message)}</strong></p>${res.gaps ? `<ul>${res.gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}${res.alternative ? `<p>${esc(res.alternative)} is free for the same kit.</p>` : ''}`);
  else if (good) say('good', good);
  if (res.ok && go && location.hash !== go) { location.hash = go; return; }
  render({ focus: true });
}

// ---------- events ----------
addEventListener('hashchange', () => render());
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.matches('input')) return;
  const { act, exp, issue } = t.dataset, ex = exp && fx.experiments[exp];
  if (act === 'reserve') commit(S.reserve(state, fx, exp, t.dataset.slot), { good: `<p><strong>Reserved.</strong> ${id(ex.booking)} holds the whole kit.</p>` });
  else if (act === 'kit-all') { for (const i of fx.kits[ex.kit].portable) S.verifyKitItem(state, fx, exp, i.id, i.qty); save(); render(); }
  else if (act === 'start') commit(S.startSession(state, fx, exp), { go: `#/${exp}/bench` });
  else if (act === 'capture') commit(S.capture(state, fx, exp, t.dataset.ev, { prepared: !!t.dataset.prepared }), { good: `<p><strong>${id(t.dataset.ev)} recorded</strong> with its settings.</p>` });
  else if (act === 'interrupt') commit(S.interruptCamera(state));
  else if (act === 'submit') { const res = S.submit(state, fx, exp, { dropAck: demo.dropAck }); demo.dropAck = false; if (!res.ok && res.code === 'no-ack') { save(); render({ focus: true }); } else commit(res); }
  else if (act === 'close') commit(S.closeSession(state, fx, exp));
  else if (act === 'close-fu') commit(S.closeSession(state, fx, exp, { withFollowUp: true }));
  else if (act === 'restrict') { const res = S.applyRestriction(state, fx, issue); commit(res, { good: `<p><strong>${id(fx.fault.restriction)} applied.</strong> Affected: ${res.impact?.length ? res.impact.map(id).join(', ') : 'no bookings'}.</p>` }); }
  else if (act === 'locate') { const res = S.locateItem(state, fx, exp); commit(res, { good: `<p><strong>Follow-up closed.</strong> ${res.located?.map(id).join(', ')} is bookable again.</p>` }); }
  else if (act === 'verify') commit(S.verify(state, fx, issue, t.dataset.out), { good: `<p><strong>Verified.</strong> ${id(fx.fault.verification)} recorded.</p>` });
  else if (act === 'release') { const res = S.release(state, fx, issue); commit(res, { good: `<p><strong>Closed.</strong> ${res.restored?.length ? `Restored ${res.restored.map(id).join(', ')}.` : 'No bookings were affected.'}</p>` }); }
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.dataset?.act) return;
  const { act, exp } = t.dataset;
  if (act === 'prep') S.setPrepared(state, fx, exp, Number(t.dataset.i), t.checked);
  else if (act === 'kit') S.verifyKitItem(state, fx, exp, t.dataset.item, t.value);
  else if (act === 'ret') S.returnItem(state, fx, exp, t.dataset.item, t.value);
  else if (act === 'demo') { demo[t.dataset.key] = t.checked; return; }
  // a number field commits on blur, before focus has landed on the next control; render after it has, so focus is kept
  save(); setTimeout(render, 0);
});
document.addEventListener('input', e => { if (e.target.id === 'note') { const exp = e.target.form.dataset.exp; if (!state.sessions[exp].receipt) { state.sessions[exp].note = e.target.value; save(); } } });
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault();
  const d = new FormData(f), kind = f.dataset.form, exp = f.dataset.exp;
  if (kind === 'checkin') {
    const res = S.checkIn(state, fx, exp, d.get('station'));
    if (res.ok) return commit(res, { good: `<p><strong>Checked in.</strong> Now count the kit.</p>` });
    save(); const inp = $('#station'); inp.setAttribute('aria-invalid', 'true'); $('#station-e').innerHTML = `<span class="msg bad" role="alert" style="display:block;margin:6px 0 0">${esc(res.message)}</span>`; inp.focus(); inp.select();
  } else if (kind === 'note') { const res = S.saveNote(state, fx, exp, d.get('note'), { failSave: demo.failSave }); if (res.code === 'save-failed') demo.failSave = false; commit(res, { good: `<p><strong>Saved.</strong></p>` }); }
  else if (kind === 'report') { const res = S.reportIssue(state, fx, { asset: d.get('asset'), symptom: d.get('symptom'), detail: d.get('detail') }); commit(res, { good: `<p><strong>${id(res.issue)} sent.</strong> Nothing is restricted until a technician classifies it.</p>`, go: f.dataset.back }); }
  else if (kind === 'triage') commit(S.triage(state, fx, f.dataset.issue, d.get('cls')));
  else if (kind === 'repair') commit(S.recordRepair(state, fx, f.dataset.issue, d.get('repair')));
});
// the dock is fixed, so a control that takes focus underneath it is scrolled clear (WCAG 2.4.11)
document.addEventListener('focusin', e => {
  const d = $('#dock'); if (d.hidden || !e.target.closest?.('#view') || e.target.id === 'view') return;
  const r = e.target.getBoundingClientRect(), top = d.getBoundingClientRect().top;
  if (r.bottom > top - 8 && r.height < top) scrollBy(0, r.bottom - top + 24);
});
$('#act-toggle').addEventListener('click', () => { actOpen = !actOpen; try { localStorage.setItem('parallax-proto-activity', actOpen ? '1' : '0'); } catch { } paintActivity(); });
$('#reset').addEventListener('click', () => {
  if (state.log.length && !confirm('Clear every example record in this browser and start again?')) return;
  state = S.createState(fx); seen = 0; demo.failSave = demo.dropAck = false; save();
  say('good', '<p><strong>Started again.</strong> All example records were cleared.</p>');
  if (location.hash && location.hash !== '#/') location.hash = '#/'; else render({ focus: true });
});
// another tab (or the Lab Map) changed the shared state
addEventListener('storage', e => { if (e.key === S.STORAGE_KEY) { state = load(); render(); } });

save(); render({ focus: false });
