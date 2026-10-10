// Read-only project inspection. Writes only the dated audit evidence record.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const audit = path.join(root, 'apps/lab-web/evidence/u09-audit');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk = (folder, exclude = new Set()) => fs.readdirSync(folder, {withFileTypes:true}).flatMap(e => {
  if (e.isDirectory() && exclude.has(e.name)) return [];
  const p = path.join(folder, e.name);
  return e.isDirectory() ? walk(p, exclude) : [p];
});
const rel = file => path.relative(root, file).split(path.sep).join('/');
const files = walk(root, new Set(['node_modules','revisions']));
const documents = files.filter(p => p.endsWith('.md') && !p.includes(`${path.sep}dist${path.sep}`));
const links = [];
for (const file of documents) {
  const content = fs.readFileSync(file,'utf8');
  for (const m of content.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    let target = m[1].trim();
    if (target.startsWith('<') && target.endsWith('>')) target=target.slice(1,-1);
    if (/^(https?:|mailto:|app:|#)/.test(target)) continue;
    target = target.split(/[?#]/)[0];
    if (!target) continue;
    try {target=decodeURIComponent(target);} catch {}
    const resolved=path.resolve(path.dirname(file),target);
    const relativeFile=rel(file);
    const deployed=relativeFile.startsWith('apps/lab-web/public/') ? path.resolve(path.dirname(path.join(root,relativeFile.replace('/public/','/dist/'))),target) : null;
    links.push({document:relativeFile,target:m[1],exists:fs.existsSync(resolved),copiedBuildTargetExists:!!deployed&&fs.existsSync(deployed)});
  }
}
const dist = path.join(root,'apps/lab-web/dist');
const isolated = path.join(root,'planning/revisions/U09-audit-build-2026-10-04');
const buildFiles = walk(isolated);
const buildComparison = buildFiles.map(file => {
  const relative=path.relative(isolated,file), current=path.join(dist,relative);
  return {path:relative.split(path.sep).join('/'),exists:fs.existsSync(current),same:fs.existsSync(current)&&hash(file)===hash(current)};
});
const bundles = walk(path.join(dist,'assets')).map(file => ({path:rel(file),bytes:fs.statSync(file).size,gzipBytes:zlib.gzipSync(fs.readFileSync(file)).length,sha256:hash(file)}));
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const htmlLinks=[];
for(const file of walk(dist).filter(p=>p.endsWith('.html'))){
  const content=fs.readFileSync(file,'utf8');
  for(const m of content.matchAll(/(?:src|href)="([^"\n]+)"/g)){
    const value=m[1];
    if(/^(https?:|mailto:|data:|#)/.test(value))continue;
    const target=decodeURIComponent(value.split(/[?#]/)[0]);
    if(!target)continue;
    const resolved=target.startsWith('/')?path.resolve(root,'.'+target):path.resolve(path.dirname(file),target);
    htmlLinks.push({document:rel(file),target:value,exists:fs.existsSync(resolved)});
  }
}
const initialJs=[...html.matchAll(/(?:src|href)="\.\/assets\/([^"\n]+\.js)"/g)].map(m=>m[1]);
const sourceFiles=files.filter(p => /apps[\\/]lab-web[\\/](src|tests|scripts)[\\/]/.test(p) || /apps[\\/](lab-shared|lab-server)[\\/]/.test(p));
const output={
  reviewedDate:'2026-10-04',timezone:'Asia/Calcutta',method:'Desk/source and bounded technical/browser audit; no participant study. Product sources and active dist were not edited.',
  freshChecks:{reactTests:{passed:138,total:138,command:'npm run lab:test'},assistantTests:{passed:16,total:16,command:'npm run assistant:test'},root:{command:'npm run check',exitCode:0,prototype:65,scene:25,spatial:16,contrastPairs:14,componentIDs:40},typecheck:{command:'node node_modules/typescript/bin/tsc --noEmit',cwd:'apps/lab-web',exitCode:0},productionBuild:{command:'node node_modules/vite/bin/vite.js build --outDir ../../planning/revisions/U09-audit-build-2026-10-04',cwd:'apps/lab-web',exitCode:0,warnings:['Outside-root audit output was not emptied.','QA-only axe chunk exceeds 500 kB raw.']},preservation:{U02:'852/852; 317 links/assets; 11 protected hashes',U03:'pass',U04:'pass',U05:'pass',U06:'pass',U07:'pass',U08:'pass; 57 byte-identical files and 4 previously approved scoped U08 changes'},productionDependencyAudit:{command:'npm audit --omit=dev --json',cwd:'apps/lab-web',knownVulnerabilities:0,scope:'Registry advisory result at audit time, production dependency graph only; not application security certification.'}},
  buildComparison:{total:buildComparison.length,matching:buildComparison.filter(x=>x.same).length,differences:buildComparison.filter(x=>!x.same)},
  bundleInspection:{bundles,initialJs,initialGzipBytes:bundles.filter(b=>initialJs.includes(path.basename(b.path))).reduce((sum,b)=>sum+b.gzipBytes,0),limitation:'File compression estimate; server uses no content encoding. No network/device/interaction timing or GPU memory measurement.'},
  deliverableInventory:files.filter(p=>/\.(docx|pdf|pptx|odp|mp4|webm|blend|dwg|dxf)$/i.test(p)).map(p=>({path:rel(p),bytes:fs.statSync(p).size})),
  localMarkdownLinks:{documents:documents.length,checked:links.length,broken:links.filter(l=>!l.exists&&!l.copiedBuildTargetExists),sourceTemplateLinks:links.filter(l=>!l.exists&&l.copiedBuildTargetExists),limitation:'File existence only; generated public templates checked in copied dist context. External URLs and fragment correctness not covered.'},
  builtHtmlLinks:{checked:htmlLinks.length,broken:htmlLinks.filter(l=>!l.exists),limitation:'Static src/href file existence only; not external availability or dynamically fetched assets.'},
  sources:sourceFiles.map(file=>({path:rel(file),sha256:hash(file)})),
  assignment:{path:'Final Year Project Assignment.docx',sha256:hash(path.join(root,'Final Year Project Assignment.docx')),extractedText:'apps/lab-web/evidence/u09-audit/assignment-text.txt'},
  browserEvidence:'apps/lab-web/evidence/u09-audit/routes.json'
};
fs.mkdirSync(audit,{recursive:true});
fs.writeFileSync(path.join(audit,'technical-inspection.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({buildComparison:output.buildComparison,initialGzipBytes:output.bundleInspection.initialGzipBytes,markdown:{documents:documents.length,checked:links.length,broken:output.localMarkdownLinks.broken,validBuildTemplateLinks:output.localMarkdownLinks.sourceTemplateLinks.length},html:output.builtHtmlLinks,deliverables:output.deliverableInventory},null,2));
