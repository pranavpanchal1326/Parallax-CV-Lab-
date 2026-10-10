# PARALLAX research collection pack — U02

3 October 2026 · **prepared, not run** · actual participants: 0.

Use this pack with `../PHASE_09_TEST_PLAN.md`. Keep the existing target: five students, two technicians and one or two faculty members. This is a small convenience sample; it cannot establish population-wide success rates. Recruit varied familiarity and, where possible, keyboard and screen-reader users. Do not replace real research with generated personas, invented quotations or scripted test output.

## Before recruitment

Confirm access, deadline year, team roles and the institution's research requirements. Assign a facilitator and note-taker. Keep participant contact details and consent documents outside the repository in institution-approved storage. Repository notes use pseudonyms only (P-ST01, P-TE01, P-FA01); do not record student IDs, names, assessment grades or identifiable screenshots.

Explain: “We are studying the design, not testing you. Participation is voluntary. You may skip a question or stop. We will take anonymised notes about how you use this prototype. It contains example records, generated signals and simulated environment readings. It does not control equipment or assess your work.” Obtain the institution's required consent before collecting notes. Recording is optional and needs separate consent. Ask about access needs without requesting medical details. Agree storage location, who can access notes and a retention/deletion date before each session; do not promise unlimited confidentiality.

## Discovery interview — 15–20 minutes

Ask before demonstrating the product; avoid explaining features until their account is complete.

1. Tell me about the last practical session you attended or supported. Start from how you found out what you needed.
2. What did you prepare, and how did you know it was enough?
3. Tell me about a time equipment, room conditions or a booking changed your plan. What did you do next?
4. How did you record the method, settings and evidence? What was difficult to reconstruct later?
5. How do you decide whether an equipment message needs attention? Who would you contact?
6. What happens when a record does not save, a receipt is missing or a device stops?
7. How do you close a session and account for the kit? What happens to missing items?
8. Where do you get help during a practical? Tell me about an answer you had to verify.
9. What information about room conditions or energy use would change a decision you actually make?
10. Is there anything we have missed that gets in the way of your work?

Probe with “What happened next?”, “Can you show an example without personal data?” and “How did you know?” Separate observed behaviour, participant account and researcher inference. Do not ask “Would you like our AI?” or “Is this dashboard useful?” before a concrete task.

Technician probes: handover ownership; impact on bookings; conditions for restricting/releasing equipment; maintenance records; essential circuits. Faculty probes: teaching readiness; evidence expectations; assessment boundaries; attendance correction; late changes. Never ask participants to operate real equipment for prototype research.

## Task observation — 20–30 minutes

Run T1–T10 from the existing test plan. Add these optional tests only after the core tasks, using a fresh example session:

| Task | Neutral instruction | Research question |
|---|---|---|
| U-T11 | “Find out what needs attention in this lab.” | Can they distinguish equipment restrictions, occupancy, pending receipts and environmental uncertainty? |
| U-T12 | “Explain what this temperature reading tells you and what it does not.” Show a delayed example. | Do they notice the source and observation age rather than assuming the room is safe? |
| U-T13 | “Review whether these lights could be put into standby during the next 15 minutes.” | Do they notice a booking and understand the modelled upper bound? |
| U-T14 | “Compare the two recorded conditions. Tell me what changed and what you can conclude.” | Can they distinguish retained observations from the current scenario, and differences from causation? |

Do not hint at timestamps, protection or provenance in the instruction. Ask participants to state expectations before acting. Record help exactly; do not silently convert assisted completion to unaided success. Do not time access setup as task performance. Failed prototype routes are prototype defects, not participant errors.

## Capture and synthesis

The CSVs contain headers only. Duplicate them outside source control for collection if needed:

- `sessions.csv`: participant/role/device, consent status, access setup, retention agreement. No identities.
- `observations.csv`: one row per event/task, evidence reference, verbatim words only when actually spoken, help/outcome and researcher interpretation in separate columns.
- `findings.csv`: consolidate actual evidence; link findings to existing hypothesis/requirement IDs, change and re-test. A hypothesis ID alone is not evidence.

Read the notes together, code recurring behaviour and contradictions, then revise personas and the journey map. Distinguish direct observation from reported experience and interpretation. A single critical misunderstanding can justify a fix; do not invent statistical significance or convert small-sample counts into generalised percentages. Report the denominator, missing data and recruitment limits.

Use the critical/major/minor definitions in the existing plan. Critical findings require correction and re-test with at least two people before submission. Keep rejected concepts and the reason, not just the chosen design. Negative findings and unresolved defects belong in the report.

## Status and honest completion gate

This pack closes collection preparation only. The [public desk research and design synthesis](../U02_RESEARCH_SYNTHESIS.md) is delivered separately. U02 participant validation remains open until actual consented sessions, anonymised evidence, local synthesis and traceable changes exist. Wireframes in `../../design/wireframes/` are reconstructed/new design evidence, not evidence of participant validation.


## U02-R1 supplementary operational tasks

Use the P- participant prefix to avoid confusion with source IDs S01–S14. The original discovery plan targets 6–8 students, 2–3 faculty and 1–2 technicians; the smaller usability pilot above is a different round. Both are unrun. Report actual recruitment and role/access coverage, not planned counts. AI evaluation in U06 also needs an unaided reasoning task after a hint.

| Task | Neutral instruction | Evaluate / surface boundary |
|---|---|---|
| U-T15 · faculty | Review this upcoming session. What would you do next, and why? | Distinguish preparation, permission, resources and understanding; WF13/original Figma, not a new React route. |
| U-T16 · faculty | This person's attendance record needs correcting. Show how you would make and check the change. | Intended record, reason, saved result and audit history; WF14/original Figma, with simulated outcomes labelled. |
| U-T17 · technician | This asset is moving to another known location. Show how you would record and check that. | Movement versus availability/release and stale record recovery; WF15 is an authored concept. |

For static wireframes, record expectations and comprehension rather than claiming real action completion. Do not cue users with field names or expected failure causes.
