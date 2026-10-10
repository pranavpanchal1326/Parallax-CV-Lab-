/* Document integrity and preservation checks, not usability, source truth or accessibility certification. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const reg=json('research/u02-sources.json'), ev=json('research/u02-design-evidence.json'), boards=json('design/wireframes/boards.json');
const sourceIds=new Set(reg.sources.map(s=>s.id)), hypothesisIds=new Set(ev.hypotheses.map(h=>h.id)), decisionIds=new Set(ev.decisions.map(d=>d.id)), requirementIds=new Set(ev.requirements.map(r=>r.id)), boardIds=new Set(boards.map(b=>b.id));
let checks=0;const failures=[];
function check(condition,message){checks++;if(!condition)failures.push(message);}
function refs(ids,set,where){check(Array.isArray(ids)&&ids.every(id=>set.has(id)),where+' has unresolved references');}
check(reg.sources.length===14&&sourceIds.size===14,'Fourteen unique source IDs required');
check(ev.hypotheses.length===12&&hypothesisIds.size===12,'Twelve unique hypotheses required');
check(ev.decisions.length===8&&decisionIds.size===8,'Eight unique decision IDs required');
check(ev.requirements.length===20&&requirementIds.size===20,'Twenty unique original requirements required');
check(boards.length===15&&boardIds.size===15,'Fifteen unique wireframes required');
check(reg.localParticipants===0&&ev.localValidation==='not-conducted'&&ev.phaseStatus==='complete'&&ev.primaryResearchScope==='excluded-by-user','Desk-only scope or no-participant boundary changed');
const previousSources=json('planning/revisions/U02-R1-before-scope-change/research/u02-sources.json');
check(JSON.stringify(reg.sources)===JSON.stringify(previousSources.sources),'Published source records/access limits changed during scope revision');
const currentPhase=fs.readFileSync(path.join(root,'planning/EXCELLENCE_EXECUTION_PHASES.md'),'utf8').split(/\r?\n/).find(line=>line.startsWith('| U02 ·'));
check(currentPhase&&currentPhase.includes('Complete — U02-R2')&&currentPhase.includes('excluded'),'U02 phase tracker does not reflect the agreed scope');
const access=new Set(['full','abstract','indexed-partial','full-main-correction-unread']);
for(const s of reg.sources){
 check(/^https:\/\//.test(s.url)&&access.has(s.access)&&[s.title,s.authors,s.date,s.type,s.locator,s.finding,s.limit,s.implication].every(v=>typeof v==='string'&&v.trim().length>0),s.id+' incomplete source metadata or access label');
}
check(reg.sources.find(s=>s.id==='S11').access==='full-main-correction-unread','S11 correction limitation must remain explicit');
for(const h of ev.hypotheses){refs(h.sources,sourceIds,h.id);check(h.status.startsWith('Unvalidated')&&h.test&&h.counter,h.id+' must retain local test/counterevidence');}
for(const d of ev.decisions){refs(d.sources,sourceIds,d.id);check([d.chosen,d.alternative,d.reason,d.state,d.gate].every(v=>v&&v.length>10),d.id+' incomplete decision');}
for(const r of ev.requirements){refs(r.sources,sourceIds,r.id+' sources');refs(r.hypotheses,hypothesisIds,r.id+' hypotheses');refs(r.decisions,decisionIds,r.id+' decisions');refs(r.wireframes,boardIds,r.id+' wireframes');check(r.wireframes.length>0&&r.test&&r.state,r.id+' missing coverage or boundary');}
for(const b of boards){check(Boolean(b.research&&b.research.boundary),b.id+' missing research annotation');if(!b.research)continue;refs(b.research.sources,sourceIds,b.id+' sources');refs(b.research.decisions,decisionIds,b.id+' decisions');refs(b.research.requirements,requirementIds,b.id+' requirements');check(fs.existsSync(path.join(root,'design/wireframes/svg',b.id+'.svg')),b.id+' SVG absent');}
const original=json('planning/revisions/U02-pre-web/boards.json');
for(const b of original){const now=boards.find(x=>x.id===b.id);const shape=x=>x.blocks.map(v=>({box:v.box,kind:v.kind}));check(Boolean(now)&&now.route===b.route&&(b.id==='WF08'?JSON.stringify(shape(now))===JSON.stringify(shape(b)):JSON.stringify(now.blocks)===JSON.stringify(b.blocks)),b.id+' original layout or route changed');}
check(boards.find(b=>b.id==='WF08').next.includes('E01 fixed-bench')&&!boards.find(b=>b.id==='WF08').blocks[2].lines.join(' ').includes('Return kit'),'E01 receipt must not require a portable-kit return');
check(ev.storyboard.length===7,'Seven storyboard frames required');
for(const f of ev.storyboard){check(fs.existsSync(path.join(root,f.image))&&f.alt&&f.origin&&f.test,f.id+' missing actual asset/annotation');refs([f.decision],decisionIds,f.id+' decision');refs([f.wireframe],boardIds,f.id+' board');}
for(const filename of ['sessions.csv','observations.csv','findings.csv']){
 const lines=fs.readFileSync(path.join(root,'research/collection-pack',filename),'utf8').trim().split(/\r?\n/);
 check(lines.length===1&&lines[0].includes(','),filename+' no longer header-only; actual research evidence must be reviewed separately');
}
const baseline=json('apps/lab-web/evidence/ex-2.2-preservation.json');
const preservation=baseline.files.map(f=>{const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f.path))).digest('hex');return{path:f.path,sha256:hash,unchanged:hash===f.sha256};});
for(const f of preservation)check(f.unchanged,f.path+' changed from preserved EX-2.2 source');
const htmlPaths=['design/research-u02/index.html','design/wireframes/index.html'];
const reviewHtml=fs.readFileSync(path.join(root,htmlPaths[0]),'utf8');
check(reviewHtml.includes('U02 complete: secondary research and design analysis.')&&!reviewHtml.includes('participant-dependent gate remains open')&&!reviewHtml.includes('Collect the evidence that only local users can provide.'),'Rendered review retains a mandatory participant gate');
let localLinks=0;
for(const filename of htmlPaths){
 const html=fs.readFileSync(path.join(root,filename),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 check(new Set(ids).size===ids.length,filename+' duplicate IDs');
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const href=m[1].replaceAll('&amp;','&');if(/^(https?:|data:|mailto:)/.test(href))continue;
  const [file,anchor]=href.split('#');const target=file?path.resolve(root,path.dirname(filename),decodeURIComponent(file)):path.join(root,filename);
  localLinks++;check(target.startsWith(root+path.sep)&&fs.existsSync(target),filename+' broken local asset/link: '+href);
  if(anchor&&target.endsWith('.html')&&!anchor.startsWith('/')){
   const targetHtml=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';check(targetHtml.includes('id="'+anchor+'"'),filename+' unresolved HTML anchor: '+href);
  }
 }
}
const csv=fs.readFileSync(path.join(root,'research/U02_TRACEABILITY.csv'),'utf8').trim().split(/\r?\n/);
check(csv.length===21&&csv.slice(1).every((line,i)=>line.startsWith('"R'+String(i+1).padStart(2,'0')+'",')),'CSV requirement order/count differs from original contract');
const result={revision:'U02-R2',date:'2026-10-03',checks,passed:checks-failures.length,failures,localLinks,sourceCount:reg.sources.length,hypothesisCount:ev.hypotheses.length,requirementCount:ev.requirements.length,wireframeCount:boards.length,storyFrameCount:ev.storyboard.length,localParticipants:reg.localParticipants,localValidation:ev.localValidation,phaseStatus:ev.phaseStatus,methodology:ev.methodology,primaryResearchScope:ev.primaryResearchScope,preservation};
fs.mkdirSync(path.join(root,'research/evidence'),{recursive:true});fs.writeFileSync(path.join(root,'research/evidence/u02-integrity.json'),JSON.stringify(result,null,2)+'\n');
console.log(`U02 integrity: ${result.passed}/${checks} passed; ${localLinks} local links/assets; ${preservation.filter(f=>f.unchanged).length}/${preservation.length} preserved source hashes. U02 complete under desk-only scope; local validation not conducted.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
