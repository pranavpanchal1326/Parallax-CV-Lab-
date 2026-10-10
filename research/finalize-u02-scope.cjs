const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const edit=(p,fn)=>{const f=path.join(root,p);fs.writeFileSync(f,fn(fs.readFileSync(f,'utf8')));};
edit('research/u02-design-evidence.json',s=>{const ev=JSON.parse(s);const d=ev.decisions.find(d=>d.id==='D-U02-07');d.state='Alternatives exist across prototypes; complete applicable-AA audit remains implementation work; participant validation not conducted and excluded';return JSON.stringify(ev,null,2)+'\n';});
edit('PARALLAX_EXCELLENCE_BLUEPRINT.md',s=>{
 const pairs=[
 ['Research must confirm or revise this premise.','Secondary research informs this premise; local validity remains unverified under the agreed scope.'],
 ['Extend the existing Phase 2 service work with actual findings rather than representing it as a newly discovered gap.','Extend the existing Phase 2 service work with published evidence and explicit design inferences.'],
 ['Verify parity, access, art, performance and participant understanding before changing the primary entry point.','Verify parity, access, art, performance and documented designer-review criteria before changing the primary entry point; user understanding remains unmeasured.'],
 ['retain manual screen-reader and participant checks.','retain manual accessibility checks and explicit unmeasured user-outcome limitations.'],
 ['a participant can identify what changed and what remains unknown','a desk walkthrough identifies changed/unknown fields in the recorded comparison'],
 ['participants can state one supported relationship and one limitation','the model/source explanation states one supported relationship and one limitation'],
 ['a relevant participant understands who must act next','the documented walkthrough names who must act next'],
 ['and participant comprehension note. Test whether viewers identify the main relationship and next action before judging the artwork impressive.','and a designer hierarchy review. Document the intended primary relationship and next action without claiming measured viewer comprehension.'],
 ['Verify data, access and participant understanding before applying the treatment broadly.','Verify data, access and designer-review criteria before applying the treatment broadly; user understanding remains unmeasured.'],
 ['Baseline, requirement/decision ledger and actual research recruitment.','Baseline, requirement/decision ledger and reviewed secondary-source indexing.']
 ];for(const [a,b]of pairs)s=s.replaceAll(a,b);return s;
});
/* R2 delivery wording was edited before the first archive pass. Restore that archived document's R1 wording. */
edit('planning/revisions/U02-R1-before-scope-change/planning/U02_DELIVERY_RECORD.md',s=>{
 if(!s.includes('U02-R2 ·'))return s;
 s=s.replace('U02-R2 · 3 October 2026 · phase: secondary research and design evidence.','U02-R1 · 3 October 2026 · phase: research and design evidence.');
 const a=s.indexOf('**U02 is complete'),b=s.indexOf('\n\n## Delivered',a);
 s=s.slice(0,a)+'**The public desk-research and design package is delivered. Full U02 remains open for local participant validation.** The user authorised using web information; we completed the work that public evidence and the existing project can support. No consented local interviews, surveys, observations or room measurements have occurred.'+s.slice(b);
 s=s.replace('| All twelve hypotheses | [Assumption review and possible counterevidence](../research/U02_HYPOTHESIS_REVIEW.md) | Delivered; unvalidated local assumptions, not pending interviews |','| All twelve hypotheses | [Review and disconfirming evidence](../research/U02_HYPOTHESIS_REVIEW.md) | Delivered; all local statuses remain open |');
 s=s.replace('| Designer evaluation | [Fifteen desk walkthrough checks](../research/U02_DESK_REVIEW.md) | Structural review and implementation limits; no participant outcomes |\n| Historical collection plan | [Unrun protocol](../research/collection-pack/README.md), empty participant CSVs | Excluded from execution; retained for provenance |','| Local collection handoff | [Protocol and seventeen total task IDs](../research/collection-pack/README.md), empty participant CSVs | Prepared, not run; distinct discovery and usability rounds |');
 const g=s.indexOf('## Revised completion gate'),h=s.indexOf('\n## Next implementation',g);
 s=s.slice(0,g)+`## Participant-dependent completion gate

- [ ] Collect consented discovery accounts and real local artefacts; record actual recruitment/access limitations.
- [ ] Observe real preparation/evidence/handover practice and confirm attendance/booking/training ownership.
- [ ] Run neutral usability tasks with the prepared pilot; keep assistance and contradictory evidence.
- [ ] Replace/revise hypothesis persona attributes and journey stages only where collected notes support them.
- [ ] Link actual findings to changed requirements/screens and re-test critical issues.
- [ ] Confirm E01/E06 curriculum fit and AI learning criteria with faculty.
- [ ] Survey room/routes/lighting and obtain qualified physical, ventilation, hazard/CCTV and shutdown-policy review in the appropriate physical phase.

No source can close these local gates on its own. The User Research rubric now has a substantial secondary foundation, but cannot honestly be labelled excellent/validated. U02 also strengthens Problem Analysis, UI/UX and presentation evidence; full marks depend on the remaining research, implementation, safety and submission work.
`+s.slice(h);
 s=s.replace('U09 uses designer/technical checks; no participant collection is scheduled. The report should cite this revision as secondary research, distinguish authored scenarios from empirical findings and state the unmeasured local/user/site outcomes.','Keep U02 participant collection active alongside implementation. The report should cite this revision as desk research, distinguish authored scenarios from real sessions and state the current limitations.');
 s=s.split('\n## Scope revision record')[0];return s.trimEnd()+'\n';
});
console.log('Current blueprint and decision wording reconciled; archived delivery record retains R1 scope.');
