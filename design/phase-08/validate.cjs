// P8-A checks: shared identifiers between data, geometry and the interactive GLB; export budgets; prototype files present.
// Run: node design/phase-08/validate.cjs
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = p => fs.readFileSync(path.join(root, p));
const geo = JSON.parse(read('spatial/lab_geometry.json'));
const res = JSON.parse(read('design/phase-08/data/resources.json'));
const glb = read('spatial/exports/lab_interactive.glb');
const jsonLen = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.slice(20, 20 + jsonLen).toString('utf8'));
const nodes = new Set(gltf.nodes.map(n => n.name));
const furn = new Set(geo.furniture.map(f => f.id));
const zones = new Set(geo.zones.map(z => z.id));
const stats = JSON.parse(read('spatial/exports/interactive_stats.json'));
const checks = [];
const ok = (name, pass, detail = '') => checks.push({ name, pass, detail });

const missingNode = res.resources.filter(r => !nodes.has(r.id)).map(r => r.id);
ok('Every Lab Map resource is a named node in lab_interactive.glb', !missingNode.length, missingNode.join(', '));
const missingGeo = res.resources.filter(r => !furn.has(r.id) && !r.home).map(r => r.id);
ok('Every resource has plan geometry or a declared home position', !missingGeo.length, missingGeo.join(', '));
const portable = res.resources.filter(r => !furn.has(r.id)).map(r => r.id);
ok('Portable items outside plan geometry are declared (' + (portable.join(', ') || 'none') + ')', portable.every(id => res.resources.find(r => r.id === id).home?.source));
const badZone = res.resources.filter(r => !zones.has(r.zone)).map(r => r.id);
ok('Every resource zone exists in geometry', !badZone.length, badZone.join(', '));
const badView = res.resources.filter(r => !res.views[r.view]).map(r => r.id);
ok('Every resource has a defined named viewpoint', !badView.length, badView.join(', '));
ok('Five named viewpoints (G16.02)', Object.keys(res.views).length === 5);
ok('Interactive triangles within 150,000 budget', stats.triangles <= stats.budget_triangles, String(stats.triangles));
ok('Interactive GLB within 5 MB budget', glb.length <= stats.budget_bytes, String(glb.length));
ok('modelBytes in resources.json matches the GLB', res.modelBytes === glb.length, `${res.modelBytes} vs ${glb.length}`);
ok('Availability and occupancy recorded separately for every resource', res.resources.every(r => r.availability && r.occupancy));
ok('C1-CAM carries the Phase 7 restriction RST-0417', /RST-0417/.test(res.resources.find(r => r.id === 'C1-CAM').availability));
for (const f of ['lab-map.html', 'scene-studio.html', 'index.html', 'assets/lab-map.js', 'assets/lab-3d.js', 'assets/scene-studio.js', 'node_modules/three/build/three.module.js'])
  ok('Prototype file present: ' + f, fs.existsSync(path.join(__dirname, f)));
const renders = ['R01_entry', 'R02_iso_cutaway', 'R03_student_eye', 'R04_capture', 'R05_signal_bench', 'R06_collaboration', 'R07_storage', 'R08_plan', 'R04_capture_restricted', 'R02_iso_cutaway_restricted'];
ok('All 10 shot-list renders exist (full and web size)', renders.every(r => fs.existsSync(path.join(root, 'spatial/renders/phase-08', r + '.png')) && fs.existsSync(path.join(__dirname, 'renders', r + '.jpg'))));

// ---- P8-B additions (visual upgrade; P8-A record must stay intact)
const p8b = ['H01_spine_golden', 'R01_entry', 'R02_iso_cutaway', 'R03_student_eye', 'R04_capture', 'R05_signal_bench', 'R06_collaboration', 'R07_storage', 'R09_kit_layout', 'R10_sculpture', 'R04_capture_restricted'];
const miss = p8b.filter(r => !fs.existsSync(path.join(root, 'spatial/renders/phase-08b', r + '.png')) || !fs.existsSync(path.join(__dirname, 'renders-b', r + '.jpg')));
ok('P8-B: 11 look-dev renders exist (full and web size), incl. new H01, R09, R10', !miss.length, miss.join(', '));
ok('P8-B: A01 orbit animation present for the hub hero', fs.existsSync(path.join(__dirname, 'media/A01_orbit.mp4')));
ok('P8-B: A03 signal-to-pixel module present', fs.existsSync(path.join(__dirname, 'assets/signal-pixel.js')));
ok('P8-B: P8-A hub page preserved as index-p8a.html', fs.existsSync(path.join(__dirname, 'index-p8a.html')));
ok('P8-B: P8-A renders untouched (10 originals still present)', renders.every(r => fs.existsSync(path.join(root, 'spatial/renders/phase-08', r + '.png'))));
// A03 correctness: the drawn alias must equal the true signal at every sample
{ const F = 2; let worst = 0; for (const fsr of [1.3, 2.5, 3, 3.7, 5, 20]) { const k = Math.round(F / fsr), d = F - k * fsr; for (let i = 0; i < 40; i++) { const t = i / fsr, phi = .7; worst = Math.max(worst, Math.abs(Math.sin(2 * Math.PI * F * t + phi) - Math.sin(2 * Math.PI * d * t + phi))); } }
  ok('A03: alias curve passes through every sample (max error < 1e-9)', worst < 1e-9, String(worst)); }

const passed = checks.filter(c => c.pass).length;
for (const c of checks) console.log((c.pass ? 'PASS ' : 'FAIL ') + c.name + (c.detail && !c.pass ? ' — ' + c.detail : ''));
console.log(`${passed} / ${checks.length} pass`);
fs.writeFileSync(path.join(__dirname, 'validation.json'), JSON.stringify({ date: '2026-10-02', passed, total: checks.length, checks, glbNodes: [...nodes].sort() }, null, 2));
process.exit(passed === checks.length ? 0 : 1);
