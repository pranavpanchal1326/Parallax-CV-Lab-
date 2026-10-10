const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const replacements=[
  ['<nav class="no-print"><a href="index.html">','<nav class="no-print" aria-label="Submission resources"><a href="index.html">'],
  ['<nav class="no-print"><button id="previous">Previous slide','<nav class="no-print" aria-label="Presentation controls"><button id="previous">Previous slide'],
  ['<nav><a href="../index.html">','<nav aria-label="Submission resources"><a href="../index.html">'],
  ['<nav class="no-print"><button id="previous">Previous frame','<nav class="no-print" aria-label="Walkthrough controls"><button id="previous">Previous frame']
];
const rows=[];
for(const name of ['submission/presentation.html','submission/demo/index.html','planning/u10-build/build-handoff.cjs']){
  const target=path.join(root,name),before=fs.readFileSync(target,'utf8');let after=before,count=0;
  for(const [oldText,newText] of replacements)if(after.includes(oldText)){assert.equal(after.split(oldText).length,2);after=after.replace(oldText,newText);count++;}
  assert.equal(count,name.startsWith('planning/')?4:2);
  assert.equal(after.replace(/ aria-label="(?:Submission resources|Presentation controls|Walkthrough controls)"/g,''),before,'Only navigation names may change');
  fs.writeFileSync(target,after);
  rows.push({path:name,navigationRegionsNamed:count,beforeSha256:crypto.createHash('sha256').update(before).digest('hex'),afterSha256:crypto.createHash('sha256').update(after).digest('hex'),otherBytesUnchanged:true});
}
fs.writeFileSync(path.join(root,'apps/lab-web/evidence/packet-checks/change-ledger.json'),JSON.stringify({date:'2026-10-04',rows,scope:'Distinct navigation names only; scripts, styling, timing, images and text preserved byte-for-byte.'},null,2));
console.log(JSON.stringify(rows,null,2));
