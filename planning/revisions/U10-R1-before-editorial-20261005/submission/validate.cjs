const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const targets=['submission/index.html','submission/README.md','submission/EVIDENCE_INDEX.md','submission/presentation.html','submission/demo/index.html'];
let checkedLinks=0;
for(const source of targets){
 const s=read(source),links=[...s.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
 if(source.endsWith('.md'))links.push(...[...s.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]));
 for(const link of links){if(/^(?:https?:|blob:|data:|#)/.test(link))continue;const clean=decodeURIComponent(link.split(/[?#]/)[0]);if(!clean)continue;const p=path.resolve(path.dirname(path.join(root,source)),clean);assert.ok(p.startsWith(root+path.sep),'Link outside package');assert.ok(fs.existsSync(p),source+' missing '+link);checkedLinks++;}
}
const timing=json('submission/demo/rehearsal-receipt.json');assert.equal(timing.complete,true);assert.equal(timing.entries.length,15);assert.ok(timing.elapsedSeconds>=900&&timing.elapsedSeconds<910);assert.match(timing.method,/no human speech/);
const movie=json('submission/demo/recording-receipt.json'),bytes=fs.readFileSync(path.join(root,'submission/demo/PARALLAX-Recorded-Walkthrough.webm'));assert.equal(bytes.length,movie.bytes);assert.equal(bytes.subarray(0,4).toString('hex'),'1a45dfa3');assert.equal(movie.frames,10);assert.ok(movie.elapsedSeconds>=80);
const deck=json('submission/presentation-validation.json');assert.equal(deck.finalSha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'submission/PARALLAX-Presentation-Final.pptx'))).digest('hex'));assert.equal(deck.packageIntegrity.status,'pass');
const clean=json('submission/clean-verification.json');assert.ok(clean.checks.length===4&&clean.checks.every(c=>c.exitCode===0));
const result={revision:'U10-R1',localLinks:checkedLinks,deckHash:'pass',webmBytes:bytes.length,technicalTraversalSeconds:timing.elapsedSeconds,cleanSourceChecks:'pass',externalChecksStillOpen:true,scope:'Artifact/source checks, rendered review and technical traversal; no human rehearsal, full access/device or institutional approval claim.'};
fs.writeFileSync(path.join(root,'submission/validation.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
