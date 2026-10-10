// PARALLAX P9-A demonstrator: one fixture state, changed only through these actions (G23.15).
// Pure functions over a plain object so the same rules run in the browser and in validate.cjs.
// Every mutation appends to state.log with actor, example time, reference and reason.

export const STORAGE_KEY = 'parallax-proto-state';

const pad = n => String(n).padStart(2, '0');
const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const fromMin = m => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
const fail = (code, message, extra = {}) => ({ ok: false, code, message, ...extra });
const done = (extra = {}) => ({ ok: true, ...extra });

export function createState(fx) {
  const session = () => ({ checkedIn: false, station: null, kit: {}, started: false, interrupted: false, usedPrepared: false, captures: [], note: '', noteSaved: null, ackPending: false, receipt: null, returned: {}, closed: false, followUp: null });
  return {
    revision: fx.revision,
    minute: toMin(fx.clock.start),
    prepared: Object.fromEntries(Object.entries(fx.experiments).map(([k, e]) => [k, e.prepare.map(() => false)])),
    resources: Object.fromEntries(fx.resources.map(r => [r.id, { restriction: null, located: true }])),
    bookings: fx.bookings.map(b => ({ ...b })),
    sessions: Object.fromEntries(Object.keys(fx.experiments).map(k => [k, session()])),
    issues: [],
    log: []
  };
}

function record(s, actor, action, ref, reason = '') {
  s.minute += 3;
  s.log.push({ n: s.log.length + 1, time: fromMin(s.minute), actor, action, ref, reason });
}

// ---------- derived facts (never stored twice) ----------
export const kitResourceIds = (fx, kitId) => { const k = fx.kits[kitId]; return [...k.fixed.map(i => i.id), ...k.portable.flatMap(i => i.members || [i.id])]; };
export const myBooking = (s, exp) => s.bookings.find(b => b.mine && b.exp === exp) || null;

export function availability(s, id) {
  const r = s.resources[id];
  if (r.restriction) return { state: 'restricted', label: `Restricted · ${r.restriction}` };
  if (!r.located) return { state: 'unknown', label: 'Location unknown' };
  return { state: 'bookable', label: 'Bookable' };
}
export function occupancy(s, fx, id) {
  for (const [exp, ses] of Object.entries(s.sessions)) {
    const b = myBooking(s, exp);
    if (b && ses.checkedIn && !ses.closed && b.resources.includes(id)) return { state: 'in-use', label: `In use · ${b.id}` };
  }
  return { state: 'free', label: 'Free' };
}
export function kitStatus(s, fx, kitId) {
  const blockers = kitResourceIds(fx, kitId).filter(id => availability(s, id).state !== 'bookable');
  return { ok: !blockers.length, blockers };
}
export function slotStatus(s, fx, exp, slot) {
  const e = fx.experiments[exp], ids = kitResourceIds(fx, e.kit);
  const kit = kitStatus(s, fx, e.kit);
  if (!kit.ok) return { state: 'blocked', reason: `${kit.blockers.join(', ')} unavailable`, blockers: kit.blockers };
  const clash = s.bookings.find(b => b.day === 'Thu 1 Oct' && b.slot === slot && b.status !== 'Closed' && b.resources.some(id => ids.includes(id)));
  if (clash) return { state: 'taken', reason: `${clash.id} already holds ${clash.resources.filter(id => ids.includes(id)).slice(0, 2).join(', ')}`, clash: clash.id };
  return { state: 'free', reason: 'Every item in the kit is free' };
}
// A booking is affected while any resource it holds is restricted or cannot be located (W02 and W03 acceptance).
export function bookingImpact(s, b) {
  const hit = b.resources.filter(id => s.resources[id]?.restriction || s.resources[id]?.located === false);
  return { affected: hit.length > 0 && b.status !== 'Closed', by: hit };
}
export const previewImpact = (s, asset) => s.bookings.filter(b => b.status !== 'Closed' && b.resources.includes(asset)).map(b => b.id);
export const openIssue = s => s.issues.find(i => i.status !== 'Closed') || null;
export function evidenceGaps(s, fx, exp) {
  const e = fx.experiments[exp], ses = s.sessions[exp], gaps = [];
  for (const ev of e.evidence) if (!ses.captures.some(c => c.id === ev.id)) gaps.push(`${ev.label} (${ev.id}) is not recorded`);
  if (!ses.noteSaved) gaps.push('The notebook claim has not been saved');
  else if (ses.noteSaved !== ses.note) gaps.push('The notebook has changes that are not saved');
  return gaps;
}

// ---------- student actions ----------
export function setPrepared(s, fx, exp, i, on) { s.prepared[exp][i] = !!on; return done(); }

export function reserve(s, fx, exp, slot) {
  const e = fx.experiments[exp];
  if (myBooking(s, exp)) return fail('exists', `You already hold ${e.booking}.`);
  if (!s.prepared[exp].every(Boolean)) return fail('not-prepared', 'Finish the preparation checklist before reserving.');
  const st = slotStatus(s, fx, exp, slot);
  if (st.state === 'blocked') return fail('kit-unavailable', `${e.kit} cannot be reserved: ${st.reason}.`, { blockers: st.blockers });
  if (st.state === 'taken') {
    const alt = fx.slots.find(x => slotStatus(s, fx, exp, x).state === 'free');
    return fail('conflict', `${slot} is not free: ${st.reason}.`, { alternative: alt || null });
  }
  s.bookings.push({ id: e.booking, mine: true, exp, who: 'You', day: 'Thu 1 Oct', slot, kit: e.kit, resources: kitResourceIds(fx, e.kit), status: 'Confirmed', label: 'Your booking' });
  record(s, 'Student', 'Reserved complete kit', e.booking, `${e.kit} · ${slot}`);
  return done({ booking: e.booking });
}

export function checkIn(s, fx, exp, typed) {
  const e = fx.experiments[exp], b = myBooking(s, exp), ses = s.sessions[exp];
  if (!b) return fail('no-booking', 'There is no booking to check in to.');
  const id = String(typed || '').trim().toUpperCase().replace(/\s+/g, '').replace(/^CV(\d)/, 'CV-$1').replace(/^CV-(\d)$/, 'CV-0$1');
  if (!id) return fail('empty', 'Enter the station ID printed on the desk label, for example CV-02.');
  if (!s.resources[id]) return fail('unknown', `“${typed}” is not a station in this lab. Station labels look like CV-02.`);
  if (id !== e.station) return fail('wrong-station', `${id} is not the station for ${b.id}. Your booking is for ${e.station}.`, { expected: e.station });
  ses.checkedIn = true; ses.station = id;
  record(s, 'Student', 'Checked in at station', b.id, id);
  return done();
}

export function verifyKitItem(s, fx, exp, itemId, qty) {
  const item = fx.kits[fx.experiments[exp].kit].portable.find(i => i.id === itemId);
  if (!item) return fail('unknown-item', 'That item is not in this kit.');
  s.sessions[exp].kit[itemId] = Math.max(0, Math.min(item.qty, Number(qty) || 0));
  return done();
}
export function kitShortfall(s, fx, exp, field = 'kit') {
  const ses = s.sessions[exp];
  return fx.kits[fx.experiments[exp].kit].portable.filter(i => (ses[field][i.id] ?? 0) < i.qty).map(i => ({ id: i.id, have: ses[field][i.id] ?? 0, need: i.qty }));
}
export function startSession(s, fx, exp) {
  const ses = s.sessions[exp], b = myBooking(s, exp);
  if (!ses.checkedIn) return fail('not-checked-in', 'Check in at the station first.');
  const short = kitShortfall(s, fx, exp);
  if (short.length) return fail('kit-incomplete', `Kit is incomplete: ${short.map(x => `${x.id} ${x.have} of ${x.need}`).join(', ')}.`, { short });
  const hit = bookingImpact(s, b);
  if (hit.affected) return fail('restricted', `${hit.by.join(', ')} is restricted, so capture cannot start.`);
  if (!ses.started) { ses.started = true; record(s, 'Student', 'Started session', fx.experiments[exp].session, 'Kit verified against manifest'); }
  return done();
}

export function capture(s, fx, exp, evidenceId, { prepared = false } = {}) {
  const e = fx.experiments[exp], ses = s.sessions[exp];
  if (!ses.started) return fail('not-started', 'Start the session before recording evidence.');
  const ev = e.evidence.find(x => x.id === evidenceId);
  if (!ev) return fail('unknown-evidence', 'That evidence item is not part of this method.');
  if (ses.captures.some(c => c.id === evidenceId)) return fail('duplicate', `${evidenceId} is already recorded. Original evidence is never overwritten.`);
  if (exp === 'E06' && !prepared) {
    if (ses.interrupted) return fail('camera-offline', 'The camera feed has stopped. Evidence already recorded is safe.');
    if (s.resources['C1-CAM'].restriction) return fail('restricted', 'C1-CAM is restricted, so a new capture cannot be made.');
  }
  ses.captures.push({ id: evidenceId, label: ev.label, time: fromMin(s.minute + 3), settings: e.settings || { sampleRate: `${ev.rateHz} Hz`, source: e.source.id }, source: prepared ? 'Prepared condition (camera unavailable)' : exp === 'E06' ? 'C1-CAM' : e.source.id });
  if (prepared) ses.usedPrepared = true;
  record(s, 'Student', 'Recorded evidence', evidenceId, prepared ? 'Prepared condition used after the camera stopped' : 'Settings stored with the evidence');
  return done();
}

// Demonstration trigger for the W01 device-failure exception. Recorded evidence is untouched.
export function interruptCamera(s) {
  const ses = s.sessions.E06;
  if (!ses.started) return fail('not-started', 'The camera is only in use during a started session.');
  ses.interrupted = true;
  record(s, 'System', 'Camera feed stopped', 'C1-CAM', 'Demonstration trigger; no device is connected');
  return done();
}

export function reportIssue(s, fx, { asset, symptom, detail = '', reporter = 'Student' }) {
  if (!s.resources[asset]) return fail('unknown-asset', 'Choose the asset the problem is on.');
  if (!symptom) return fail('no-symptom', 'Choose the symptom that best matches what you saw.');
  const open = s.issues.find(i => i.asset === asset && i.status !== 'Closed');
  if (open) return fail('duplicate', `${open.id} is already open for ${asset}. Your report was not duplicated.`, { issue: open.id });
  const b = myBooking(s, 'E06');
  const issue = { id: fx.fault.issue, asset, symptom, detail: detail.trim(), reporter, booking: b && s.sessions.E06.checkedIn ? b.id : null, status: 'Reported', classification: null, restriction: null, repair: null, verification: null, history: [] };
  s.issues.push(issue);
  record(s, reporter, 'Reported a problem', issue.id, `${asset}: ${symptom}`);
  issue.history.push({ time: fromMin(s.minute), actor: reporter, text: 'Reported' });
  return done({ issue: issue.id });
}

export function saveNote(s, fx, exp, text, { failSave = false } = {}) {
  const ses = s.sessions[exp];
  ses.note = String(text);
  if (ses.note.trim().length < 40) return fail('too-short', 'Write at least a sentence or two (40 characters) so the claim can be reviewed.');
  if (failSave) return fail('save-failed', 'The note could not be saved. Your text is still here; nothing was lost.');
  ses.noteSaved = ses.note;
  record(s, 'Student', 'Saved notebook claim', fx.experiments[exp].revision, `${ses.note.trim().length} characters`);
  return done();
}

// One request identity per submission: a retry after a missing acknowledgement returns the same receipt.
export function submit(s, fx, exp, { dropAck = false } = {}) {
  const e = fx.experiments[exp], ses = s.sessions[exp];
  if (ses.receipt) return done({ receipt: ses.receipt, repeated: true });
  const gaps = evidenceGaps(s, fx, exp);
  if (gaps.length) return fail('incomplete', 'This revision is not ready to submit.', { gaps });
  if (dropAck && !ses.ackPending) {
    ses.ackPending = true;
    record(s, 'System', 'Submission not acknowledged', e.request, 'Demonstration trigger; submission is not claimed');
    return fail('no-ack', `No acknowledgement was received for ${e.request}. The revision is not confirmed as submitted.`);
  }
  ses.ackPending = false; ses.receipt = e.receipt;
  record(s, 'Student', 'Submitted frozen revision', e.receipt, `${e.revision} under ${e.request}`);
  return done({ receipt: e.receipt });
}

export function returnItem(s, fx, exp, itemId, qty) {
  const item = fx.kits[fx.experiments[exp].kit].portable.find(i => i.id === itemId);
  if (!item) return fail('unknown-item', 'That item is not in this kit.');
  s.sessions[exp].returned[itemId] = Math.max(0, Math.min(item.qty, Number(qty) || 0));
  return done();
}
export function closeSession(s, fx, exp, { withFollowUp = false } = {}) {
  const ses = s.sessions[exp], b = myBooking(s, exp);
  if (!b || !ses.checkedIn) return fail('no-session', 'There is no session to close.');
  if (ses.closed) return done({ repeated: true });
  const short = kitShortfall(s, fx, exp, 'returned');
  if (short.length && !withFollowUp) return fail('return-incomplete', `Not everything is back: ${short.map(x => `${x.id} ${x.have} of ${x.need}`).join(', ')}.`, { short });
  if (short.length) {
    ses.followUp = fx.returnFollowUp.followUp;
    for (const x of short) for (const id of (fx.kits[b.kit].portable.find(i => i.id === x.id).members || [x.id])) s.resources[id].located = false;
    record(s, 'Student', 'Closed session with a return exception', fx.returnFollowUp.exception, `${short.map(x => x.id).join(', ')} not located; ${ses.followUp} raised for the technician`);
  } else record(s, 'Student', 'Returned complete kit and closed session', b.id, 'All quantities match the manifest');
  ses.closed = true; b.status = 'Closed';
  return done({ followUp: ses.followUp });
}

// ---------- technician actions (W02) ----------
const issueById = (s, id) => s.issues.find(i => i.id === id);
function step(s, i, actor, text) { i.history.push({ time: fromMin(s.minute), actor, text }); }

export function triage(s, fx, issueId, classId) {
  const i = issueById(s, issueId); if (!i) return fail('no-issue', 'That issue does not exist.');
  const c = fx.fault.classifications.find(x => x.id === classId);
  if (!c) return fail('no-class', 'Choose what the fault puts at risk before continuing.');
  i.classification = c.id; if (i.status === 'Reported') i.status = 'Triaged';
  record(s, 'Technician', 'Classified issue', i.id, c.label); step(s, i, 'Technician', `Classified: ${c.label}`);
  return done({ restrict: c.restrict, impact: previewImpact(s, i.asset) });
}
export function applyRestriction(s, fx, issueId) {
  const i = issueById(s, issueId); if (!i) return fail('no-issue', 'That issue does not exist.');
  if (!i.classification) return fail('not-triaged', 'Classify the issue before restricting the asset.');
  if (i.restriction) return done({ repeated: true });
  i.restriction = fx.fault.restriction; i.status = 'Restricted';
  s.resources[i.asset].restriction = i.restriction;
  const impact = s.bookings.filter(b => bookingImpact(s, b).affected).map(b => b.id);
  record(s, 'Technician', 'Restricted asset', i.restriction, `${i.asset} only; affects ${impact.join(', ') || 'no bookings'}`);
  step(s, i, 'Technician', `${i.restriction} applied to ${i.asset}`);
  return done({ impact });
}
export function recordRepair(s, fx, issueId, text) {
  const i = issueById(s, issueId); if (!i) return fail('no-issue', 'That issue does not exist.');
  if (!String(text || '').trim()) return fail('no-text', 'Describe what was done so the next person can rely on it.');
  i.repair = { id: fx.fault.repair, text: String(text).trim() }; i.status = 'Repaired, not verified';
  record(s, 'Technician', 'Recorded repair', i.repair.id, i.repair.text); step(s, i, 'Technician', `Repair ${i.repair.id}: ${i.repair.text}`);
  return done();
}
export function verify(s, fx, issueId, outcome) {
  const i = issueById(s, issueId); if (!i) return fail('no-issue', 'That issue does not exist.');
  if (!i.repair) return fail('no-repair', 'Record the repair before verifying it.');
  if (outcome === 'pass') {
    i.verification = { id: fx.fault.verification, text: fx.fault.verificationText }; i.status = 'Verified';
    record(s, 'Technician', 'Verified under report conditions', i.verification.id, i.verification.text); step(s, i, 'Technician', `Verified ${i.verification.id}`);
    return done();
  }
  i.verification = null; i.status = 'Open: verification interrupted';
  record(s, 'Technician', 'Verification interrupted', i.id, 'Cause not confirmed; issue and restriction stay'); step(s, i, 'Technician', 'Verification interrupted; issue stays open');
  return fail('interrupted', 'Verification was interrupted. The issue stays open and the restriction stays in place.');
}
export function release(s, fx, issueId) {
  const i = issueById(s, issueId); if (!i) return fail('no-issue', 'That issue does not exist.');
  if (i.status === 'Closed') return done({ repeated: true });
  if (i.restriction && !i.verification) return fail('not-verified', 'A restricted asset can only be released after a recorded verification.');
  const restored = s.bookings.filter(b => b.status !== 'Closed' && bookingImpact(s, b).by.includes(i.asset)).map(b => b.id);
  if (i.restriction) s.resources[i.asset].restriction = null;
  i.status = 'Closed';
  if (s.sessions.E06.interrupted) s.sessions.E06.interrupted = false;
  record(s, 'Technician', i.restriction ? 'Lifted restriction and closed issue' : 'Closed issue', i.restriction || i.id, restored.length ? `Restored ${restored.join(', ')}` : 'No bookings were affected');
  step(s, i, 'Technician', i.restriction ? `${i.restriction} lifted; ${restored.join(', ') || 'no bookings'} restored` : 'Closed without restriction');
  return done({ restored });
}

// The technician finds an item that was missing at kit return; bookings that hold it recover.
export function locateItem(s, fx, exp) {
  const ses = s.sessions[exp];
  if (!ses.followUp || ses.followUpClosed) return fail('no-follow-up', 'There is no open follow-up for this session.');
  const ids = Object.keys(s.resources).filter(id => !s.resources[id].located);
  for (const id of ids) s.resources[id].located = true;
  ses.followUpClosed = true;
  record(s, 'Technician', 'Located missing item and closed follow-up', ses.followUp, `${ids.join(', ')} back in STO-1`);
  return done({ located: ids });
}
export const openFollowUps = s => Object.entries(s.sessions).filter(([, v]) => v.followUp && !v.followUpClosed).map(([exp, v]) => ({ exp, id: v.followUp }));

// ---------- what each audience may see (P7 visibility matrix) ----------
export function publicNotices(s, fx) {
  return s.issues.filter(i => i.restriction && i.status !== 'Closed').map(i => ({ asset: i.asset, text: `${fx.resources.find(r => r.id === i.asset).name} is being checked and cannot be booked for now.` }));
}

// Shape the Lab Map expects; lets design/phase-08/lab-map.html show this session's state.
export function labMapOverrides(s, fx) {
  const out = {};
  for (const r of fx.resources) out[r.id] = { availability: availability(s, r.id).label, occupancy: occupancy(s, fx, r.id).label };
  return out;
}
