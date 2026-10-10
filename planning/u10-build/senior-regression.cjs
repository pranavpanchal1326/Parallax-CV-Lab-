// Execute the real highlight function and transpiled QA handlers against controlled
// dependencies. These checks cover ownership/concurrency, not a whole GPU or DOM.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const {pathToFileURL} = require('node:url');
let transform;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const deferred = () => { let resolve; const promise = new Promise(r => resolve = r); return {promise, resolve}; };

function highlightCheck(source) {
  let live = 0, allocated = 0, released = 0;
  const material = () => ({clone() {live++; allocated++; let disposed = false; return {dispose() {assert.equal(disposed, false); disposed = true; live--; released++;}};}});
  const meshesById = {A: [0, 1].map(() => ({userData: {base: material()}})), B: [{userData: {base: material()}}]};
  const anchors = Object.fromEntries(['A', 'B'].map(id => [id, {el: {classList: {toggle() {}}}}]));
  const start = source.indexOf('let current = null, pulse = 0;'), end = source.indexOf('let anim = null;', start);
  assert.ok(start >= 0 && end > start);
  const scope = {meshesById, anchors, THREE: {Color: class {}}}; vm.createContext(scope);
  vm.runInContext(source.slice(start, end) + '\nthis.select = highlight;', scope);
  for (let i = 0; i < 500; i++) {const id = i % 2 ? 'B' : 'A'; scope.select(id); assert.equal(live, meshesById[id].length, 'Only current highlight clones may remain live');}
  scope.select(null); assert.equal(live, 0); assert.equal(allocated, released);
  return {selections: 500, clonesAllocated: allocated, clonesReleased: released, liveAfterClear: live};
}

async function qaHarness(source, loadAxe) {
  let cursor = 0, location = {pathname: '/map', search: ''}, tree;
  const hooks = [], effects = [];
  const scope = {
    React: {createElement: (tag, props, ...children) => ({tag, props, children})},
    useState(initial) {const slot = cursor++; hooks[slot] ??= {value: initial}; return [hooks[slot].value, value => hooks[slot].value = value];},
    useRef(initial) {const slot = cursor++; hooks[slot] ??= {current: initial}; return hooks[slot];},
    useEffect(fn, deps) {const slot = cursor++, previous = hooks[slot]; if (!previous || deps.some((value, i) => value !== previous.deps[i])) effects.push(() => {previous?.cleanup?.(); hooks[slot] = {deps, cleanup: fn()};});},
    useLocation: () => location,
    URLSearchParams, window: {location: {search: '?qa=1'}}, document: {}, loadAxe
  };
  const js = (await transform(source, 'AccessReview.tsx', {jsx: {runtime: 'classic', pragma: 'React.createElement'}})).code
    .replace(/^import .*;\r?\n/gm, '').replace(/^export \{[\s\S]*?\};?/gm, '').replace('export function AccessReview', 'function AccessReview').replace('import("axe-core")', 'loadAxe()');
  vm.createContext(scope); vm.runInContext(js + '\nthis.component = AccessReview;', scope);
  const render = () => {cursor = 0; tree = scope.component(); while (effects.length) effects.shift()(); return tree;};
  const find = (node, tag) => node && typeof node === 'object' ? node.tag === tag ? node : node.children?.map(child => find(child, tag)).find(Boolean) : undefined;
  render(); render();
  return {render, button: () => {render(); return find(tree, 'button');}, report: () => {render(); return find(tree, 'pre')?.children.join('');}, navigate(pathname) {location = {pathname, search: ''}; render(); render();}};
}

async function qaCheck(source, checkImport = true) {
  let calls = 0;
  const result = {violations: [], passes: [], incomplete: [], testEngine: {name: 'controlled fixture'}};
  if (checkImport) {
    const imported = deferred(), pending = deferred();
    const axe = {run() {calls++; return pending.promise;}};
    const h = await qaHarness(source, () => imported.promise);
    const scan = h.button().props.onClick(); h.navigate('/dashboard'); imported.resolve({default: axe}); pending.resolve(result); await scan;
    assert.equal(calls, 0, 'A route invalidated before import settles must not be scanned');
    assert.equal(h.report(), undefined); assert.equal(h.button().props.disabled, false);
  }

  const wait = deferred(); calls = 0;
  const h2 = await qaHarness(source, async () => ({default: {run() {calls++; return wait.promise;}}}));
  const running = h2.button().props.onClick(); await new Promise(setImmediate); assert.equal(calls, 1);
  h2.navigate('/dashboard'); assert.equal(h2.button().props.disabled, true, 'Navigation must retain the active engine lock');
  await h2.button().props.onClick(); assert.equal(calls, 1, 'Concurrent engine invocation must be refused');
  wait.resolve(result); await running; assert.equal(h2.report(), undefined); assert.equal(h2.button().props.disabled, false);
  await h2.button().props.onClick(); assert.equal(calls, 2); assert.equal(JSON.parse(h2.report()).path, '#/dashboard');
  return {cancelledBeforeImport: true, concurrentScanRefused: true, staleResultDiscarded: true, newRouteCanScan: true};
}

(async () => {
  ({transformWithOxc: transform} = await import(pathToFileURL(path.join(root, 'apps/lab-web/node_modules/vite/dist/node/index.js')).href));
  const beforeHighlight = read('design/phase-08/assets/lab-3d.js');
  const beforeQa = read('planning/revisions/U09-before-senior-review-20261004/apps/lab-web/src/components/AccessReview.tsx');
  const before = {};
  for (const [name, check] of [['highlight', () => highlightCheck(beforeHighlight)], ['accessibilityImport', () => qaCheck(beforeQa)], ['accessibilityOverlap', () => qaCheck(beforeQa, false)]]) {
    try {await check(); throw Error('The regression check must fail against the old source');} catch (error) {assert.notEqual(error.message, 'The regression check must fail against the old source'); before[name] = error.message;}
  }
  const baseline = JSON.parse(read('planning/revisions/U09-before-implementation/manifest.json'));
  const changes = [], unchanged = []; let copiesVerified = 0;
  for (const row of baseline.sources) {
    const saved = 'planning/revisions/U09-before-implementation/' + row.path.replace(/^apps\/lab-web\//, '');
    if (fs.existsSync(path.join(root, saved))) {assert.equal(hash(saved), row.sha256, 'Preserved baseline itself changed: ' + row.path); copiesVerified++;}
    (hash(row.path) === row.sha256 ? unchanged : changes).push(row.path);
  }
  const canonical = JSON.parse(read('planning/revisions/EX-2.1-baseline/manifest.json'));
  const protectedFiles = canonical.files.filter(row => row.path !== 'package.json');
  for (const row of protectedFiles) assert.equal(hash(row.path), row.sha256, 'Canonical source changed: ' + row.path);
  const receipt = {date: '2026-10-04', beforeFailures: before, highlight: highlightCheck(read('apps/lab-web/public/lab-map/model.js')), accessibility: await qaCheck(read('apps/lab-web/src/components/AccessReview.tsx')), preservation: {canonicalFiles: protectedFiles.length, trackedSources: baseline.sources.length, byteIdentical: unchanged.length, changedPaths: changes, baselineCopiesVerified: copiesVerified}, limits: 'Controlled dependencies for the actual source functions/handlers; browser observations complement this. Not proof of global GPU leak freedom or complete accessibility conformance.'};
  const directory = path.join(root, 'apps/lab-web/evidence/senior-regression'); fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, 'source-checks.json'), JSON.stringify(receipt, null, 2)); console.log(JSON.stringify(receipt, null, 2));
})().catch(error => {console.error(error); process.exitCode = 1;});
