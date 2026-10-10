// Isolated React bridge: original map files stay byte-for-byte unchanged.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../../..');
const target = path.join(root,'apps/lab-web/public/lab-map');
fs.mkdirSync(target,{recursive:true});
let html = fs.readFileSync(path.join(root,'design/phase-08/lab-map.html'),'utf8');
html = html.replace(/href="\.\.\/edition.css"/g,'href="/design/edition.css"').replace(/href="assets\/lab-map.css"/g,'href="/design/phase-08/assets/lab-map.css"');
html = html.replace(/href="assets\//g,'href="/design/phase-08/assets/').replace('src="../theme.js"','src="/design/theme.js"');
html = html.replace(/<header[\s\S]*?<\/header>/,'<header class="shell mast"><span class="mast-brand">PARALLAX · linked map</span><a class="safety" href="#safety">+ Safety</a></header>');
html = html.replace('LAB MAP / P10 · P8-C','REACT PROJECTION / U03 · P4-D').replace('Prepared study · example availability from data/resources.json, not live. Geometry: P4-D conceptual envelope.','Waiting for the React equipment projection. Geometry: P4-D assumed envelope; model positions show home geometry, not tracked movement.');
html = html.replace('./node_modules/three/','/design/phase-08/node_modules/three/').replace('./node_modules/three/','/design/phase-08/node_modules/three/').replace('src="assets/lab-map.js"','src="bridge.js"');
fs.writeFileSync(path.join(target,'index.html'),html);
let script = fs.readFileSync(path.join(root,'design/phase-08/assets/lab-map.js'),'utf8');
script = script.replace("'../../spatial/lab_geometry.json'","'/spatial/lab_geometry.json'").replace("'../../spatial/exports/lab_interactive.glb'","'/spatial/exports/lab_interactive.glb'").replace("fetch('data/resources.json')","fetch('/design/phase-08/data/resources.json')").replace("import('./lab-3d.js')","import('./model.js')");
script = script.replace(/\(protoSession \? '[\s\S]*?' : '[\s\S]*?'\)/,"'<button class=\"btn primary\" id=\"open-react-asset\">Open React asset record</button>'");
script = script.replace('Last update over 15 minutes ago. Check at the station before relying on it.','Delayed projection demonstration. Check the React record before relying on it.');
const start = script.indexOf('// P9-A:');
const end = script.indexOf('const byId',start);
if(start < 0 || end < 0) throw new Error('Map source contract changed');
script = script.slice(0,start)+"let projectionTime = null;\nfor (const r of R.resources) { r.availability = 'Unknown'; r.occupancy = 'Unknown'; delete r.note; }\n"+script.slice(end);
const freshStart = script.indexOf('function renderFresh()');
const freshEnd = script.indexOf('// ---------- list',freshStart);
script = script.slice(0,freshStart)+`function renderFresh() {
  $('#fresh').textContent = projectionTime ? 'REACT EXAMPLE · updated at example time ' + projectionTime + (reviewState === 'stale' ? ' · delayed projection demonstration' : '') : 'Waiting for React projection';
  document.body.dataset.stale = reviewState === 'stale';
}
\n`+script.slice(freshEnd);
script += `
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
`;
fs.writeFileSync(path.join(target,'bridge.js'),script);
let model = fs.readFileSync(path.join(root,'design/phase-08/assets/lab-3d.js'),'utf8');
const lifecycleReplace = (before, after) => {
  if (!model.includes(before)) throw new Error('Map lifecycle source contract changed');
  model = model.replace(before, after);
};
lifecycleReplace('scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;', 'const roomEnvironment = new RoomEnvironment(), environmentTarget = pmrem.fromScene(roomEnvironment, .04); scene.environment = environmentTarget.texture; roomEnvironment.dispose();');
lifecycleReplace('let running = false;', 'let running = false, frame = 0, disposed = false;');
lifecycleReplace('const ro = new ResizeObserver(size);', `const ro = new ResizeObserver(size);
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (running && !disposed && !frame) frame = requestAnimationFrame(loop); };
  document.addEventListener('visibilitychange', onVisibility);`);
lifecycleReplace('if (!running) return;', 'frame = 0; if (!running || disposed || document.hidden) return;');
lifecycleReplace('controls.update(); renderer.render(scene, camera); placePins(); requestAnimationFrame(loop);', 'controls.update(); renderer.render(scene, camera); placePins(); frame = requestAnimationFrame(loop);');
lifecycleReplace('if (!running) { running = true; requestAnimationFrame(loop); }', 'if (!running && !disposed) { running = true; frame = requestAnimationFrame(loop); }');
lifecycleReplace('detach() { running = false; ro.disconnect(); },', 'detach() { running = false; cancelAnimationFrame(frame); frame = 0; ro.disconnect(); },');
lifecycleReplace('dispose() { running = false; ro.disconnect(); renderer.dispose(); pmrem.dispose(); },', `dispose() { if (disposed) return; disposed = true; running = false; cancelAnimationFrame(frame); frame = 0; document.removeEventListener('visibilitychange', onVisibility); ro.disconnect(); controls.dispose(); const geometries = new Set(), materials = new Set(), textures = new Set(); scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); for (const material of [object.material].flat().filter(Boolean)) { materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value); } }); geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose()); environmentTarget.dispose(); renderer.dispose(); pmrem.dispose(); renderer.forceContextLoss(); },`);
fs.writeFileSync(path.join(target,'model.js'),model);
fs.appendFileSync(path.join(target,'bridge.js'), "\naddEventListener('pagehide', () => three?.dispose(), {once:true});\n");
console.log('React-linked map generated; original map unchanged.');
