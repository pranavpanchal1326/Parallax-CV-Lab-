// Preserve the validated Scene Studio calculation; constrain only its rehearsal controls.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../../..");
const target = path.join(root, "apps/lab-web/public/scene-rehearsal");
fs.mkdirSync(target, { recursive: true });
let html = fs.readFileSync(
  path.join(root, "design/phase-08/scene-studio.html"),
  "utf8",
);
html = html
  .replace('src="../theme.js"', 'src="/design/theme.js"')
  .replace(/href="assets\//g, 'href="/design/phase-08/assets/')
  .replace('href="../edition.css"', 'href="/design/edition.css"')
  .replace(/\.\/node_modules\/three\//g, "/design/phase-08/node_modules/three/")
  .replace('src="assets/scene-studio.js"', 'src="model.js"')
  .replace(
    /<header[\s\S]*?<\/header>/,
    '<header class="shell mast"><span class="mast-brand">PARALLAX · fixed geometry rehearsal</span></header>',
  )
  .replace('href="#presets"', 'href="#h-cam"')
  .replace("Skip to presets", "Skip to model views")
  .replace(
    "Positions are measured in C1, so a setting can be reproduced at the real tripod.",
    "Only horizontal field of view differs from the 40° baseline. P4-D is conceptual geometry; no physical setup is changed or validated.",
  )
  .replace(
    "EVIDENCE SNAPSHOTS · THIS SESSION ONLY",
    "MODEL ONLY · NO EVIDENCE CAPTURE",
  )
  .replace(
    "</head>",
    "<style>.controls,.snaps{display:none}.st-head h1{font-size:32px}.st-wrap{padding-top:24px}</style></head>",
  );
fs.writeFileSync(path.join(target, "index.html"), html);
let model = fs.readFileSync(
  path.join(root, "design/phase-08/assets/scene-studio.js"),
  "utf8",
);
model = model.replace(
  "'../../spatial/lab_geometry.json'",
  "'/spatial/lab_geometry.json'",
);
model = model.replace(
  "and every preset still works.",
  "and the React field-of-view choices still work.",
);
// Allowlisted query and held constants: keep original approximation/WebGL algorithms unchanged.
const begin = model.indexOf("for (const c of CONTROLS) if (q.has(c.key))");
const end = model.indexOf("let lastChanged", begin);
if (begin < 0 || end < 0)
  throw new Error("Scene Studio query contract changed");
model =
  model.slice(0, begin) +
  "P = { ...DEFAULT, fov: [18, 40, 90].includes(Number(q.get('fov'))) ? Number(q.get('fov')) : 40 };\n" +
  model.slice(end);
// U09 owns only the copied renderer lifecycle. Scientific measurement blocks stay exact.
const replaceOnce = (before, after) => {
  if (!model.includes(before)) throw new Error('Scene lifecycle source contract changed: ' + before.slice(0, 50));
  model = model.replace(before, after);
};
replaceOnce('const env = {};', 'const env = {}, environmentTargets = [];');
replaceOnce('env[k] = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), .04).texture;', `const generator = new THREE.PMREMGenerator(r), roomEnvironment = new RoomEnvironment();
    const environmentTarget = generator.fromScene(roomEnvironment, .04);
    env[k] = environmentTarget.texture; environmentTargets.push(environmentTarget);
    generator.dispose(); roomEnvironment.dispose();`);
replaceOnce("new ResizeObserver(() => { size(); update(); }).observe($('#tri'));", "const resizeObserver = new ResizeObserver(() => { size(); update(); scheduleFrame(); }); resizeObserver.observe($('#tri'));");
replaceOnce('scene.environment = env.cam; rCam.render(scene, cam); drawOverlay(result); drawPlan(result); interpret(result);', 'scene.environment = env.cam; rCam.render(scene, cam); drawOverlay(result); drawPlan(result); interpret(result); scheduleFrame();');
replaceOnce("size(); update();\n  (function loop() { orbit.update(); scene.environment = env.scene; rScene.render(scene, over); requestAnimationFrame(loop); })();", `let frame = 0, disposed = false, frames = 0;
  const diagnostic = q.get('qa') === '1' ? document.createElement('output') : null;
  if (diagnostic) { diagnostic.id = 'scene-lifecycle'; diagnostic.setAttribute('aria-label', 'Scene lifecycle diagnostics'); document.body.append(diagnostic); }
  function publish() { if (diagnostic) diagnostic.textContent = JSON.stringify({frames, queued: !!frame, disposed, geometries: rScene.info.memory.geometries, textures: rScene.info.memory.textures}); }
  function scheduleFrame() { if (!disposed && !document.hidden && !frame) { frame = requestAnimationFrame(renderFrame); publish(); } }
  function renderFrame() {
    frame = 0; if (disposed || document.hidden) return;
    const changed = orbit.update(); scene.environment = env.scene; rScene.render(scene, over); frames++;
    if (changed && orbit.enableDamping) scheduleFrame(); publish();
  }
  function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; publish(); } else scheduleFrame(); }
  function disposeScene() {
    if (disposed) return; disposed = true; cancelAnimationFrame(frame); frame = 0;
    resizeObserver.disconnect(); orbit.dispose();
    orbit.removeEventListener('change', scheduleFrame); document.removeEventListener('visibilitychange', visibility);
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); for (const material of [object.material].flat().filter(Boolean)) { materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value); } });
    geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
    RT.dispose(); idMat.forEach(value => value.dispose()); black.dispose(); environmentTargets.forEach(value => value.dispose());
    for (const renderer of [rCam, rScene]) { renderer.dispose(); renderer.forceContextLoss(); }
    publish(); parent.postMessage({type:'parallax-scene-disposed', frames, queued: false}, location.origin);
  }
  orbit.addEventListener('change', scheduleFrame); document.addEventListener('visibilitychange', visibility);
  addEventListener('pagehide', disposeScene, {once:true});
  size(); update(); scheduleFrame();`);
model += `
// Hide and disable every mutable model control. The React parent chooses the single variable.
for (const control of document.querySelectorAll('.controls input,.controls button')) control.disabled = true;
document.querySelector('#h-cam').tabIndex = -1;
`;
fs.writeFileSync(path.join(target, "model.js"), model);
console.log(
  "U05 fixed-field-of-view Scene Studio generated; original geometry calculations retained.",
);
