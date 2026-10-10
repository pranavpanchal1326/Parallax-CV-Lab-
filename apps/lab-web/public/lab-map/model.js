// Optional three.js layer for the Lab Map (P8-B look). Loaded only after the user asks for 3D.
// Environment lighting, soft shadows, availability halos, accessible ID pins and hover tooltips.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const TONE = { ok: '#3FBF86', bad: '#E5484D', warn: '#F2C14E', none: '#9AA3B2' };
function tone(r) {
  const a = r.availability;
  if (a.startsWith('Restricted')) return 'bad';
  if (a.startsWith('Location unknown') || r.occupancy === 'Unknown') return 'warn';
  if (a.startsWith('Bookable') || a.startsWith('Open')) return 'ok';
  return 'none';
}

export async function create(container, url, R, { onPick, reduceMotion }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', '3D lab model. Use the resource list, the labelled pins or named viewpoints; drag to orbit.');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#151B26');
  scene.fog = new THREE.Fog('#151B26', 26, 60);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment(), environmentTarget = pmrem.fromScene(roomEnvironment, .04); scene.environment = environmentTarget.texture; roomEnvironment.dispose();
  scene.environmentIntensity = .55;
  const sun = new THREE.DirectionalLight('#FFE6C8', 2.6); sun.position.set(-7, 13, 15); sun.target.position.set(5, 0, 3.5);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
  scene.add(sun, sun.target, new THREE.HemisphereLight('#CFE0FF', '#2A2F3A', .55));
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#1B2230', roughness: .35, metalness: .2 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(5, -.36, 3.5); ground.receiveShadow = true; scene.add(ground);

  const camera = new THREE.PerspectiveCamera(38, 1, .05, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reduceMotion; controls.maxPolarAngle = Math.PI * .47; controls.minDistance = 1.5; controls.maxDistance = 30;
  controls.listenToKeyEvents(canvas);

  const gltf = await new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, () => rej(new Error('The model file could not be read'))));
  const root = gltf.scene; scene.add(root);
  const byId = Object.fromEntries(R.resources.map(r => [r.id, r]));
  const meshesById = {}, glow = [];
  root.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    let n = o, id = null;
    while (n && !id) { if (byId[n.name]) id = n.name; n = n.parent; }
    o.userData.rid = id;
    if (id) (meshesById[id] ||= []).push(o);
    const m = o.material;
    if (m && m.emissive && m.emissive.getHSL({}).l > .2) glow.push(m);           // phosphor accents pulse gently
    if (m && m.isMeshStandardMaterial) m.envMapIntensity = 1;
    o.userData.base = o.material;
  });

  // availability halos + labelled pins
  const halos = new THREE.Group(); scene.add(halos);
  const pinLayer = document.createElement('div');
  pinLayer.className = 'pins'; pinLayer.setAttribute('aria-label', 'Labelled resources in the model');
  const anchors = {};
  for (const r of R.resources) {
    const list = meshesById[r.id]; if (!list) continue;
    const box = new THREE.Box3(); list.forEach(m => box.expandByObject(m));
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const rad = Math.max(.28, Math.min(.9, Math.max(s.x, s.z) * .55));
    const t = tone(r), col = new THREE.Color(TONE[t]);
    const ring = new THREE.Mesh(new THREE.RingGeometry(rad * .82, rad, 48), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .85, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(c.x, .012, c.z); ring.userData.rid = r.id;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(rad * .82, 48), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .14, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.set(c.x, .01, c.z);
    halos.add(ring, disc);
    anchors[r.id] = { pos: new THREE.Vector3(c.x, box.max.y + .18, c.z), ring };
    const b = document.createElement('button');
    b.className = 'pin ' + t; b.dataset.id = r.id; b.textContent = r.id;
    b.setAttribute('aria-label', `${r.id}, ${r.name}, ${r.availability}, ${r.occupancy}`);
    b.addEventListener('click', () => onPick(r.id));
    b.addEventListener('mouseenter', () => tip(r, b)); b.addEventListener('mouseleave', () => tipEl.hidden = true);
    b.addEventListener('focus', () => tip(r, b)); b.addEventListener('blur', () => tipEl.hidden = true);
    anchors[r.id].el = b; pinLayer.append(b);
  }
  const tipEl = document.createElement('div'); tipEl.className = 'tip'; tipEl.hidden = true; tipEl.setAttribute('role', 'tooltip');
  function tip(r, b) { tipEl.innerHTML = `<b>${r.id}</b> ${r.name}<br><span>${r.availability} · ${r.occupancy}</span>`; tipEl.hidden = false; tipEl.style.left = b.style.left; tipEl.style.top = `calc(${b.style.top} - 54px)`; }

  let current = null, pulse = 0; const highlightedMaterials = new Set();
  function highlight(id) {
    for (const list of Object.values(meshesById)) for (const m of list) m.material = m.userData.base;
    highlightedMaterials.forEach(material => material.dispose()); highlightedMaterials.clear();
    current = id;
    for (const m of meshesById[id] || []) { const c = m.userData.base.clone(); c.emissive = new THREE.Color('#3346D3'); c.emissiveIntensity = .7; m.material = c; highlightedMaterials.add(c); }
    for (const [k, a] of Object.entries(anchors)) a.el.classList.toggle('on', k === id);
  }

  let anim = null;
  function goTo(viewKey) {
    const v = R.views[viewKey]; if (!v) return;
    const toP = new THREE.Vector3(...v.position), toT = new THREE.Vector3(...v.target);
    if (reduceMotion) { camera.position.copy(toP); controls.target.copy(toT); controls.update(); return; }
    const fromP = camera.position.clone(), fromT = controls.target.clone(), t0 = performance.now(), dur = 900;
    anim = now => { const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; camera.position.lerpVectors(fromP, toP, e); controls.target.lerpVectors(fromT, toT, e); if (k >= 1) anim = null; };
  }

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
  function pick(e) { const r = canvas.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ptr, camera); return ray.intersectObjects([...root.children, halos], true).find(h => h.object.userData.rid); }
  canvas.addEventListener('pointerdown', e => down = [e.clientX, e.clientY]);
  canvas.addEventListener('pointerup', e => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; const hit = pick(e); if (hit) onPick(hit.object.userData.rid); });
  canvas.addEventListener('pointermove', e => { const hit = pick(e); canvas.style.cursor = hit ? 'pointer' : 'grab'; });

  let running = false, frame = 0, disposed = false;
  const v3 = new THREE.Vector3();
  function placePins() {
    const w = container.clientWidth, h = container.clientHeight, placed = [];
    const list = Object.entries(anchors).map(([id, a]) => { v3.copy(a.pos).project(camera); return { id, a, x: (v3.x + 1) / 2 * w, y: (1 - v3.y) / 2 * h, z: v3.z }; })
      .sort((p, q) => (p.id === current ? -1 : q.id === current ? 1 : p.y - q.y));
    for (const p of list) {
      const vis = p.z < 1 && p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20;
      p.a.el.style.display = vis ? '' : 'none'; if (!vis) continue;
      const wd = p.a.el.offsetWidth || 60;
      // nudge upward until the label no longer overlaps one already placed (leader-free declutter)
      for (let i = 0; i < 6 && placed.some(q => Math.abs(q.x - p.x) < (q.w + wd) / 2 + 4 && Math.abs(q.y - p.y) < 22); i++) p.y -= 22;
      placed.push({ x: p.x, y: p.y, w: wd });
      p.a.el.style.left = p.x + 'px'; p.a.el.style.top = p.y + 'px';
    }
  }
  function size() {
    const w = container.clientWidth, h = container.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
    // a floating detail card on the right covers part of the canvas: centre the model in the clear area instead
    const card = document.getElementById('detail'), cr = container.getBoundingClientRect(), dr = card && card.getBoundingClientRect();
    const covered = dr && dr.left > cr.left + cr.width / 2 && dr.top < cr.top + cr.height / 2 ? Math.max(0, cr.right - dr.left) : 0;
    if (covered) camera.setViewOffset(w, h, covered / 2, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(size);
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (running && !disposed && !frame) frame = requestAnimationFrame(loop); };
  document.addEventListener('visibilitychange', onVisibility);
  function loop(now) {
    frame = 0; if (!running || disposed || document.hidden) return;
    if (anim) anim(now);
    if (!reduceMotion) {
      pulse = (now / 1000) % 1;
      for (const m of glow) m.emissiveIntensity = 1 + .35 * Math.sin(now / 900);
      if (current && anchors[current]) { const s = 1 + .25 * Math.sin(now / 260); anchors[current].ring.scale.setScalar(s); }
    }
    controls.update(); renderer.render(scene, camera); placePins(); frame = requestAnimationFrame(loop);
  }
  const ov = R.views.overview; camera.position.set(...ov.position); controls.target.set(...ov.target);

  return {
    attach() { container.innerHTML = ''; container.append(canvas, pinLayer, tipEl); ro.observe(container); size(); if (!running && !disposed) { running = true; frame = requestAnimationFrame(loop); } },
    detach() { running = false; cancelAnimationFrame(frame); frame = 0; ro.disconnect(); },
    highlight, goTo,
    setHalos(on) { halos.visible = on; pinLayer.hidden = !on; },
    dispose() { if (disposed) return; disposed = true; running = false; cancelAnimationFrame(frame); frame = 0; document.removeEventListener('visibilitychange', onVisibility); ro.disconnect(); controls.dispose(); const geometries = new Set(), materials = new Set(), textures = new Set(); scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); for (const material of [object.material, object.userData?.base].flat().filter(Boolean)) { materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value); } }); geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose()); highlightedMaterials.clear(); environmentTarget.dispose(); renderer.dispose(); pmrem.dispose(); renderer.forceContextLoss(); },
  };
}
