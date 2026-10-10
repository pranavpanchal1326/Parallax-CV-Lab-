const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const before=json('apps/lab-web/evidence/packet-checks/before.json'),after=json('apps/lab-web/evidence/packet-checks/after.json'),changes=json('apps/lab-web/evidence/packet-checks/change-ledger.json'),keyboard=json('apps/lab-web/evidence/packet-checks/keyboard.json');
assert.equal(before.scans.length,9);assert.equal(after.scans.length,9);assert.equal(after.layouts.length,9);
assert.equal(before.scans.filter(row=>row.violations.length).length,6);
assert.ok(before.scans.every(row=>row.violations.every(v=>v.id==='landmark-unique')));
for(const page of ['/submission/index.html','/submission/presentation.html','/submission/demo/index.html'])for(const width of [320,768,1280]){
  const layout=after.layouts.find(row=>row.page===page&&row.viewport===width),scan=after.scans.find(row=>row.page===page&&row.viewport===width);
  assert.ok(layout&&scan);assert.equal(layout.requestedWidth,width);assert.equal(layout.pageOverflow,false);assert.ok(layout.scrollWidth<=layout.documentWidth);assert.equal(scan.violations.length,0);assert.equal(scan.incomplete.length,0);
}
for(const row of changes.rows){assert.equal(hash(row.path),row.afterSha256);const saved='planning/revisions/U10-before-packet-access-20261004/'+row.path;assert.equal(hash(saved),row.beforeSha256);assert.equal(read(row.path).replace(/ aria-label="(?:Submission resources|Presentation controls|Walkthrough controls)"/g,''),read(saved));}
const frames=keyboard.filter(row=>row.kind==='frame'),slides=keyboard.filter(row=>row.kind==='slide');assert.equal(frames.length,9);assert.equal(slides.length,14);
for(const row of frames){assert.equal(row.status,`Frame ${row.number} of 10`);assert.ok(row.caption&&row.image);}
for(const row of slides){assert.match(row.status,new RegExp(`^Slide ${row.number} of 15`));assert.ok(row.caption&&row.notesPresent);assert.equal(row.image,`deck-slides/slide-${String(row.number).padStart(2,'0')}.png`);}
assert.equal(keyboard.find(row=>row.kind==='entry-keyboard-order').focused,true);
assert.equal(keyboard.find(row=>row.kind==='frame-boundaries').end.nextDisabled,true);
assert.equal(keyboard.find(row=>row.kind==='frame-boundaries').startPreviousDisabled,true);
assert.equal(keyboard.find(row=>row.kind==='slide-boundaries').end.nextDisabled,true);
assert.equal(keyboard.find(row=>row.kind==='slide-boundaries').previousFocused,true);
const manifest=json('submission/SOURCE_MANIFEST.json');
const applicationRows=manifest.files.filter(row=>/^(apps\/lab-web\/(src|scripts|tests|public|dist)\/|apps\/lab-server\/|apps\/lab-shared\/|prototype\/|design\/phase-08\/assets\/)/.test(row.path)||/^(package(?:-lock)?\.json|apps\/lab-web\/(package(?:-lock)?\.json|tsconfig\.json|vite\.config\.ts))$/.test(row.path));
for(const row of applicationRows)assert.equal(hash(row.path),row.sha256,'Application changed during packet refinement: '+row.path);
const artifacts=['submission/PARALLAX-Final-Report.pdf','submission/PARALLAX-Presentation-Final.pptx','submission/demo/PARALLAX-Recorded-Walkthrough.webm'].map(p=>{const row=manifest.files.find(row=>row.path===p);assert.ok(row);assert.equal(hash(p),row.sha256);return{path:p,sha256:row.sha256,unchanged:true};});
const result={date:'2026-10-04',method:'Fixed iframe CSS viewports in the existing in-app browser',pages:3,widths:[320,768,1280],layoutChecks:9,automatedScans:9,confirmedViolations:0,incompleteRules:0,pageOverflow:false,keyboardForwardSteps:frames.length+slides.length,applicationFilesUnchanged:applicationRows.length,artifacts,scope:'Packet-only navigation names; no application, styling, timing, image, note or recording change. Not physical-device, actual browser zoom or spoken screen-reader verification.'};
fs.writeFileSync(path.join(root,'apps/lab-web/evidence/packet-checks/integrity.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
