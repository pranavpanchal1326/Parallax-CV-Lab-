const fs=require('node:fs'),crypto=require('node:crypto');
const baseline=JSON.parse(fs.readFileSync('planning/revisions/U09-before-implementation/manifest.json','utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const reasons={
 'apps/lab-web/scripts/validate-u08.cjs':'Preserve the original U08 release gate using archived pre-U09 sources; independently assert reviewed U09 after hashes.',
 'apps/lab-web/scripts/build-map.cjs':'Copied renderer owns frame/visibility/detach/disposal resources; superseded highlight clones are released and base materials retained for final disposal; projected plan shapes/names refresh while preserving focus; original source preserved.',
 'apps/lab-web/scripts/build-rehearsal.cjs':'Copied renderer settles on demand and owns resources; scientific blocks preserved.',
 'apps/lab-web/src/app/App.tsx':'Current edition copy, explicit QA metrics and private exact-text export recovery.',
 'apps/lab-web/src/components/AccessReview.tsx':'Capture starting route and invalidate late results; retain the engine lock across navigation and skip obsolete work after dynamic import.',
 'apps/lab-web/src/features/GeometryRehearsal.tsx':'Current guide link and explicitly gated local lifecycle diagnostics.',
 'apps/lab-web/src/features/Mobile.tsx':'Explicit text type restores inherited 16 px / 44 px field styling.',
 'apps/lab-web/src/features/OperationsDesk.tsx':'Shared exact-text export recovery; operations domain unchanged.',
 'apps/lab-web/src/features/Rehearsal.tsx':'Shared exact-text export recovery and current guide link; model unchanged.'
};
const changes=baseline.sources.filter(row=>hash(row.path)!==row.sha256).map(row=>{if(!reasons[row.path])throw Error('Unapproved source change '+row.path);return {path:row.path,beforeSha256:row.sha256,afterSha256:hash(row.path),reason:reasons[row.path]};});
if(changes.length!==9)throw Error('Unexpected source change count');
const additions=['apps/lab-web/src/components/ExportFallback.tsx','apps/lab-web/src/components/PerformanceReview.tsx','apps/lab-web/tests/export.test.ts','apps/lab-web/scripts/validate-u09.cjs'].map(path=>({path,sha256:hash(path)}));
fs.writeFileSync('apps/lab-web/evidence/u09-final/source-change-ledger.json',JSON.stringify({revision:'U09-R1',date:'2026-10-04',changes,additions,historicalU08Validation:'Existing U08 gate evaluates preserved pre-U09 files for the eight declared changes, while requiring current after hashes. Other files and scientific/art hashes retain the original checks.'},null,2));
console.log('Sealed eight implementation changes, one preservation-validator extension and four additions against 76 pre-U09 source hashes.');
