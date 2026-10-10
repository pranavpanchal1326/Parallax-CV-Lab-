// P9-A task-path checks. Each task replays a workflow through the same rules the demonstrator uses (store.js)
// and asserts the outcome the blueprint asks for (W01, W02, W03, G23.15, G26.11, Q02, Q04, Q11).
// These are scripted rule checks, not participant tests. Run: node prototype/validate.cjs
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const here = __dirname, root = path.resolve(here, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

(async () => {
  const S = await import(pathToFileURL(path.join(here, 'store.js')).href);
  const fx = JSON.parse(read('prototype/fixtures.json'));
  const p6 = JSON.parse(read('design/figma-build/phase-06/journey-contracts.json'));
  const p7 = JSON.parse(read('design/figma-build/phase-07/system-contracts.json'));
  const geo = JSON.parse(read('spatial/lab_geometry.json'));
  const map = JSON.parse(read('design/phase-08/data/resources.json'));
  const checks = [];
  const ok = (task, name, pass, detail = '') => checks.push({ task, name, pass: !!pass, detail: pass ? '' : String(detail) });
  const fresh = () => S.createState(fx);
  const prep = (s, exp) => fx.experiments[exp].prepare.forEach((_, i) => S.setPrepared(s, fx, exp, i, true));
  const toBench = (s, exp, slot = '11:00') => { prep(s, exp); S.reserve(s, fx, exp, slot); S.checkIn(s, fx, exp, fx.experiments[exp].station); for (const i of fx.kits[fx.experiments[exp].kit].portable) S.verifyKitItem(s, fx, exp, i.id, i.qty); return S.startSession(s, fx, exp); };
  const note = 'Side light lengthens the shadows and hides part of object 03; this illustration cannot show detector accuracy.';

  // ---- T00 identities continue the earlier phases
  { const v = fx.experiments.E06, g = fx.experiments.E01;
    ok('T00', 'Vision identities match P6-A contracts', v.booking === p6.vision.booking && v.revision === p6.vision.revision && v.request === p6.vision.request && v.receipt === p6.vision.receipt && v.kit === p6.vision.manifest);
    ok('T00', 'Signal identities match P6-A contracts', g.booking === p6.signal.booking && g.revision === p6.signal.revision && g.receipt === p6.signal.receipt && g.source.id === p6.signal.source.id && g.evidence.map(e => e.id).join() === p6.signal.runs.map(r => r.id).join());
    ok('T00', 'Fault identities match P7-A contracts', fx.fault.issue === p7.faultThread.issue && fx.fault.asset === p7.faultThread.asset && p7.faultThread.restriction.startsWith(fx.fault.restriction) && p7.faultThread.repair.startsWith(fx.fault.repair) && p7.faultThread.verification.startsWith(fx.fault.verification));
    const known = new Set([...geo.furniture.map(f => f.id), ...geo.zones.map(z => z.id), ...map.resources.map(r => r.id), 'TRP-04']);
    const stray = fx.resources.filter(r => !known.has(r.id)).map(r => r.id);
    ok('T00', 'Every resource exists in P4-D geometry or the Lab Map data (TRP-04 is a kit item only)', !stray.length, stray.join(', '));
    const kitIds = Object.keys(fx.kits).flatMap(k => S.kitResourceIds(fx, k)), missing = kitIds.filter(id => !fx.resources.some(r => r.id === id));
    ok('T00', 'Every kit item is a known resource', !missing.length, missing.join(', ')); }

  // ---- T01 W01 vision, end to end
  { const s = fresh(); let r;
    ok('T01', 'Reserving before preparation is refused', S.reserve(s, fx, 'E06', '11:00').code === 'not-prepared');
    prep(s, 'E06'); r = S.reserve(s, fx, 'E06', '11:00');
    ok('T01', 'One booking holds every item of KIT-C1-v1', r.ok && S.kitResourceIds(fx, 'KIT-C1-v1').every(id => S.myBooking(s, 'E06').resources.includes(id)));
    ok('T01', 'Starting before check-in is refused', S.startSession(s, fx, 'E06').code === 'not-checked-in');
    S.checkIn(s, fx, 'E06', 'cv2');
    ok('T01', 'Check-in accepts the booked station typed loosely (cv2 → CV-02)', s.sessions.E06.checkedIn && s.sessions.E06.station === 'CV-02');
    ok('T01', 'Check-in marks the kit as in use, separately from availability', S.occupancy(s, fx, 'C1-CAM').state === 'in-use' && S.availability(s, 'C1-CAM').state === 'bookable');
    ok('T01', 'Session cannot start until the kit matches the manifest', S.startSession(s, fx, 'E06').code === 'kit-incomplete');
    for (const i of fx.kits['KIT-C1-v1'].portable) S.verifyKitItem(s, fx, 'E06', i.id, i.qty);
    ok('T01', 'Session starts with a complete kit', S.startSession(s, fx, 'E06').ok);
    S.capture(s, fx, 'E06', 'ILL-L1-v1'); S.capture(s, fx, 'E06', 'ILL-L2-v1');
    ok('T01', 'Evidence keeps its settings and source', s.sessions.E06.captures.length === 2 && s.sessions.E06.captures.every(c => c.settings.exposure === '1/120 s' && c.source === 'C1-CAM'));
    ok('T01', 'Recorded evidence cannot be overwritten', S.capture(s, fx, 'E06', 'ILL-L1-v1').code === 'duplicate' && s.sessions.E06.captures.length === 2);
    r = S.submit(s, fx, 'E06');
    ok('T01', 'Submitting without a saved claim returns to review with the gap named', r.code === 'incomplete' && r.gaps.length === 1 && !s.sessions.E06.receipt, JSON.stringify(r));
    S.saveNote(s, fx, 'E06', note); r = S.submit(s, fx, 'E06');
    ok('T01', 'Submission issues the P6-A receipt', r.ok && r.receipt === 'EX-SUB-2041');
    ok('T01', 'A second submit returns the same receipt', S.submit(s, fx, 'E06').receipt === 'EX-SUB-2041' && s.log.filter(l => l.ref === 'EX-SUB-2041').length === 1);
    for (const i of fx.kits['KIT-C1-v1'].portable) S.returnItem(s, fx, 'E06', i.id, i.qty);
    r = S.closeSession(s, fx, 'E06');
    ok('T01', 'Complete return closes the session and frees every resource', r.ok && !r.followUp && S.kitResourceIds(fx, 'KIT-C1-v1').every(id => S.occupancy(s, fx, id).state === 'free')); }

  // ---- T02 W01 signal, end to end, with the mathematics checked
  { const s = fresh();
    ok('T02', 'Signal session starts with no portable items to count', toBench(s, 'E01').ok);
    S.capture(s, fx, 'E01', 'EX-RUN-20'); S.capture(s, fx, 'E01', 'EX-RUN-03'); S.saveNote(s, fx, 'E01', note);
    ok('T02', 'Signal submission issues its own receipt', S.submit(s, fx, 'E01').receipt === 'EX-SUB-2042');
    ok('T02', 'Signal session closes without a kit return', S.closeSession(s, fx, 'E01').ok);
    const F = fx.experiments.E01.source.frequencyHz; let worst = 0;
    for (const rate of [20, 3]) { const fa = F - Math.round(F / rate) * rate; for (let i = 0; i <= rate; i++) worst = Math.max(worst, Math.abs(Math.sin(2 * Math.PI * F * i / rate) - Math.sin(2 * Math.PI * fa * i / rate))); }
    ok('T02', 'The drawn alias passes through every sample (max error < 1e-9)', worst < 1e-9, worst);
    ok('T02', '3 Hz sampling of 2 Hz aliases to 1 Hz; 20 Hz does not alias', Math.abs(F - Math.round(F / 3) * 3) === 1 && F - Math.round(F / 20) * 20 === F); }

  // ---- T03 booking conflict offers a compatible time
  { const s = fresh(); prep(s, 'E06'); const r = S.reserve(s, fx, 'E06', '10:00');
    ok('T03', 'A taken slot is refused and names the clash', r.code === 'conflict' && /B-2040/.test(r.message), JSON.stringify(r));
    ok('T03', 'The refusal offers the compatible 11:00 slot (P6-A recovery contract)', r.alternative === '11:00');
    ok('T03', 'The conflict does not block the signal kit at the same time', S.slotStatus(s, fx, 'E01', '10:00').state === 'free'); }

  // ---- T04 wrong station
  { const s = fresh(); prep(s, 'E06'); S.reserve(s, fx, 'E06', '11:00');
    const r = S.checkIn(s, fx, 'E06', 'CV-04');
    ok('T04', 'Wrong station is refused, names the expected one, and records no attendance', r.code === 'wrong-station' && r.expected === 'CV-02' && !s.sessions.E06.checkedIn);
    ok('T04', 'An unknown ID gets a format hint rather than a wrong-station message', S.checkIn(s, fx, 'E06', 'desk 9').code === 'unknown' && S.checkIn(s, fx, 'E06', '').code === 'empty'); }

  // ---- T05 W02: fault → restriction → every availability view → repair → verification → release
  { const s = fresh(); toBench(s, 'E06'); S.capture(s, fx, 'E06', 'ILL-L1-v1'); S.interruptCamera(s);
    ok('T05', 'Device failure preserves saved captures and blocks new ones', s.sessions.E06.captures.length === 1 && S.capture(s, fx, 'E06', 'ILL-L2-v1').code === 'camera-offline');
    let r = S.reportIssue(s, fx, { asset: 'C1-CAM', symptom: fx.fault.symptoms[0] });
    ok('T05', 'Report creates ISS-0417 linked to the booking', r.issue === 'ISS-0417' && s.issues[0].booking === 'B-2041');
    ok('T05', 'A report alone restricts nothing', S.availability(s, 'C1-CAM').state === 'bookable' && !S.publicNotices(s, fx).length);
    ok('T05', 'A second report for the same asset is not duplicated', S.reportIssue(s, fx, { asset: 'C1-CAM', symptom: fx.fault.symptoms[0] }).code === 'duplicate' && s.issues.length === 1);
    ok('T05', 'Restriction is refused before classification', S.applyRestriction(s, fx, 'ISS-0417').code === 'not-triaged');
    r = S.triage(s, fx, 'ISS-0417', 'availability');
    ok('T05', 'Triage previews the bookings that hold the asset', r.ok && r.restrict && ['B-2047', 'B-2049'].every(b => r.impact.includes(b)) && !r.impact.includes('B-2048'));
    r = S.applyRestriction(s, fx, 'ISS-0417');
    ok('T05', 'Restriction is scoped to C1-CAM only', Object.entries(s.resources).filter(([, v]) => v.restriction).map(([k]) => k).join() === 'C1-CAM');
    const hit = s.bookings.filter(b => S.bookingImpact(s, b).affected).map(b => b.id);
    ok('T05', 'B-2047 and B-2049 are affected; B-2048 and KIT-S1-v1 are not (P7-A contract)', hit.includes('B-2047') && hit.includes('B-2049') && !hit.includes('B-2048') && S.kitStatus(s, fx, 'KIT-S1-v1').ok, hit.join());
    ok('T05', 'Equipment list, kit, slots and Lab Map data all show the restriction', S.availability(s, 'C1-CAM').label === 'Restricted · RST-0417' && !S.kitStatus(s, fx, 'KIT-C1-v1').ok && fx.slots.every(x => S.slotStatus(s, fx, 'E06', x).state === 'blocked') && S.labMapOverrides(s, fx)['C1-CAM'].availability === map.resources.find(x => x.id === 'C1-CAM').availability);
    const pub = S.publicNotices(s, fx);
    ok('T05', 'Public notice names the equipment but no issue, person, booking or cause', pub.length === 1 && !/ISS|RST|B-\d|Student|feed|cable/i.test(pub[0].text), pub[0]?.text);
    ok('T05', 'The student can finish with a prepared condition, labelled as such', S.capture(s, fx, 'E06', 'ILL-L2-v1', { prepared: true }).ok && /Prepared/.test(s.sessions.E06.captures[1].source) && s.sessions.E06.usedPrepared);
    ok('T05', 'Release is refused before verification', S.release(s, fx, 'ISS-0417').code === 'not-verified' && S.availability(s, 'C1-CAM').state === 'restricted');
    ok('T05', 'Verification is refused before a repair is recorded', S.verify(s, fx, 'ISS-0417', 'pass').code === 'no-repair');
    S.recordRepair(s, fx, 'ISS-0417', fx.fault.repairText);
    r = S.verify(s, fx, 'ISS-0417', 'interrupted');
    ok('T05', 'Interrupted verification keeps the issue open and the restriction on (unknown cause)', !r.ok && /Open/.test(s.issues[0].status) && S.availability(s, 'C1-CAM').state === 'restricted' && S.release(s, fx, 'ISS-0417').code === 'not-verified');
    S.verify(s, fx, 'ISS-0417', 'pass'); r = S.release(s, fx, 'ISS-0417');
    ok('T05', 'Release lifts the restriction and restores B-2047 and B-2049', r.ok && ['B-2047', 'B-2049'].every(b => r.restored.includes(b)) && !s.bookings.some(b => S.bookingImpact(s, b).affected) && S.availability(s, 'C1-CAM').state === 'bookable' && !S.publicNotices(s, fx).length);
    ok('T05', 'Maintenance history records report, classification, restriction, repair, both verifications and release', s.issues[0].history.length === 7, s.issues[0].history.length);
    ok('T05', 'Every log line has actor, time, reference and action', s.log.every(l => l.actor && /^\d\d:\d\d$/.test(l.time) && l.ref && l.action)); }

  // ---- T06 a restricted kit cannot be reserved; the other strand still can
  { const s = fresh(); prep(s, 'E06'); prep(s, 'E01'); S.reportIssue(s, fx, { asset: 'C1-CAM', symptom: fx.fault.symptoms[2], reporter: 'Technician' }); S.triage(s, fx, 'ISS-0417', 'safety'); S.applyRestriction(s, fx, 'ISS-0417');
    const r = S.reserve(s, fx, 'E06', '11:00');
    ok('T06', 'Reserving a kit with a restricted item is refused and names the item', r.code === 'kit-unavailable' && r.blockers.join() === 'C1-CAM');
    ok('T06', 'The signal experiment can still be reserved', S.reserve(s, fx, 'E01', '11:00').ok); }

  // ---- T07 a quality-level fault does not restrict
  { const s = fresh(); S.reportIssue(s, fx, { asset: 'C1-L1', symptom: fx.fault.symptoms[3], detail: 'Diffuser is slightly creased' }); const r = S.triage(s, fx, 'ISS-0417', 'quality');
    ok('T07', 'Quality classification leaves the asset bookable and closes without verification', r.ok && !r.restrict && S.release(s, fx, 'ISS-0417').ok && S.availability(s, 'C1-L1').state === 'bookable'); }

  // ---- T08 save failure and missing acknowledgement
  { const s = fresh(); toBench(s, 'E06'); S.capture(s, fx, 'E06', 'ILL-L1-v1'); S.capture(s, fx, 'E06', 'ILL-L2-v1');
    let r = S.saveNote(s, fx, 'E06', note, { failSave: true });
    ok('T08', 'A failed save keeps the text and does not claim it was saved', r.code === 'save-failed' && s.sessions.E06.note === note && !s.sessions.E06.noteSaved);
    ok('T08', 'An unsaved claim blocks submission', S.submit(s, fx, 'E06').code === 'incomplete');
    S.saveNote(s, fx, 'E06', note); r = S.submit(s, fx, 'E06', { dropAck: true });
    ok('T08', 'A missing acknowledgement is not reported as submitted', r.code === 'no-ack' && !s.sessions.E06.receipt && s.sessions.E06.ackPending);
    r = S.submit(s, fx, 'E06');
    ok('T08', 'Retry uses the same request and yields one receipt', r.ok && r.receipt === 'EX-SUB-2041' && s.log.filter(l => l.ref === 'EX-SUB-2041').length === 1);
    ok('T08', 'A too-short claim is refused with the reason', S.saveNote(fresh(), fx, 'E06', 'ok').code === 'too-short'); }

  // ---- T09 W03 return with a missing accessory
  { const s = fresh(); toBench(s, 'E06');
    for (const i of fx.kits['KIT-C1-v1'].portable) S.returnItem(s, fx, 'E06', i.id, i.id === 'CAL-01' ? 0 : i.qty);
    let r = S.closeSession(s, fx, 'E06');
    ok('T09', 'A short return blocks closing and names CAL-01 0 of 1', r.code === 'return-incomplete' && r.short.length === 1 && r.short[0].id === 'CAL-01' && !s.sessions.E06.closed);
    r = S.closeSession(s, fx, 'E06', { withFollowUp: true });
    ok('T09', 'Closing with a follow-up raises FU-2041 and marks CAL-01 location unknown', r.ok && r.followUp === 'FU-2041' && S.availability(s, 'CAL-01').state === 'unknown');
    ok('T09', 'The missing item blocks the next reservation of the kit', !S.kitStatus(s, fx, 'KIT-C1-v1').ok && S.kitStatus(s, fx, 'KIT-C1-v1').blockers.join() === 'CAL-01');
    const hit = s.bookings.filter(b => S.bookingImpact(s, b).affected).map(b => b.id);
    ok('T09', 'Open bookings that hold CAL-01 are marked affected; the signal booking is not', hit.includes('B-2047') && hit.includes('B-2049') && !hit.includes('B-2048') && !hit.includes('B-2041'), hit.join());
    r = S.locateItem(s, fx, 'E06');
    ok('T09', 'Locating the item closes FU-2041 and restores the kit and its bookings', r.ok && r.located.join() === 'CAL-01' && S.kitStatus(s, fx, 'KIT-C1-v1').ok && !s.bookings.some(b => S.bookingImpact(s, b).affected) && !S.openFollowUps(s).length); }

  // ---- T10 state survives a reload (JSON round trip) and the files exist
  { const s = fresh(); toBench(s, 'E06'); const t = JSON.parse(JSON.stringify(s));
    ok('T10', 'State is plain data: a storage round trip changes nothing', JSON.stringify(t) === JSON.stringify(s) && S.capture(t, fx, 'E06', 'ILL-L1-v1').ok);
    for (const f of ['index.html', 'app.js', 'store.js', 'proto.css', 'fixtures.json']) ok('T10', 'Prototype file present: ' + f, fs.existsSync(path.join(here, f)));
    const html = read('prototype/index.html');
    ok('T10', 'Page declares a language, a skip link, a main landmark and a live region', /<html lang="en">/.test(html) && /ed-skip/.test(html) && /<main id="view"/.test(html) && /aria-live="polite"/.test(html)); }

  const passed = checks.filter(c => c.pass).length;
  for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.task} ${c.name}${c.pass ? '' : ' — ' + c.detail}`);
  console.log(`${passed} / ${checks.length} pass`);
  fs.writeFileSync(path.join(here, 'validation.json'), JSON.stringify({ date: '2026-10-03', kind: 'Scripted rule checks; not participant tests', passed, total: checks.length, checks }, null, 2));
  process.exit(passed === checks.length ? 0 : 1);
})();
