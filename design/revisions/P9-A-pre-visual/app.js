// PARALLAX P9-A demonstrator: views over the shared state in store.js. Hash routes; native controls only.
import * as S from './store.js';

const fx = await fetch('fixtures.json').then(r => r.json());
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

// ---------- shared pieces ----------
const STAGES = [['prepare', 'Prepare'], ['reserve', 'Reserve'], ['arrive', 'Arrive'], ['bench', 'Bench'], ['notebook', 'Notebook'], ['submit', 'Submit'], ['return', 'Return']];
function stageInfo(exp) {
  const ses = state.sessions[exp], b = S.myBooking(state, exp);
  const open = { prepare: true, reserve: true, arrive: !!b, bench: ses.checkedIn, notebook: ses.started, submit: ses.started, return: ses.checkedIn };
  const complete = { prepare: state.prepared[exp].every(Boolean), reserve: !!b, arrive: ses.started, bench: fx.experiments[exp].evidence.every(e => ses.captures.some(c => c.id === e.id)), notebook: !!ses.noteSaved && ses.noteSaved === ses.note, submit: !!ses.receipt, return: ses.closed };
  return { open, complete };
}
function stages(exp, current) {
  const { open, complete } = stageInfo(exp);
  return `<nav aria-label="Steps for ${exp}"><ol class="stages">${STAGES.map(([k, label]) => {
    const cls = complete[k] ? ' class="done"' : '', extra = complete[k] ? '<span class="vh"> (done)</span>' : '';
    return `<li>${open[k] ? `<a${cls} href="#/${exp}/${k}"${k === current ? ' aria-current="step"' : ''}>${label}${extra}</a>` : `<span aria-disabled="true">${label}<span class="vh"> (not available yet)</span></span>`}</li>`;
  }).join('')}</ol></nav>`;
}
const head = (exp, kicker) => { const e = fx.experiments[exp]; return `<p class="ed-kicker">${esc(kicker)} · ${exp} · ${esc(e.strand)}</p>`; };
const availTag = r => { const a = S.availability(state, r); return `<span class="tag ${a.state === 'bookable' ? 'ok' : a.state === 'restricted' ? 'bad' : 'warn'}">${esc(a.label)}</span>`; };
const occTag = r => { const o = S.occupancy(state, fx, r); return `<span class="tag ${o.state === 'in-use' ? 'info' : 'plain'}">${esc(o.label)}</span>`; };
function manifest(kitId) {
  const k = fx.kits[kitId], name = i => i.name || fx.resources.find(r => r.id === i.id)?.name || i.id;
  const row = (i, kind) => `<tr><th scope="row">${id(i.id)}</th><td>${esc(name(i))}</td><td>${i.qty}</td><td>${kind}</td><td>${(i.members || [i.id]).map(m => availTag(m)).join(' ')}</td></tr>`;
  return `<div class="scroll" tabindex="0" role="group" aria-label="Kit manifest, scrolls sideways"><table class="led"><caption>Manifest ${esc(kitId)} · ${esc(k.name)}</caption><thead><tr><th scope="col">ID</th><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Kind</th><th scope="col">Availability</th></tr></thead><tbody>${k.fixed.map(i => row(i, 'Fixed')).join('')}${k.portable.map(i => row(i, 'Portable')).join('')}</tbody></table></div>`;
}
function reportForm(asset, back) {
  const open = state.issues.find(i => i.asset === asset && i.status !== 'Closed');
  if (open) return `<div class="msg"><p><strong>${id(open.id)} is open for ${id(asset)}.</strong> Status: ${esc(open.status)}. A technician has the report; you do not need to send it again.</p></div>`;
  return `<form data-form="report" data-back="${esc(back)}" novalidate>
   <div class="field"><label for="rep-asset">Which item has the problem?</label><select id="rep-asset" name="asset">${fx.resources.map(r => `<option value="${r.id}"${r.id === asset ? ' selected' : ''}>${r.id} · ${esc(r.name)}</option>`).join('')}</select></div>
   <div class="field"><label for="rep-sym">What did you see?</label><select id="rep-sym" name="symptom">${fx.fault.symptoms.map(x => `<option>${esc(x)}</option>`).join('')}</select></div>
   <div class="field"><label for="rep-detail">Anything else a technician should know? <span class="hint">(optional)</span></label><textarea id="rep-detail" name="detail" rows="3"></textarea></div>
   <div class="acts"><button class="pbtn primary" type="submit">Send report</button></div></form>`;
}

// ---------- illustrations ----------
function scene(side) {
  const sh = side ? '<path d="M118 142 L196 142 L172 128 L118 128Z" fill="#05070A"/><path d="M190 142 L276 142 L250 130 L190 130Z" fill="#05070A"/><path d="M262 142 L318 142 L300 134 L262 134Z" fill="#05070A"/>' : '<ellipse cx="88" cy="143" rx="34" ry="4" fill="#05070A"/><ellipse cx="168" cy="143" rx="24" ry="4" fill="#05070A"/><ellipse cx="244" cy="143" rx="22" ry="4" fill="#05070A"/>';
  const f = side ? ['#9BA4B4', '#4A5261', '#7B8494', '#3D4553', '#565E6C'] : ['#C9D0DC', '#B4BCCB', '#C2C9D6', '#AEB6C4', '#B9C1CE'];
  return `<svg viewBox="0 0 320 180" role="img" aria-label="${side ? 'Illustration, side light: long shadows fall to the right and object 03 sits partly in the shadow of the cylinder.' : 'Illustration, frontal light: three objects evenly lit with short shadows.'}">
   <rect width="320" height="180" fill="#151922"/><rect y="142" width="320" height="38" fill="#202936"/>${sh}
   <rect x="58" y="92" width="52" height="50" fill="${f[0]}"/><rect x="110" y="92" width="10" height="50" fill="${f[1]}"/>
   <rect x="148" y="78" width="40" height="64" fill="${f[2]}"/><rect x="${side ? 174 : 188}" y="78" width="${side ? 14 : 0}" height="64" fill="${f[3]}"/><ellipse cx="168" cy="78" rx="20" ry="6" fill="${side ? '#B4BCCB' : '#DDE2EB'}"/>
   <path d="M224 142 L244 100 L264 142Z" fill="${f[4]}"/>
   <g fill="none" stroke="#6EE7C5" stroke-width="1.2" stroke-dasharray="4 3"><rect x="54" y="88" width="70" height="58"/><rect x="144" y="68" width="48" height="78"/><rect x="220" y="96" width="48" height="50"/></g>
   <g font-family="JetBrains Mono, monospace" font-size="8" fill="#6EE7C5"><text x="54" y="84">01 BOX</text><text x="144" y="64">02 CYLINDER</text><text x="220" y="92">03 EXPECTED OBJECT</text></g>
   <text x="8" y="14" font-family="JetBrains Mono, monospace" font-size="8" fill="#BDC7D9">${side ? 'ILL-L2-v1 · SIDE LIGHT' : 'ILL-L1-v1 · FRONTAL LIGHT'} · ILLUSTRATION</text></svg>`;
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
   <p class="cap">Solid grey: reference ${esc(fx.experiments.E01.source.formula)}. Squares: ${pts.length} samples at ${rate} Hz.${alias ? ` Dashed gold: a ${Math.abs(fa)} Hz curve that passes through the same samples.` : ''}</p>
   <details><summary>Sample values as a table</summary><table><thead><tr><th scope="col">t, s</th><th scope="col">V</th></tr></thead><tbody>${pts.map(p => `<tr><td>${p.t.toFixed(3)}</td><td>${(Math.abs(p.v) < 5e-4 ? 0 : p.v).toFixed(3)}</td></tr>`).join('')}</tbody></table></details>`;
}

// ---------- views ----------
const views = {
  home() {
    const mine = Object.keys(fx.experiments).map(exp => ({ exp, b: S.myBooking(state, exp), ses: state.sessions[exp] }));
    const notices = S.publicNotices(state, fx);
    const next = ({ exp, b, ses }) => !b ? ['prepare', 'Prepare and reserve'] : ses.closed ? ['return', 'Session closed'] : ses.receipt ? ['return', 'Return the kit'] : ses.started ? ['bench', 'Continue at the bench'] : ['arrive', 'Check in'];
    return { title: 'Today', html: `<p class="ed-kicker">Student · ${esc(fx.clock.today)}</p><h1 tabindex="-1">What do you need <em>to do</em> in the lab?</h1>
     <p class="lede">Follow one experiment from preparation to a submitted record. If the equipment fails on the way, report it and watch every other view change.</p>
     ${notices.length ? `<div class="msg warn"><p><strong>Equipment notice.</strong> ${notices.map(n => `${id(n.asset)}: ${esc(n.text)}`).join(' ')}</p></div>` : ''}
     <section class="sec" aria-labelledby="h-exp"><h2 id="h-exp">Your experiments</h2>
      ${mine.map(m => { const e = fx.experiments[m.exp], [k, label] = next(m), hit = m.b && S.bookingImpact(state, m.b);
        return `<div class="entry2"><span class="k">${m.exp} · ${esc(e.strand)} · ${esc(e.duration)}</span><h2><a href="#/${m.exp}/${k}">${esc(e.title)}</a></h2>
        <p class="small">${m.b ? `${id(m.b.id)} · ${esc(m.b.day)} ${esc(m.b.slot)} · ${esc(m.b.status)}${hit.affected ? ` · <span class="tag bad">Affected by ${esc(hit.by.join(', '))}</span>` : ''}` : 'Not reserved yet.'}</p>
        <div class="acts" style="margin-top:6px"><a class="pbtn${m.ses.closed ? '' : ' primary'}" href="#/${m.exp}/${k}">${esc(label)}<span class="vh">: ${m.exp}</span></a></div></div>`; }).join('')}
     </section>
     <section class="sec" aria-labelledby="h-av"><h2 id="h-av">Equipment right now</h2>
      <p class="small" style="margin-bottom:14px">Availability says whether an item can be booked. Occupancy says whether someone is using it. They are separate facts.</p>
      <div class="scroll" tabindex="0" role="group" aria-label="Equipment list, scrolls sideways"><table class="led"><thead><tr><th scope="col">ID</th><th scope="col">Item</th><th scope="col">Zone</th><th scope="col">Availability</th><th scope="col">Occupancy</th></tr></thead><tbody>
      ${fx.resources.map(r => `<tr><th scope="row">${id(r.id)}</th><td>${esc(r.name)}</td><td>${esc(r.zone)}</td><td>${availTag(r.id)}</td><td>${occTag(r.id)}</td></tr>`).join('')}</tbody></table></div>
      <div class="acts"><a class="pbtn" href="../design/phase-08/lab-map.html">Open the Lab Map with this state</a><a class="pbtn" href="#/report">Report a problem</a><a class="pbtn" href="../design/phase-08/scene-studio.html">Scene Studio</a></div>
     </section>` };
  },

  prepare(exp) {
    const e = fx.experiments[exp], all = state.prepared[exp].every(Boolean);
    return { title: `Prepare ${exp}`, html: `${head(exp, 'Step 1 of 7')}<h1 tabindex="-1">${esc(e.title)}</h1>${stages(exp, 'prepare')}
     <p class="lede">${esc(e.question)}</p>
     <section class="sec" aria-labelledby="h-kit"><h2 id="h-kit">What you will reserve</h2>${manifest(e.kit)}
      ${e.source ? `<p class="small" style="margin-top:12px">Input ${id(e.source.id)}: ${esc(e.source.formula)}, ${e.source.durationS} s, ±${e.source.amplitudeV} V. Generated, not a booked device.</p>` : ''}</section>
     <section class="sec" aria-labelledby="h-chk"><h2 id="h-chk">Before you reserve</h2>
      <fieldset><legend class="vh">Preparation checklist for ${exp}</legend>
      ${e.prepare.map((t, i) => `<label class="check"><input type="checkbox" id="prep-${i}" data-act="prep" data-exp="${exp}" data-i="${i}"${state.prepared[exp][i] ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</fieldset>
      <div class="acts"><a class="pbtn${all ? ' primary' : ''}" href="#/${exp}/reserve">Continue to reserve</a>${all ? '' : `<span class="small">${state.prepared[exp].filter(Boolean).length} of ${e.prepare.length} confirmed. You can look at times now; reserving needs all ${e.prepare.length}.</span>`}</div></section>` };
  },

  reserve(exp) {
    const e = fx.experiments[exp], b = S.myBooking(state, exp), kit = S.kitStatus(state, fx, e.kit), other = exp === 'E06' ? 'E01' : 'E06';
    return { title: `Reserve ${exp}`, html: `${head(exp, 'Step 2 of 7')}<h1 tabindex="-1">Reserve the <em>whole</em> kit.</h1>${stages(exp, 'reserve')}
     ${b ? `<div class="msg good"><p><strong>${id(b.id)} is confirmed</strong> for ${esc(b.day)} at ${esc(b.slot)}. It holds ${b.resources.map(id).join(', ')}.</p></div><div class="acts"><a class="pbtn primary" href="#/${exp}/arrive">Go to check-in</a></div>`
      : `<p class="lede">One booking holds every item in ${id(e.kit)} for the same time, so nothing is missing when you arrive.</p>
      ${kit.ok ? '' : `<div class="msg bad"><p><strong>${id(e.kit)} cannot be reserved right now.</strong> ${kit.blockers.map(x => `${id(x)} is ${esc(S.availability(state, x).label.toLowerCase())}`).join('; ')}.</p><p>${S.kitStatus(state, fx, fx.experiments[other].kit).ok ? `You can still do <a class="ed-link" href="#/${other}/prepare">${other} · ${esc(fx.experiments[other].title)}</a>, which does not use it.` : ''} This page updates when the item is released.</p></div>`}
      <section class="sec" aria-labelledby="h-slots"><h2 id="h-slots">${esc(fx.clock.today)}</h2><ul class="slots">
      ${fx.slots.map(slot => { const st = S.slotStatus(state, fx, exp, slot); return `<li class="slot"><b>${slot}</b><span class="tag ${st.state === 'free' ? 'ok' : st.state === 'taken' ? 'warn' : 'bad'}">${st.state === 'free' ? 'Free' : st.state === 'taken' ? 'Taken' : 'Kit unavailable'}</span><span class="small">${esc(st.reason)}</span>
        <button class="pbtn${st.state === 'free' ? ' primary' : ''}" type="button" data-act="reserve" data-exp="${exp}" data-slot="${slot}" id="slot-${slot.replace(':', '')}">Reserve ${slot}<span class="vh"> for ${exp}</span></button></li>`; }).join('')}</ul></section>
      <section class="sec">${manifest(e.kit)}</section>`}` };
  },

  arrive(exp) {
    const e = fx.experiments[exp], b = S.myBooking(state, exp), ses = state.sessions[exp], kit = fx.kits[e.kit], hit = S.bookingImpact(state, b);
    return { title: `Arrive ${exp}`, html: `${head(exp, 'Step 3 of 7')}<h1 tabindex="-1">Check in at <em>your</em> station.</h1>${stages(exp, 'arrive')}
     ${hit.affected && !ses.started ? `<div class="msg bad"><p><strong>${id(b.id)} is affected.</strong> ${hit.by.map(id).join(', ')} is restricted, so capture cannot start. You will be told here when it is released.</p></div>` : ''}
     <section class="sec" aria-labelledby="h-st"><h2 id="h-st">1. Confirm the station</h2>
     ${ses.checkedIn ? `<p><span class="tag ok">Checked in</span> ${id(ses.station)} matches ${id(b.id)}. Attendance is recorded from this check-in.</p>`
      : `<form data-form="checkin" data-exp="${exp}" novalidate><div class="field"><label for="station">Station ID on the desk label</label><span class="hint" id="station-h">Your booking ${esc(b.id)} is for ${esc(e.station)}. Type the ID you see; scanning the label does the same thing.</span><input type="text" id="station" name="station" autocomplete="off" autocapitalize="characters" aria-describedby="station-h station-e" inputmode="text"><span id="station-e"></span></div><div class="acts"><button class="pbtn primary" type="submit">Check in</button><a class="pbtn" href="../design/phase-08/lab-map.html?id=${e.station}">Find ${e.station} on the Lab Map</a></div></form>`}</section>
     <section class="sec" aria-labelledby="h-vk"><h2 id="h-vk">2. Check the kit against the manifest</h2>
     ${kit.portable.length ? `<p class="small" style="margin-bottom:10px">Count what is at the station. The same manifest is used when you return the kit.</p>
      ${kit.portable.map(i => `<div class="qty"><label for="kit-${i.id}">${id(i.id)} ${esc(i.name || fx.resources.find(r => r.id === i.id).name)}</label><div><input type="number" id="kit-${i.id}" min="0" max="${i.qty}" value="${ses.kit[i.id] ?? 0}" data-act="kit" data-exp="${exp}" data-item="${i.id}"${ses.started ? ' disabled' : ''}><span class="of">of ${i.qty}</span></div></div>`).join('')}
      ${ses.started ? '' : `<div class="acts"><button class="pbtn" type="button" data-act="kit-all" data-exp="${exp}" id="kit-all">Everything on the manifest is here</button></div>`}`
      : `<p>${id(e.kit)} has no portable items. ${kit.fixed.map(i => id(i.id)).join(' and ')} are fixed and stay where they are.</p>`}</section>
     <div class="acts">${ses.started ? `<a class="pbtn primary" href="#/${exp}/bench">Go to the bench</a><span class="tag ok">Session started</span>` : `<button class="pbtn primary" type="button" data-act="start" data-exp="${exp}" id="start">Start session</button>`}</div>` };
  },

  bench(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], has = x => ses.captures.find(c => c.id === x), all = e.evidence.every(x => has(x.id));
    const camIssue = state.issues.find(i => i.asset === 'C1-CAM' && i.status !== 'Closed'), camRestricted = !!state.resources['C1-CAM'].restriction;
    let body;
    if (exp === 'E06') {
      const down = ses.interrupted || camRestricted;
      body = `${down ? `<div class="msg bad"><p><strong>${camRestricted ? `C1-CAM is restricted (${esc(state.resources['C1-CAM'].restriction)}).` : 'The camera feed has stopped.'}</strong> ${ses.captures.length ? `Evidence already recorded is safe: ${ses.captures.map(c => id(c.id)).join(', ')}.` : 'Nothing had been recorded yet, so nothing was lost.'}</p>
        ${camIssue ? `<p>${id(camIssue.id)} is with the technician (${esc(camIssue.status)}).${all ? '' : ' You can finish with the prepared condition below; it is labelled as prepared wherever it appears.'}</p>` : '<p>Report it so the next booking is not caught out. The report takes three fields.</p>'}</div>
        ${camIssue ? '' : `<section class="sec" aria-labelledby="h-rep"><h2 id="h-rep">Report the problem</h2>${reportForm('C1-CAM', `#/${exp}/bench`)}</section>`}` : ''}
       <figure class="plate"><div class="pair">${e.evidence.map((ev, n) => `<div>${scene(n === 1)}<div class="acts">${has(ev.id) ? `<span class="tag ok">Recorded ${esc(has(ev.id).time)}</span>` : down ? (camIssue ? `<button class="pbtn" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" data-prepared="1" id="cap-${ev.id}">Use prepared ${esc(ev.label.toLowerCase())}</button>` : `<button class="pbtn" type="button" disabled aria-describedby="why-${n}">Record ${esc(ev.label.toLowerCase())}</button><span class="cap" id="why-${n}" style="margin:0">Camera unavailable.</span>`) : `<button class="pbtn primary" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" id="cap-${ev.id}">Record ${esc(ev.label.toLowerCase())}</button>`}</div><p class="cap">${id(ev.id)} · ${esc(ev.detail)}</p></div>`).join('')}</div>
        <figcaption>Settings kept with each record: exposure ${esc(e.settings.exposure)}, gain ${esc(e.settings.gain)}, light ${esc(e.settings.lightIntensity)}. Dashed outlines are illustrative annotations. ${esc(e.evidenceKind)}</figcaption></figure>
       ${ses.started && !down && !all ? `<div class="demo"><p class="k">Demonstration control</p><p>No camera is connected. This button plays the device-failure exception so the recovery path can be shown.</p><button class="pbtn quiet" type="button" data-act="interrupt" id="interrupt">Stop the camera feed</button></div>` : ''}`;
    } else {
      body = `<div class="plate"><div class="pair">${e.evidence.map(ev => `<div><h2>${esc(ev.label)} · ${id(ev.id)}</h2>${has(ev.id) ? plot(ev.rateHz) : `<p class="cap" style="margin:0 0 12px">Not run yet. ${esc(ev.detail)}.</p><button class="pbtn primary" type="button" data-act="capture" data-exp="${exp}" data-ev="${ev.id}" id="cap-${ev.id}">Run at ${ev.rateHz} Hz</button>`}</div>`).join('')}</div>
       <p class="cap">Both plots use the same axes: 0–1 s and ±1 V. ${esc(e.evidenceKind)} A sparse set of samples is ambiguous for this known reference; this does not estimate an unknown physical signal.</p></div>`;
    }
    return { title: `Bench ${exp}`, html: `${head(exp, 'Step 4 of 7')}<h1 tabindex="-1">${exp === 'E06' ? 'Same scene, <em>two</em> lights.' : 'Same signal, <em>two</em> rates.'}</h1>${stages(exp, 'bench')}
     <p class="lede">${esc(e.question)}</p>${body}
     <div class="acts"><a class="pbtn${all ? ' primary' : ''}" href="#/${exp}/notebook">Continue to the notebook</a><span class="small">${ses.captures.length} of ${e.evidence.length} evidence items recorded.</span></div>` };
  },

  notebook(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], dirty = ses.note !== (ses.noteSaved ?? ''), locked = !!ses.receipt;
    return { title: `Notebook ${exp}`, html: `${head(exp, 'Step 5 of 7')}<h1 tabindex="-1">What does the evidence <em>let you say?</em></h1>${stages(exp, 'notebook')}
     <section class="sec" aria-labelledby="h-ev"><h2 id="h-ev">Evidence attached</h2>
      ${ses.captures.length ? `<div class="scroll" tabindex="0" role="group" aria-label="Evidence list, scrolls sideways"><table class="led"><thead><tr><th scope="col">ID</th><th scope="col">Condition</th><th scope="col">Source</th><th scope="col">Settings</th><th scope="col">Time</th></tr></thead><tbody>${ses.captures.map(c => `<tr><th scope="row">${id(c.id)}</th><td>${esc(c.label)}</td><td>${esc(c.source)}</td><td>${esc(Object.values(c.settings).join(' · '))}</td><td>${esc(c.time)}</td></tr>`).join('')}</tbody></table></div>` : `<p>Nothing recorded yet. <a class="ed-link" href="#/${exp}/bench">Go back to the bench.</a></p>`}</section>
     <section class="sec" aria-labelledby="h-claim"><h2 id="h-claim">Your claim</h2>
      <form data-form="note" data-exp="${exp}" novalidate><div class="field" style="max-width:720px"><label for="note">Describe what changed between the two conditions, and what this evidence cannot show.</label><span class="hint" id="note-h">At least 40 characters. ${locked ? 'This revision is frozen because it was submitted.' : dirty && ses.noteSaved ? 'You have changes that are not saved.' : ses.noteSaved ? 'Saved.' : 'Not saved yet.'}</span>
       <textarea id="note" name="note" rows="6" aria-describedby="note-h"${locked ? ' readonly' : ''}>${esc(ses.note)}</textarea></div>
       <div class="acts">${locked ? '' : '<button class="pbtn primary" type="submit">Save</button>'}<a class="pbtn" href="#/${exp}/submit">Review and submit</a></div></form>
      ${locked ? '' : `<div class="demo"><p class="k">Demonstration control</p><p>Plays the save-failure exception once. Your text must survive it.</p><label class="check" style="border:0;padding:0"><input type="checkbox" id="fail-save" data-act="demo" data-key="failSave"${demo.failSave ? ' checked' : ''}><span>Make the next save fail</span></label></div>`}</section>` };
  },

  submit(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], gaps = S.evidenceGaps(state, fx, exp);
    if (ses.receipt) return { title: `Receipt ${exp}`, html: `${head(exp, 'Step 6 of 7')}<h1 tabindex="-1">Submitted, and <em>frozen.</em></h1>${stages(exp, 'submit')}
      <div class="receipt"><p class="ed-kicker">Receipt · example</p><p class="big">${esc(ses.receipt)}</p>
      <dl class="kv"><dt>Revision</dt><dd>${id(e.revision)}</dd><dt>Request</dt><dd>${id(e.request)}</dd><dt>Evidence</dt><dd>${ses.captures.map(c => id(c.id)).join(', ')}</dd><dt>Booking</dt><dd>${id(e.booking)} · ${id(e.session)}</dd>${ses.usedPrepared ? '<dt>Note</dt><dd>Includes a prepared condition, used after the camera stopped.</dd>' : ''}</dl></div>
      <div class="acts"><a class="pbtn primary" href="#/${exp}/return">${fx.kits[e.kit].portable.length ? 'Return the kit' : 'Clear the bench'}</a></div>` };
    return { title: `Submit ${exp}`, html: `${head(exp, 'Step 6 of 7')}<h1 tabindex="-1">Review the <em>revision</em> before it is frozen.</h1>${stages(exp, 'submit')}
     ${ses.ackPending ? `<div class="msg warn"><p><strong>Not confirmed.</strong> No acknowledgement came back for ${id(e.request)}. Trying again uses the same request, so it cannot be submitted twice.</p></div>` : ''}
     <section class="sec" aria-labelledby="h-rev"><h2 id="h-rev">${id(e.revision)}</h2>
      <dl class="kv"><dt>Experiment</dt><dd>${exp} · method r${e.methodRevision}</dd><dt>Evidence</dt><dd>${ses.captures.length ? ses.captures.map(c => `${id(c.id)} (${esc(c.source)})`).join(', ') : 'None recorded'}</dd><dt>Claim</dt><dd>${ses.noteSaved ? esc(ses.noteSaved) : 'Not saved'}</dd></dl></section>
     ${gaps.length ? `<div class="msg bad" id="gaps"><p><strong>Not ready to submit.</strong></p><ul>${gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ul><p><a class="ed-link" href="#/${exp}/${gaps.some(g => /notebook/.test(g)) && ses.captures.length === e.evidence.length ? 'notebook' : 'bench'}">Go back and finish it</a></p></div>` : ''}
     <div class="acts"><button class="pbtn primary" type="button" data-act="submit" data-exp="${exp}" id="do-submit">${ses.ackPending ? 'Try again' : 'Submit this revision'}</button></div>
     ${ses.ackPending ? '' : `<div class="demo"><p class="k">Demonstration control</p><p>Plays the missing-acknowledgement exception once. The page must not claim the work was submitted.</p><label class="check" style="border:0;padding:0"><input type="checkbox" id="drop-ack" data-act="demo" data-key="dropAck"${demo.dropAck ? ' checked' : ''}><span>Lose the first acknowledgement</span></label></div>`}` };
  },

  return(exp) {
    const e = fx.experiments[exp], ses = state.sessions[exp], kit = fx.kits[e.kit], short = S.kitShortfall(state, fx, exp, 'returned');
    if (ses.closed) return { title: `Closed ${exp}`, html: `${head(exp, 'Step 7 of 7')}<h1 tabindex="-1">Session <em>closed.</em></h1>${stages(exp, 'return')}
      <div class="msg ${ses.followUp ? 'warn' : 'good'}"><p>${ses.followUp ? `<strong>Closed with a return exception.</strong> ${id(ses.followUp)} asks the technician to locate the missing item. It shows as “Location unknown” until then.` : `<strong>Everything is back.</strong> ${kit.fixed.map(i => id(i.id)).join(' and ')} are free for the next booking.`}</p></div>
      <div class="acts"><a class="pbtn primary" href="#/">Back to today</a></div>` };
    return { title: `Return ${exp}`, html: `${head(exp, 'Step 7 of 7')}<h1 tabindex="-1">${kit.portable.length ? 'Return <em>every</em> item.' : 'Clear the <em>bench.</em>'}</h1>${stages(exp, 'return')}
     ${ses.receipt ? '' : `<div class="msg warn"><p><strong>Not submitted yet.</strong> You can return the kit now; your saved evidence stays, but nothing has been handed in.</p></div>`}
     <section class="sec" aria-labelledby="h-ret"><h2 id="h-ret">${kit.portable.length ? 'Count what goes back to STO-1' : 'Fixed resources'}</h2>
     ${kit.portable.map(i => `<div class="qty"><label for="ret-${i.id}">${id(i.id)} ${esc(i.name || fx.resources.find(r => r.id === i.id).name)}</label><div><input type="number" id="ret-${i.id}" min="0" max="${i.qty}" value="${ses.returned[i.id] ?? 0}" data-act="ret" data-exp="${exp}" data-item="${i.id}"><span class="of">of ${i.qty}</span></div></div>`).join('')}
     <p class="small" style="margin-top:12px">${kit.fixed.map(i => id(i.id)).join(' and ')} stay in place. Leave them clear and switched off.</p></section>
     <div class="acts"><button class="pbtn primary" type="button" data-act="close" data-exp="${exp}" id="close">${kit.portable.length ? 'Complete return' : 'Close session'}</button>
     ${short.length && kit.portable.length ? `<button class="pbtn" type="button" data-act="close-fu" data-exp="${exp}" id="close-fu">I cannot find an item</button>` : ''}</div>` };
  },

  report() {
    return { title: 'Report a problem', html: `<p class="ed-kicker">Any role</p><h1 tabindex="-1">Report a <em>problem.</em></h1><p class="lede">Name the item and what you saw. A technician decides what happens next; you will see the result on the equipment list.</p>${reportForm('C1-CAM', '#/')}` };
  },

  tech(issueId) {
    const list = state.issues;
    if (!issueId) return { title: 'Technician console', html: `<p class="ed-kicker">Technician</p><h1 tabindex="-1">What needs <em>attention?</em></h1>
      <section class="sec" aria-labelledby="h-iss"><h2 id="h-iss">Issues</h2>
      ${list.length ? `<div class="scroll" tabindex="0" role="group" aria-label="Issue list, scrolls sideways"><table class="led"><thead><tr><th scope="col">Issue</th><th scope="col">Asset</th><th scope="col">Symptom</th><th scope="col">Status</th></tr></thead><tbody>${list.map(i => `<tr><th scope="row"><a class="ed-link" href="#/tech/${i.id}">${esc(i.id)}</a></th><td>${id(i.asset)}</td><td>${esc(i.symptom)}</td><td><span class="tag ${i.status === 'Closed' ? 'ok' : i.restriction ? 'bad' : 'warn'}">${esc(i.status)}</span></td></tr>`).join('')}</tbody></table></div>`
        : `<p>No issues have been reported. A student can report one from the bench, or you can <a class="ed-link" href="#/report">report one here</a>.</p>`}</section>
      ${Object.entries(state.sessions).filter(([, v]) => v.followUp).map(([exp, v]) => `<section class="sec" aria-labelledby="h-fu"><h2 id="h-fu">Follow-up ${id(v.followUp)}</h2><p>An item was not located at the kit return for ${id(fx.experiments[exp].booking)} (${id(fx.returnFollowUp.exception)}). ${v.followUpClosed ? '<span class="tag ok">Located and closed</span>' : 'Bookings that hold it are marked affected until it is found.'}</p>${v.followUpClosed ? '' : `<div class="acts"><button class="pbtn primary" type="button" data-act="locate" data-exp="${exp}" id="locate">Item found and back in STO-1</button></div>`}</section>`).join('')}
      <section class="sec" aria-labelledby="h-bk"><h2 id="h-bk">Bookings and impact</h2>${bookingTable()}</section>` };
    const i = list.find(x => x.id === issueId);
    if (!i) return { title: 'Issue not found', html: `<h1 tabindex="-1">That issue does not exist.</h1><p><a class="ed-link" href="#/tech">Back to the console</a></p>` };
    const cls = fx.fault.classifications, c = cls.find(x => x.id === i.classification), closed = i.status === 'Closed';
    // the one step that can be acted on now; an interrupted verification returns to step 4 with the restriction still on
    const at = closed ? 6 : !i.classification ? 1 : !c.restrict ? 5 : !i.restriction ? 2 : !i.repair ? 3 : !i.verification ? 4 : 5;
    const box = (n, k, title, inner, doneText) => `<section class="stepbox" data-state="${n < at ? 'done' : n === at ? 'now' : 'todo'}" aria-labelledby="st-${n}"><p class="k">Step ${n} · ${k}${n < at ? ' · done' : ''}</p><h2 id="st-${n}">${title}</h2>${n < at ? `<p>${doneText}</p>` : n === at ? inner : '<p class="small">Not yet.</p>'}</section>`;
    const impact = S.previewImpact(state, i.asset);
    return { title: i.id, html: `<p class="ed-kicker">Technician · ${esc(i.id)}</p><h1 tabindex="-1">${id(i.asset)}: <em>${esc(i.status.toLowerCase())}.</em></h1>
     <dl class="kv" style="margin-bottom:24px"><dt>Symptom</dt><dd>${esc(i.symptom)}</dd>${i.detail ? `<dt>Detail</dt><dd>${esc(i.detail)}</dd>` : ''}<dt>Reported by</dt><dd>${esc(i.reporter)}${i.booking ? ` during ${id(i.booking)}` : ''}</dd><dt>Asset now</dt><dd>${availTag(i.asset)} ${occTag(i.asset)}</dd></dl>
     ${box(1, 'Classify', 'What does this fault put at risk?', `<form data-form="triage" data-issue="${i.id}" novalidate><fieldset><legend>Choose the highest consequence that applies</legend>${cls.map((x, n) => `<label class="check"><input type="radio" name="cls" id="cls-${x.id}" value="${x.id}"${n === 1 ? ' checked' : ''}><span>${esc(x.label)}${x.restrict ? ' <span class="small">(restricts the asset)</span>' : ''}</span></label>`).join('')}</fieldset><div class="acts"><button class="pbtn primary" type="submit">Record classification</button></div></form>`, c ? esc(c.label) : '')}
     ${c && !c.restrict ? '' : box(2, 'Restrict', `Restrict ${esc(i.asset)} only`, `<p>Restricting ${id(i.asset)} leaves the rest of the lab bookable. These bookings hold it and will be marked affected: ${impact.length ? impact.map(id).join(', ') : 'none'}.</p><div class="acts"><button class="pbtn primary" type="button" data-act="restrict" data-issue="${i.id}" id="restrict">Apply ${esc(fx.fault.restriction)}</button></div>`, `${id(i.restriction || fx.fault.restriction)} applied to ${id(i.asset)}.`)}
     ${c && !c.restrict ? '' : box(3, 'Repair', 'Record what was done', `<form data-form="repair" data-issue="${i.id}" novalidate><div class="field"><label for="repair">Repair note</label><span class="hint" id="repair-h">Example text is filled in; edit it to match what you did.</span><textarea id="repair" name="repair" rows="3" aria-describedby="repair-h">${esc(i.repair?.text || fx.fault.repairText)}</textarea></div><div class="acts"><button class="pbtn primary" type="submit">Record repair ${esc(fx.fault.repair)}</button></div></form>`, i.repair ? `${id(i.repair.id)}: ${esc(i.repair.text)}` : '')}
     ${c && !c.restrict ? '' : box(4, 'Verify', 'Verify under the reported conditions', `<p>${esc(fx.fault.verificationText.replace(/; no interruption observed \(example\)/, ''))}. Record what happened; a repair that was not verified does not release the asset.</p><div class="acts"><button class="pbtn primary" type="button" data-act="verify" data-issue="${i.id}" data-out="pass" id="verify-pass">No interruption observed</button><button class="pbtn" type="button" data-act="verify" data-issue="${i.id}" data-out="interrupted" id="verify-int">Verification was interrupted</button></div>`, i.verification ? `${id(i.verification.id)}: ${esc(i.verification.text)}` : '')}
     ${box(5, 'Release', closed ? 'Released and closed' : c && !c.restrict ? 'Close without restricting' : 'Lift the restriction', `<p>${c && !c.restrict ? `${id(i.asset)} stays bookable. Closing keeps the report in its history.` : `Lifting ${id(i.restriction)} restores every affected booking.`}</p><div class="acts"><button class="pbtn primary" type="button" data-act="release" data-issue="${i.id}" id="release">${c && !c.restrict ? 'Close issue' : 'Lift restriction and close'}</button></div>`, `${id(i.asset)} is ${esc(S.availability(state, i.asset).label.toLowerCase())}.`)}
     <section class="sec" aria-labelledby="h-bk"><h2 id="h-bk">Bookings and impact</h2>${bookingTable()}</section>
     <section class="sec" aria-labelledby="h-hist"><h2 id="h-hist">History of ${esc(i.id)}</h2><ol class="timeline">${i.history.map(h => `<li><b>${esc(h.time)} · ${esc(h.actor)}</b> ${esc(h.text)}</li>`).join('')}</ol></section>
     <div class="acts"><a class="pbtn" href="#/tech">Back to the console</a></div>` };
  },

  wall() {
    const notices = S.publicNotices(state, fx), stations = fx.resources.filter(r => r.kind === 'Station'), busy = stations.filter(r => S.occupancy(state, fx, r.id).state === 'in-use').length;
    return { title: 'Wall display', html: `<div class="wall"><p class="ed-kicker" style="color:var(--ed-plate-muted)">Wall display · read-only · ${esc(fx.clock.today)}</p><h1 tabindex="-1">Now in the <em>lab.</em></h1>
     <p><span class="n">${stations.length - busy}</span> of ${stations.length} computing stations are free.</p>
     <h2 style="color:var(--ed-plate-text)">Equipment notices</h2>
     ${notices.length ? `<ul>${notices.map(n => `<li>${esc(n.text)}</li>`).join('')}</ul>` : '<p>No equipment notices.</p>'}
     <p class="small">This view never shows names, bookings, results or what a fault is. Example state, not live.</p></div>` };
  },

  record() {
    return { title: 'Record and limits', html: `<p class="ed-kicker">Part 09 · P9-A</p><h1 tabindex="-1">The record, and its <em>limits.</em></h1>
     <section class="sec" aria-labelledby="h-full"><h2 id="h-full">Every change in this session</h2>
     ${state.log.length ? `<div class="scroll" tabindex="0" role="group" aria-label="Session record, scrolls sideways"><table class="led"><thead><tr><th scope="col">#</th><th scope="col">Time</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Reference</th><th scope="col">Reason</th></tr></thead><tbody>${state.log.map(l => `<tr><td>${l.n}</td><td>${esc(l.time)}</td><td>${esc(l.actor)}</td><th scope="row">${esc(l.action)}</th><td>${id(l.ref)}</td><td>${esc(l.reason)}</td></tr>`).join('')}</tbody></table></div><p class="small" style="margin-top:10px">Times are example times that advance three minutes per action.</p>` : '<p>Nothing has happened yet.</p>'}</section>
     <section class="sec" aria-labelledby="h-lim"><h2 id="h-lim">What this demonstrator is not</h2><ul>
      <li>No camera, signal source, booking system or account is connected. Vision evidence is an illustration; signal samples are computed from a formula.</li>
      <li>Records live in this browser’s storage only. “Start again” clears them.</li>
      <li>One student and one technician are modelled. Faculty, mobile and signage remain designed views in Part 07.</li>
      <li>The camera stop, the failed save and the lost acknowledgement are demonstration triggers, labelled where they appear.</li></ul></section>` };
  }
};

function bookingTable() {
  return `<div class="scroll" tabindex="0" role="group" aria-label="Booking list, scrolls sideways"><table class="led"><thead><tr><th scope="col">Booking</th><th scope="col">For</th><th scope="col">When</th><th scope="col">Kit</th><th scope="col">State</th></tr></thead><tbody>${state.bookings.map(b => { const hit = S.bookingImpact(state, b); return `<tr><th scope="row">${id(b.id)}</th><td>${esc(b.who)}</td><td>${esc(b.day)} ${esc(b.slot)}</td><td>${id(b.kit)}</td><td>${hit.affected ? `<span class="tag bad">Affected · ${esc(hit.by.join(', '))}</span>` : `<span class="tag ${b.status === 'Closed' ? 'plain' : 'ok'}">${esc(b.status)}</span>`}</td></tr>`; }).join('')}</tbody></table></div>`;
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
let lastHash = null;
function render({ focus = false } = {}) {
  const r = route(), keep = document.activeElement?.id;
  if (r.redirected) history.replaceState(null, '', `#/${r.args[0]}/prepare`);
  if (r.redirected) say('warn', `<p><strong>${esc(STAGES.find(s => s[0] === r.redirected)[1])} is not available yet.</strong> Earlier steps come first; this is where to start.</p>`);
  const v = views[r.name](...r.args);
  $('#view').innerHTML = (flash ? `<div class="msg ${flash.kind}" id="flash" tabindex="-1" role="${flash.kind === 'bad' ? 'alert' : 'status'}">${flash.html}</div>` : '') + v.html;
  document.title = `${v.title} — PARALLAX prototype`;
  const open = state.issues.filter(i => i.status !== 'Closed').length + S.openFollowUps(state).length, notices = S.publicNotices(state, fx).length;
  $('#roles').innerHTML = [['student', '#/', 'Student', 0], ['tech', '#/tech', 'Technician', open], ['wall', '#/wall', 'Wall display', notices]].map(([k, h, label, n]) => `<a href="${h}"${r.role === k ? ' aria-current="page"' : ''}>${label}${n ? `<span class="n" aria-hidden="true">${n}</span><span class="vh"> (${n} ${k === 'tech' ? 'open item' : 'notice'}${n > 1 ? 's' : ''})</span>` : ''}</a>`).join('');
  $('#log').innerHTML = state.log.length ? state.log.slice(-8).reverse().map(l => `<li${l.n > seen ? ' class="new"' : ''}><b>${esc(l.time)} · ${esc(l.actor)}</b>${esc(l.action)} ${id(l.ref)}<span>${esc(l.reason)}</span></li>`).join('') : '<li class="empty">Nothing yet. Reserve a kit to begin.</li>';
  seen = state.log.length;
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
  if (act === 'reserve') commit(S.reserve(state, fx, exp, t.dataset.slot), { good: `<p><strong>Reserved.</strong> ${id(ex.booking)} holds the whole of ${id(ex.kit)}.</p>` });
  else if (act === 'kit-all') { for (const i of fx.kits[ex.kit].portable) S.verifyKitItem(state, fx, exp, i.id, i.qty); save(); render(); }
  else if (act === 'start') commit(S.startSession(state, fx, exp), { go: `#/${exp}/bench` });
  else if (act === 'capture') commit(S.capture(state, fx, exp, t.dataset.ev, { prepared: !!t.dataset.prepared }), { good: `<p><strong>${id(t.dataset.ev)} recorded</strong> with its settings.</p>` });
  else if (act === 'interrupt') commit(S.interruptCamera(state));
  else if (act === 'submit') { const res = S.submit(state, fx, exp, { dropAck: demo.dropAck }); demo.dropAck = false; if (!res.ok && res.code === 'no-ack') { save(); render({ focus: true }); } else commit(res); }
  else if (act === 'close') commit(S.closeSession(state, fx, exp));
  else if (act === 'close-fu') commit(S.closeSession(state, fx, exp, { withFollowUp: true }));
  else if (act === 'restrict') { const res = S.applyRestriction(state, fx, issue); commit(res, { good: `<p><strong>${id(fx.fault.restriction)} applied.</strong> Affected: ${res.impact?.length ? res.impact.map(id).join(', ') : 'no bookings'}. The equipment list, Lab Map and wall display now show it.</p>` }); }
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
    save(); const inp = $('#station'); inp.setAttribute('aria-invalid', 'true'); $('#station-e').innerHTML = `<span class="tag bad" role="alert">${esc(res.message)}</span>`; inp.focus(); inp.select();
  } else if (kind === 'note') { const res = S.saveNote(state, fx, exp, d.get('note'), { failSave: demo.failSave }); if (res.code === 'save-failed') demo.failSave = false; commit(res, { good: `<p><strong>Saved.</strong></p>` }); }
  else if (kind === 'report') { const res = S.reportIssue(state, fx, { asset: d.get('asset'), symptom: d.get('symptom'), detail: d.get('detail') }); commit(res, { good: `<p><strong>${id(res.issue)} sent.</strong> A technician will classify it. Nothing is restricted until they do.</p>`, go: f.dataset.back }); }
  else if (kind === 'triage') commit(S.triage(state, fx, f.dataset.issue, d.get('cls')));
  else if (kind === 'repair') commit(S.recordRepair(state, fx, f.dataset.issue, d.get('repair')));
});
$('#reset').addEventListener('click', () => {
  if (state.log.length && !confirm('Clear every example record in this browser and start again?')) return;
  state = S.createState(fx); seen = 0; demo.failSave = demo.dropAck = false; save();
  say('good', '<p><strong>Started again.</strong> All example records were cleared.</p>');
  if (location.hash && location.hash !== '#/') location.hash = '#/'; else render({ focus: true });
});
// another tab (or the Lab Map) changed the shared state
addEventListener('storage', e => { if (e.key === S.STORAGE_KEY) { state = load(); render(); } });

save(); render({ focus: false });
