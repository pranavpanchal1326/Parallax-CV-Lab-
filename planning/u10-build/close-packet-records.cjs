const fs=require('node:fs');
const file='submission/clean-verification.json';
const clean=JSON.parse(fs.readFileSync(file,'utf8')),packet=JSON.parse(fs.readFileSync('apps/lab-web/evidence/packet-checks/integrity.json','utf8'));
clean.packetFollowUp={date:packet.date,applicationFilesUnchanged:packet.applicationFilesUnchanged,attributeOnlyChanges:['submission/presentation.html','submission/demo/index.html','planning/u10-build/build-handoff.cjs'],scans:packet.automatedScans,layouts:packet.layoutChecks,confirmedViolations:packet.confirmedViolations,physicalDeviceOrZoomVerified:false,applicationTestsRepeated:false,evidence:'planning/U10_PACKET_VERIFICATION_2026-10-04.md',consoleLimit:'Observer error reproduces in script-free parent/child; exact browser/tooling integration remains unidentified.'};
const sentence=' The final archive also contains the subsequent attributes-only packet fix; its before/after ledger and nine rendered scans are checked separately. Application source is unchanged.';
if(!clean.scope.includes('subsequent attributes-only packet fix'))clean.scope+=sentence;
fs.writeFileSync(file,JSON.stringify(clean,null,2));console.log('Clean-build receipt supplemented with the bounded packet follow-up.');
