// PARALLAX P8-A Scene Studio (P13 / E12). Simulation of camera geometry in the C1 capture zone.
// World axes match the lab model export: x east, y up, z = plan y (south). Units: metres.
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let G = null;
try { G = await fetch('/spatial/lab_geometry.json').then(r => r.json()); } catch { /* constants below match P4-D */ }
const tb = G?.furniture.find(f => f.id === 'C1-TB') ?? { x: 9.25, y: 1.4, w: .6, d: 1, h: .75 };
const STAGE = { x: tb.x + tb.w / 2 + .0, z: tb.y + tb.d / 2, top: tb.h };   // 9.55, 1.9, 0.75
const C1 = { x0: 7.2, x1: 10, z0: 0, z1: 3.9 };
const OBJECTS = [
  { id: '01', name: 'BOX', kind: 'box', size: [.22, .22, .22], pos: [9.42, STAGE.top + .11, 1.62], color: '#C9CED8' },
  { id: '02', name: 'CYLINDER', kind: 'cyl', size: [.14, .26, .14], pos: [9.48, STAGE.top + .13, 2.0], color: '#9BA3B1' },
  { id: '03', name: 'EXPECTED OBJECT', kind: 'box', size: [.12, .12, .12], pos: [9.78, STAGE.top + .06, 2.22], color: '#59616E' },
];
const DEFAULT = { dist: 2.05, lateral: 0, height: 1.57, yaw: 0, tilt: -19, fov: 40 };
const PRESETS = [
  { key: 'frontal', label: 'Frontal · C1 tripod', note: '2.05 m on the capture axis, as built in P4-D', p: { ...DEFAULT } },
  { key: 'occlusion', label: 'Occlusion example', note: 'Low and to the north: the cylinder hides the expected object', p: { dist: 1.65, lateral: -1.06, height: .95, yaw: 33, tilt: -2, fov: 40 } },
  { key: 'side', label: 'Side 45°', note: 'Same objects from the south-west', p: { dist: 1.15, lateral: 1.15, height: 1.4, yaw: -45, tilt: -19, fov: 40 } },
  { key: 'wide', label: 'Wide field 90°', note: 'More context, fewer pixels per object', p: { ...DEFAULT, fov: 90 } },
  { key: 'tele', label: 'Narrow field 18°', note: 'Objects fill the frame; edges get cut', p: { ...DEFAULT, fov: 18 } },
  { key: 'invalid', label: 'Behind the partition', note: 'An impossible position, explained', p: { ...DEFAULT, dist: 2.45 } },
];
const CONTROLS = [
  { key: 'dist', label: 'Distance along C1 axis', min: .3, max: 2.5, step: .05, unit: 'm', hint: 'From the stage centre toward the partition. The built tripod sits at 2.05 m.' },
  { key: 'lateral', label: 'Sideways offset', min: -1.2, max: 1.2, step: .05, unit: 'm', hint: 'Negative moves north, positive moves south.' },
  { key: 'height', label: 'Camera height', min: .5, max: 2.2, step: .05, unit: 'm', hint: 'Lens centre above the floor. Stage top is 0.75 m.' },
  { key: 'yaw', label: 'Pan', min: -60, max: 60, step: 1, unit: '°', hint: 'Positive turns south.' },
  { key: 'tilt', label: 'Tilt', min: -45, max: 20, step: 1, unit: '°', hint: 'Negative looks down.' },
  { key: 'fov', label: 'Horizontal field of view', min: 15, max: 100, step: 1, unit: '°', hint: 'Wider shows more of the zone; each object covers fewer pixels.' },
];
const PNAME = { dist: 'distance', lateral: 'sideways offset', height: 'camera height', yaw: 'pan', tilt: 'tilt', fov: 'field of view' };

let P = { ...DEFAULT };
const q = new URLSearchParams(location.search);
P = { ...DEFAULT, fov: [18, 40, 90].includes(Number(q.get('fov'))) ? Number(q.get('fov')) : 40 };
let lastChanged = null, prevResult = null, activePreset = q.get('preset') || 'frontal';
function clamp(v, c) { return Math.min(c.max, Math.max(c.min, isFinite(v) ? v : DEFAULT[c.key])); }
const rad = d => d * Math.PI / 180;

function camPos(p = P) { return [STAGE.x - p.dist, p.height, STAGE.z + p.lateral]; }
function camDir(p = P) { const y = rad(p.yaw), t = rad(p.tilt); return [Math.cos(y) * Math.cos(t), Math.sin(t), Math.sin(y) * Math.cos(t)]; }
function validate(p = P) {
  const [x, h, z] = camPos(p);
  if (x < C1.x0 + .02) return `The camera would be at x ${x.toFixed(2)} m — behind the C1 partition (x 7.20 m). It cannot be placed there in the lab. Reduce the distance to 2.30 m or less.`;
  if (x > tb.x - .05 && z > tb.y - .05 && z < tb.y + tb.d + .05 && h < tb.h + .05) return 'The camera would be inside the object stage. Raise it above 0.80 m or move it back.';
  return null;
}

// ---------- controls ----------
function buildControls() {
  const list = $('#ctl-list');
  for (const c of CONTROLS) {
    const d = document.createElement('div'); d.className = 'ctl';
    d.innerHTML = `<label for="r-${c.key}"><span>${c.label}</span><span class="muted small">${c.unit}</span></label>
      <div class="row"><input type="range" id="r-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" aria-describedby="h-${c.key}">
      <input type="number" id="n-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" aria-label="${c.label} in ${c.unit === 'm' ? 'metres' : 'degrees'}"></div>
      <small id="h-${c.key}">${c.hint}</small>`;
    list.append(d);
    const set = v => { P[c.key] = clamp(+v, c); lastChanged = c.key; activePreset = null; sync(); update(); };
    d.querySelector('input[type=range]').addEventListener('input', e => set(e.target.value));
    d.querySelector('input[type=number]').addEventListener('change', e => set(e.target.value));
  }
  const pl = $('#preset-list');
  for (const pr of PRESETS) {
    const b = document.createElement('button'); b.className = 'btn'; b.dataset.key = pr.key;
    b.innerHTML = `<span>${pr.label}</span><small>${pr.note}</small>`;
    b.onclick = () => { P = { ...pr.p }; lastChanged = 'preset'; activePreset = pr.key; sync(); update(); };
    pl.append(b);
  }
}
function sync() {
  for (const c of CONTROLS) { $('#r-' + c.key).value = P[c.key]; $('#n-' + c.key).value = +P[c.key].toFixed(c.step < 1 ? 2 : 0); }
  for (const b of document.querySelectorAll('#preset-list .btn')) b.setAttribute('aria-pressed', b.dataset.key === activePreset);
}

// ---------- 2D plan (always present; the full fallback when WebGL is unavailable) ----------
function drawPlan(result) {
  const s = 100, ox = 7.0, oz = -.1, W = 3.2 * s, H = 4.1 * s;
  const X = x => (x - ox) * s, Z = z => (z - oz) * s;
  const [cx, , cz] = camPos(), y = rad(P.yaw), hf = rad(P.fov / 2), L = 3.4;
  const vis = id => result?.objects.find(o => o.id === id);
  let o = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Top view of C1: camera at ${(P.dist).toFixed(2)} m from the stage, ${P.lateral.toFixed(2)} m sideways, field of view ${P.fov} degrees." style="width:100%;display:block">
  <rect x="${X(C1.x0)}" y="${Z(C1.z0)}" width="${(C1.x1 - C1.x0) * s}" height="${(C1.z1 - C1.z0) * s}" fill="#2A323D"/>
  <rect x="${X(7.15)}" y="${Z(0)}" width="5" height="${3.9 * s}" fill="#20232B"/>
  <rect x="${X(9.85)}" y="${Z(.6)}" width="${.15 * s}" height="${2.6 * s}" fill="#151922"/>
  <rect x="${X(tb.x)}" y="${Z(tb.y)}" width="${tb.w * s}" height="${tb.d * s}" fill="#F4F6FB" opacity=".9"/>
  <path d="M${X(cx)} ${Z(cz)} L${X(cx + L * Math.cos(y - hf))} ${Z(cz + L * Math.sin(y - hf))} L${X(cx + L * Math.cos(y + hf))} ${Z(cz + L * Math.sin(y + hf))}Z" fill="#6EE7C5" opacity=".14" stroke="#6EE7C5" stroke-width="1.5"/>`;
  for (const ob of OBJECTS) {
    const r = vis(ob.id), col = !r ? '#BDC7D9' : r.state === 'visible' ? '#6EE7C5' : r.state === 'partial' ? '#F2C14E' : '#F28B82';
    const w = ob.size[0] * s, d = ob.size[2] * s;
    o += ob.kind === 'cyl' ? `<circle cx="${X(ob.pos[0])}" cy="${Z(ob.pos[2])}" r="${w / 2}" fill="${ob.color}" stroke="${col}" stroke-width="2"/>` : `<rect x="${X(ob.pos[0]) - w / 2}" y="${Z(ob.pos[2]) - d / 2}" width="${w}" height="${d}" fill="${ob.color}" stroke="${col}" stroke-width="2"/>`;
    o += `<text x="${X(ob.pos[0]) + 10}" y="${Z(ob.pos[2]) - 10}" font-family="JetBrains Mono,monospace" font-size="11" fill="#F4F6FB">${ob.id}</text>`;
  }
  o += `<circle cx="${X(cx)}" cy="${Z(cz)}" r="7" fill="#6EE7C5"/><text x="${X(cx) + 10}" y="${Z(cz) + 18}" font-family="JetBrains Mono,monospace" font-size="11" fill="#6EE7C5">CAMERA</text>
  <text x="8" y="${H - 8}" font-family="JetBrains Mono,monospace" font-size="11" fill="#BDC7D9">C1 TOP VIEW · 1 m = 100 px · north up</text></svg>`;
  $('#plan2d').innerHTML = o;
}

// Plan-only approximation used when WebGL is unavailable: angular intervals in plan, ignoring height.
function approximate() {
  const [cx, ch, cz] = camPos(), yaw = rad(P.yaw), hf = rad(P.fov / 2);
  const objs = OBJECTS.map(ob => { const dx = ob.pos[0] - cx, dz = ob.pos[2] - cz, d = Math.hypot(dx, dz), a = Math.atan2(dz, dx) - yaw, half = Math.atan((ob.size[0] / 2) / d); return { ob, d, a0: a - half, a1: a + half }; });
  return {
    approx: true, objects: objs.map(o => {
      const span = o.a1 - o.a0, inFrame = Math.max(0, Math.min(o.a1, hf) - Math.max(o.a0, -hf)) / span;
      let hidden = 0, by = null;
      for (const p of objs) if (p !== o && p.d < o.d) { const ov = Math.max(0, Math.min(o.a1, p.a1) - Math.max(o.a0, p.a0)) / span; const tall = p.ob.pos[1] + p.ob.size[1] / 2 >= Math.min(ch, o.ob.pos[1] + o.ob.size[1] / 2) - .02; if (tall && ov > hidden) { hidden = ov; by = p.ob; } }
      const visible = inFrame * (1 - hidden);
      return { id: o.ob.id, name: o.ob.name, inFrame, occluded: hidden, by: by && by.id + ' ' + by.name, visible, px: null, state: visible > .9 ? 'visible' : visible > .05 ? 'partial' : 'hidden' };
    })
  };
}

// ---------- interpretation ----------
function interpret(result) {
  const err = validate();
  $('#invalid').dataset.on = !!err; $('#invalid').innerHTML = err ? `<strong>Not reproducible in C1</strong>${err}` : '';
  $('#snap').disabled = !!err;
  let lines = [];
  for (const r of result.objects) {
    if (r.inFrame < .05) lines.push(`${r.id} ${r.name} is outside the frame.`);
    else if (r.occluded > .5) lines.push(`${r.id} ${r.name} is ${Math.round(r.occluded * 100)}% hidden behind ${r.by}.`);
    else if (r.inFrame < .95) lines.push(`${r.id} ${r.name} is cut by the frame edge (${Math.round(r.inFrame * 100)}% inside).`);
    else if (r.occluded > .1) lines.push(`${r.id} ${r.name} is partly hidden (${Math.round(r.occluded * 100)}%) behind ${r.by}.`);
  }
  if (prevResult && lastChanged && lastChanged !== 'preset') {
    const effects = [];
    for (const r of result.objects) {
      const p = prevResult.objects.find(x => x.id === r.id); if (!p || p.state === r.state) continue;
      const why = r.inFrame < .05 ? 'out of the frame' : r.occluded > .5 ? `behind ${r.by}` : r.inFrame < .95 ? 'partly past the frame edge' : r.occluded > .1 ? `partly behind ${r.by}` : null;
      const pct = Math.round(r.visible * 100);
      effects.push(r.state === 'visible' ? `revealed ${r.id} ${r.name}` : r.visible > p.visible ? `uncovered part of ${r.id} ${r.name} (now ${pct}% visible)` : `moved ${r.id} ${r.name} ${why || 'into partial view'}`);
    }
    if (effects.length) lines.unshift(`Changing the ${PNAME[lastChanged]} ${effects.join(' and ')}.`);
  }
  if (!lines.length) { const exp = result.objects.find(o => o.id === '03'); lines = [`All three objects are fully visible.${exp && exp.px ? ` The outline of 03 EXPECTED OBJECT is about ${exp.px} px high in a 1080 px image.` : ''}`]; }
  $('#explain').textContent = err ? 'Not reproducible in C1. ' + err.split('. ')[0] + '.' : lines.slice(0, 2).join(' ');
  $('#objs').innerHTML = result.objects.map(r => `<div class="obj"><b>${r.id} · ${r.name}</b><span class="chip ${r.state === 'visible' ? 'ok' : r.state === 'partial' ? 'warn' : 'bad'}">${r.state}</span>
    <span class="meter" role="img" aria-label="${Math.round(r.visible * 100)} percent visible"><i class="${r.state === 'visible' ? '' : r.state === 'partial' ? 'part' : 'none'}" style="width:${Math.round(r.visible * 100)}%"></i></span>
    <small>${Math.round(r.inFrame * 100)}% in frame · ${Math.round(r.occluded * 100)}% occluded${r.by && r.occluded > .02 ? ' by ' + r.by : ''}${r.px ? ' · outline ≈ ' + r.px + ' px high at 1080p' : ''}</small></div>`).join('') +
    `<p class="small muted" style="margin:0">${result.approx ? 'Plan approximation: ignores height and lens projection.' : 'Measured from an object-ID render of this exact camera.'}</p>`;
  if ($('#cam-label')) $('#cam-label').textContent = `x ${camPos()[0].toFixed(2)} · h ${P.height.toFixed(2)} · z ${camPos()[2].toFixed(2)} m · pan ${P.yaw}° · tilt ${P.tilt}° · hfov ${P.fov}° · SIMULATION`;
  prevResult = result;
}

// ---------- snapshots ----------
const snaps = [];
function snapshot(img) {
  const n = snaps.length + 1, t = new Date().toTimeString().slice(0, 5);
  snaps.push({ n, t, p: { ...P }, text: $('#explain').textContent, img });
  $('#snaps').innerHTML = snaps.map(s => `<li>${s.img ? `<img src="${s.img}" alt="Simulated camera image, snapshot ${s.n}">` : ''}<b>SIM-E12-${String(s.n).padStart(2, '0')} · ${s.t}</b>
    <span class="small">d ${s.p.dist} m · side ${s.p.lateral} m · h ${s.p.height} m · pan ${s.p.yaw}° · tilt ${s.p.tilt}° · hfov ${s.p.fov}°</span><span class="small muted">${s.text}</span><span class="chip">Simulation · not a capture</span></li>`).join('');
}

buildControls(); sync();
$('#reset').onclick = () => { P = { ...DEFAULT }; activePreset = 'frontal'; lastChanged = 'preset'; sync(); update(); };
$('#copy').onclick = async () => { const s = new URLSearchParams(Object.entries(P).map(([k, v]) => [k, String(v)])); const url = location.origin + location.pathname + '?' + s; try { await navigator.clipboard.writeText(url); $('#copied').textContent = 'Link with these settings copied.'; } catch { $('#copied').textContent = url; } };
for (const t of document.querySelectorAll('.tabs [role=tab]')) t.onclick = () => { for (const x of document.querySelectorAll('.tabs [role=tab]')) x.setAttribute('aria-selected', x === t); for (const p of document.querySelectorAll('.tri>[data-tab]')) p.dataset.show = p.dataset.tab === t.dataset.for; };

// ---------- 3D ----------
let update = () => { const r = approximate(); drawPlan(r); interpret(r); };
const forceNoGL = q.get('webgl') === 'off';
let gl = !forceNoGL;
try { gl = gl && !!document.createElement('canvas').getContext('webgl2'); } catch { gl = false; }
if (!gl) {
  $('#v-cam').innerHTML = '<div style="padding:24px;display:grid;gap:8px;align-content:center;height:100%"><p class="tag dark">CAMERA IMAGE UNAVAILABLE</p><p style="margin:0">This browser cannot draw 3D. The top view and a plan approximation remain, and the React field-of-view choices still work.</p></div>';
  $('#v-scene').style.display = 'none';
  $('#boxes').closest('label').hidden = true;
  $('#snap').onclick = () => snapshot(null);
  update();
} else {
  const THREE = await import('three');
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#0f1218');
  scene.add(new THREE.HemisphereLight('#dfe8ff', '#1a2029', .35));
  // Lights sit where the C1 softboxes L1 / L2 stand, so the simulated image matches the E06 lighting setup.
  const target = new THREE.Object3D(); target.position.set(STAGE.x, STAGE.top + .1, STAGE.z); scene.add(target);
  for (const [lz, power] of [[.75, 26], [3.05, 14]]) {
    const s = new THREE.SpotLight('#fff4e8', power, 0, Math.PI / 4.2, .95, 1.6); s.position.set(8.4, 1.6, lz); s.target = target;
    s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -.0005; s.shadow.radius = 6; scene.add(s);
  }
  const mat = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: .55, clearcoat: .15 });
  const room = new THREE.Group(); scene.add(room);
  const boxAt = (w, h, d, x, y, z, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; room.add(m); return m; };
  boxAt(C1.x1 - C1.x0, .02, C1.z1, (C1.x0 + C1.x1) / 2, -.01, C1.z1 / 2, '#2A323D');                // floor
  boxAt(.05, 2.4, 3.9, 7.175, 1.2, 1.95, '#20232B');                                                  // partition
  boxAt(.15, 2.4, 2.6, 9.925, 1.2, 1.9, '#3A414D');                                                   // backdrop
  boxAt(2.8, 3, .05, 8.6, 1.5, -.025, '#E9E5DB');                                                     // north wall
  boxAt(tb.w, .04, tb.d, STAGE.x, tb.h - .02, STAGE.z, '#F4F6FB');                                    // stage top
  for (const [lx, lz] of [[tb.x + .05, tb.y + .05], [tb.x + tb.w - .05, tb.y + .05], [tb.x + .05, tb.y + tb.d - .05], [tb.x + tb.w - .05, tb.y + tb.d - .05]]) boxAt(.04, tb.h - .04, .04, lx, (tb.h - .04) / 2, lz, '#20232B');
  for (const lz of [.75, 3.05]) { boxAt(.6, .45, .06, 8.4, 1.6, lz, '#E9E5DB'); boxAt(.04, 1.4, .04, 8.4, .7, lz, '#20232B'); }  // softboxes L1, L2
  const objMeshes = OBJECTS.map(ob => {
    const g = ob.kind === 'cyl' ? new THREE.CylinderGeometry(ob.size[0] / 2, ob.size[0] / 2, ob.size[1], 40) : new THREE.BoxGeometry(...ob.size);
    const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: ob.color, roughness: .38, clearcoat: .6, clearcoatRoughness: .2 })); m.position.set(...ob.pos); m.castShadow = m.receiveShadow = true; m.userData.ob = ob; scene.add(m); return m;
  });
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, .05, 20);
  // camera body + field of view for the scene pane
  const rig = new THREE.Group(); scene.add(rig);
  const body = new THREE.Mesh(new THREE.BoxGeometry(.14, .1, .1), new THREE.MeshStandardMaterial({ color: '#6EE7C5', emissive: '#2c7a66' }));
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .08, 20), new THREE.MeshStandardMaterial({ color: '#6EE7C5' })); lens.rotation.z = Math.PI / 2; lens.position.x = .1;
  rig.add(body, lens);
  const frustum = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#6EE7C5' })); scene.add(frustum);
  const cone = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: '#6EE7C5', transparent: true, opacity: .09, side: THREE.DoubleSide, depthWrite: false })); scene.add(cone);
  const sight = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ vertexColors: true })); scene.add(sight);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 8), new THREE.MeshStandardMaterial({ color: '#BDC7D9' })); scene.add(mast);
  // Helpers live on layer 1: visible in the overview, never in the simulated camera image or the ID measurement.
  for (const o of [rig, body, lens, frustum, cone, sight, mast]) o.layers.set(1);

  const rCam = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); rCam.outputColorSpace = THREE.SRGBColorSpace;
  const rScene = new THREE.WebGLRenderer({ antialias: true }); rScene.outputColorSpace = THREE.SRGBColorSpace;
  // Each WebGL context needs its own prefiltered environment.
  const env = {};
  for (const [k, r] of [['cam', rCam], ['scene', rScene]]) {
    r.toneMapping = THREE.AgXToneMapping; r.toneMappingExposure = 1.1; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    env[k] = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), .04).texture;
  }
  scene.environmentIntensity = .35;
  $('#v-cam').prepend(rCam.domElement); $('#v-scene').prepend(rScene.domElement);
  rCam.domElement.setAttribute('aria-hidden', 'true'); rScene.domElement.setAttribute('aria-label', 'Scene overview of C1 with the simulated camera. Drag to orbit.');
  const over = new THREE.PerspectiveCamera(42, 16 / 10, .05, 60); over.position.set(7.4, 4.6, 5.6); over.layers.enable(1);
  const orbit = new OrbitControls(over, rScene.domElement); orbit.target.set(8.6, .6, 1.9); orbit.enableDamping = !reduceMotion; orbit.maxPolarAngle = Math.PI * .48; orbit.listenToKeyEvents(rScene.domElement);
  const ov = $('#ov'), octx = ov.getContext('2d');

  // object-ID measurement
  const RT = new THREE.WebGLRenderTarget(320, 180); const buf = new Uint8Array(320 * 180 * 4);
  const idMat = objMeshes.map((m, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0, THREE.LinearSRGBColorSpace) }));
  const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
  function idRender(only) {
    const saved = [];
    scene.traverse(o => { if (o.isMesh) { saved.push([o, o.material, o.visible]); const k = objMeshes.indexOf(o); o.material = k >= 0 ? idMat[k] : black; if (o.parent === rig || o === mast) o.visible = false; if (only !== undefined && k >= 0 && k !== only) o.visible = false; } });
    frustum.visible = sight.visible = false;
    const bg = scene.background; scene.background = new THREE.Color(0, 0, 0);
    const tm = rCam.toneMapping, cs = rCam.outputColorSpace; rCam.toneMapping = THREE.NoToneMapping; rCam.outputColorSpace = THREE.LinearSRGBColorSpace;
    rCam.setRenderTarget(RT); rCam.render(scene, cam); rCam.readRenderTargetPixels(RT, 0, 0, 320, 180, buf); rCam.setRenderTarget(null);
    rCam.toneMapping = tm; rCam.outputColorSpace = cs; scene.background = bg; frustum.visible = sight.visible = true;
    for (const [o, m, v] of saved) { o.material = m; o.visible = v; }
    const ids = new Int8Array(320 * 180).fill(-1);
    for (let i = 0; i < ids.length; i++) { const r = buf[i * 4], g = buf[i * 4 + 1], b = buf[i * 4 + 2]; ids[i] = r > 128 ? 0 : g > 128 ? 1 : b > 128 ? 2 : -1; }
    return ids;
  }
  function projectedRect(m) {
    const box = new THREE.Box3().setFromObject(m), pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) { const v = new THREE.Vector3(x, y, z).applyMatrix4(cam.matrixWorldInverse); if (v.z < -cam.near) pts.push(v.applyMatrix4(cam.projectionMatrix)); }
    if (!pts.length) return null;
    const r = { x0: Math.min(...pts.map(p => p.x)), x1: Math.max(...pts.map(p => p.x)), y0: Math.min(...pts.map(p => p.y)), y1: Math.max(...pts.map(p => p.y)) };
    const area = (r.x1 - r.x0) * (r.y1 - r.y0) || 1e-9;
    const c = { x0: Math.max(-1, r.x0), x1: Math.min(1, r.x1), y0: Math.max(-1, r.y0), y1: Math.min(1, r.y1) };
    const inside = Math.max(0, c.x1 - c.x0) * Math.max(0, c.y1 - c.y0);
    return { r, c, inFrame: inside / area };
  }
  function measure() {
    const full = idRender();
    return {
      approx: false, objects: objMeshes.map((m, k) => {
        const alone = idRender(k); let a = 0, v = 0; const by = [0, 0, 0];
        for (let i = 0; i < alone.length; i++) if (alone[i] === k) { a++; if (full[i] === k) v++; else if (full[i] >= 0) by[full[i]]++; }
        const pr = projectedRect(m), inFrame = pr ? Math.min(1, pr.inFrame) : 0;
        const occluded = a ? 1 - v / a : 0, visible = inFrame * (1 - occluded);
        const bi = by.indexOf(Math.max(...by)), ob = m.userData.ob;
        const px = pr && inFrame > .05 ? Math.round((pr.c.y1 - pr.c.y0) / 2 * 1080) : null;
        return { id: ob.id, name: ob.name, inFrame, occluded, by: by[bi] ? OBJECTS[bi].id + ' ' + OBJECTS[bi].name : null, visible, px, rect: pr, state: visible > .9 ? 'visible' : visible > .05 ? 'partial' : 'hidden' };
      })
    };
  }

  function placeCamera() {
    const p = camPos(), d = camDir();
    cam.position.set(...p); cam.lookAt(p[0] + d[0], p[1] + d[1], p[2] + d[2]);
    cam.fov = 2 * Math.atan(Math.tan(rad(P.fov / 2)) / cam.aspect) * 180 / Math.PI; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    rig.position.copy(cam.position); rig.quaternion.copy(cam.quaternion); rig.rotateY(Math.PI / 2);
    mast.position.set(p[0], p[1] / 2 - .05, p[2]); mast.scale.y = Math.max(.05, p[1] - .1);
    const L = 2.6, corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => new THREE.Vector3(x, y, .5).unproject(cam).sub(cam.position).normalize().multiplyScalar(L).add(cam.position));
    const v = []; for (const c of corners) v.push(cam.position.x, cam.position.y, cam.position.z, c.x, c.y, c.z);
    for (let i = 0; i < 4; i++) { const a = corners[i], b = corners[(i + 1) % 4]; v.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    frustum.geometry.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    const t = [], p0 = cam.position; for (let i = 0; i < 4; i++) { const a = corners[i], b = corners[(i + 1) % 4]; t.push(p0.x, p0.y, p0.z, a.x, a.y, a.z, b.x, b.y, b.z); }
    cone.geometry.setAttribute('position', new THREE.Float32BufferAttribute(t, 3)); cone.geometry.computeBoundingSphere();
  }
  function drawSight(result) {
    const v = [], c = []; const col = { visible: [.43, .91, .77], partial: [.95, .76, .31], hidden: [.95, .55, .51] };
    objMeshes.forEach((m, k) => { v.push(cam.position.x, cam.position.y, cam.position.z, m.position.x, m.position.y, m.position.z); const cc = col[result.objects[k].state]; c.push(...cc, ...cc); });
    sight.geometry.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); sight.geometry.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  }
  function drawOverlay(result) {
    const w = ov.width = ov.clientWidth * devicePixelRatio, h = ov.height = ov.clientHeight * devicePixelRatio; octx.clearRect(0, 0, w, h);
    if (validate()) { octx.fillStyle = 'rgba(180,35,24,.28)'; octx.fillRect(0, 0, w, h); }
    if (!$('#boxes').checked) return;
    octx.lineWidth = 2 * devicePixelRatio; octx.font = `${11 * devicePixelRatio}px "JetBrains Mono",monospace`;
    for (const r of result.objects) {
      if (!r.rect || r.inFrame < .02) continue;
      const { c } = r.rect, x = (c.x0 + 1) / 2 * w, y = (1 - c.y1) / 2 * h, ww = (c.x1 - c.x0) / 2 * w, hh = (c.y1 - c.y0) / 2 * h;
      octx.strokeStyle = octx.fillStyle = r.state === 'visible' ? '#6EE7C5' : r.state === 'partial' ? '#F2C14E' : '#F28B82';
      octx.setLineDash(r.state === 'hidden' ? [6, 5] : []); octx.strokeRect(x, y, ww, hh); octx.setLineDash([]);
      const txt = `${r.id} / ${r.name}${r.state === 'visible' ? '' : ' · ' + r.state}`, tw = octx.measureText(txt).width;
      octx.fillText(txt, Math.max(4, Math.min(x, w - tw - 4)), Math.max(14 * devicePixelRatio, y - 6 * devicePixelRatio));
    }
  }
  function size() {
    for (const [r, el, c, a] of [[rCam, $('#v-cam'), cam, 16 / 9], [rScene, $('#v-scene'), over, null]]) { const w = el.clientWidth, h = el.clientHeight; r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setSize(w, h, false); if (!a) { c.aspect = w / h; c.updateProjectionMatrix(); } }
  }
  new ResizeObserver(() => { size(); update(); }).observe($('#tri'));
  update = () => {
    placeCamera(); const result = measure(); drawSight(result);
    scene.environment = env.cam; rCam.render(scene, cam); drawOverlay(result); drawPlan(result); interpret(result);
  };
  $('#boxes').onchange = () => update();
  $('#snap').onclick = () => { const t = document.createElement('canvas'); t.width = rCam.domElement.width; t.height = rCam.domElement.height; const x = t.getContext('2d'); x.drawImage(rCam.domElement, 0, 0); x.drawImage(ov, 0, 0, t.width, t.height); snapshot(t.toDataURL('image/jpeg', .85)); };
  size(); update();
  (function loop() { orbit.update(); scene.environment = env.scene; rScene.render(scene, over); requestAnimationFrame(loop); })();
}

// Hide and disable every mutable model control. The React parent chooses the single variable.
for (const control of document.querySelectorAll('.controls input,.controls button')) control.disabled = true;
document.querySelector('#h-cam').tabIndex = -1;
