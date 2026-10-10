# Phase 1–4 Independent Completion Review

Historical audit of P4-C. Subsequent user-authorised fixes are recorded in `upgrade-report.md` and `../spatial/PHASE_04_SPACE_AND_3D.md`. R01 and the measurement mismatch in R02 are corrected geometrically in P4-D; R05 documentation is replaced; the R06 browser-load test has now run. Research, creative approval and Figma-access gates remain open. Original findings below are retained as the before-state, not current measurements.

Review date: 2 October 2026, Asia/Calcutta.
Request: independently verify the user's statement that phases through Phase 4 are done.
Method: local artifact inspection, documentation review, visual inspection of four renders, geometry calculations, GLB parsing, and attempted read-only access to the canonical Figma file.
Review scope: completion gates and consistency; no product or external design edits.
Evidence: [Machine-readable checks](phase-01-04-audit-evidence.json).
Reproducible check: `node .design/phase-01-04-audit-checks.cjs`.

## Verdict

Substantial work exists for all four phases.
Phase 1 planning is complete.
Phase 2's planning and hypothesis deliverables are substantially complete; user evidence and navigation validation remain open.
Phase 3 has a documented recommended direction, but its own exit checklist is not closed and current Figma visuals could not be independently accessed.
Phase 4 has a real conceptual geometry source, renders, and a structurally valid model export. Full sign-off is conditional on unresolved spatial checks and the browser-viewer test.

The statement "all four phases are fully signed off" is not supported by the currently accessible evidence.
The work does not need to restart; close the named gaps and refresh the review.

## Phase status matrix

| Phase | Work present | Review status | Remaining gate |
|---|---|---|---|
| 1 Definition | Design brief, 426-line execution brief, decision register, master plan | Complete as planning | Site, equipment, and deadline facts are still explicitly open |
| 2 Research and experience | Research plan, assumption map, six hypothesis personas, three empathy maps, journeys, service blueprint, 20 requirements, IA, ten flows, activity inventory, E01/E06 definitions | Complete as provisional experience planning | Interviews/observation/artefacts/card sort/curriculum fit pending |
| 3 Creative direction | Local report records 18 comparative frames, contrast values, critique, Atlas+ recommendation and extended states | Developed; final gate open; visual artifact inspection limited | Team critique, five-second tests, sign-off date/token freeze |
| 4 Physical and 3D | P4-C geometry, two build scripts, four renders, GLB, statistics, conceptual plan report | Foundation verified; conditional completion | Route overlap, capture-distance rule mismatch, viewer test, revision consistency |

## Findings by priority

### R01 High — occupied accessible station reduces the designated route

Evidence:
- Geometry source sets the main spine to 1.5 m deep, beginning at y = 3.9 m.
- CV-04 desk front is y = 2.45 + 0.7 = 3.15 m.
- The planned clear-floor depth is 1.2 m, ending at y = 4.35 m.
- That planned space overlaps the spine by 0.45 m.
- Remaining spine depth during use is therefore 1.05 m.
- Phase 4 already labels this conditional, while its headline states 24/24 checks pass.

Implication:
The model passes an empty-room dimensional check but has an unresolved simultaneous-use condition.
It does not yet demonstrate the stated 1.5 m route target while the accessible station is occupied.
This is a geometric finding against the project's own rule, not an independent statutory compliance verdict.

Required closure:
Revise station orientation/location or provide a clear-floor arrangement outside the required route.
Alternatively, document an institution-reviewed route interpretation that resolves the condition.
Re-run the geometry and seated-use checks.
Do not describe the conditional row as an unconditional pass.

References:
- [Geometry](../spatial/lab_geometry.json).
- [Phase 4 report](../spatial/PHASE_04_SPACE_AND_3D.md).
- [Official accessibility-guidelines listing](https://depwd.gov.in/en/document/harmonised-guidelines-standards-for-universal-accessibility-in-india-2021/).

### R02 Medium — capture-distance check measures the wrong endpoint

Evidence:
- Camera footprint centre is (7.8, 1.9) m.
- Object-stage footprint centre is (9.4, 1.9) m.
- Distance between those centres is 1.6 m.
- Camera axis terminates at backdrop x = 9.85 m, giving 2.05 m.
- The JSON's 2.0 m planning rule says it is for framing the object stage.
- The Phase 4 baseline check reports camera-to-backdrop 2.05 m as passing.

Implication:
The stated planning rule and the measurement used to evaluate it are inconsistent.
A 1.6 m working distance may or may not be appropriate for the actual lens and object; the artifact does not establish that.

Required closure:
Define the intended camera reference point and subject plane.
Specify field of view or focal length, object extent, and clearance around the tripod.
Either revise the setup to meet the actual rule or replace the generic 2.0 m assumption with a justified framing study.
Keep backdrop distance as a separate measurement.

### R03 High for sign-off — Phase 3 gate remains explicitly open

Evidence:
- Creative-direction report begins "recommended, pending team critique and five-second tests".
- Three unchecked items remain: team critique, M7 five-second tests, and dated sign-off/token freeze.
- The report states that all studies share one layout skeleton and differ in tokens, type, radius, and artwork.
- No local screen images or exported design-review PDF were found.

Implication:
The direction is developed and internally critiqued, but final acceptance is not documented.
Palette contrast tables do not establish task comprehension, visual originality, or complete accessibility.
A shared study skeleton is useful for comparison; it does not yet prove the user's requested page-specific artistic composition.

Required closure:
Review the actual representative frames and selected direction.
Test the next-action comprehension on booking and workbench.
Evaluate task-derived composition across entry, booking, workbench, and results.
Record the chosen direction and date before freezing tokens.

### R04 Review limitation — canonical Figma artifact could not be independently inspected

Evidence:
- Documented file: https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF.
- Figma metadata and identity tools returned unknown-tool errors in this session.
- Browser fallback opened the exact documented URL.
- Browser showed "we couldn't find that one" and that the file may be unavailable.

Implication:
This review cannot independently confirm the claimed 18 frames, board layout, source-frame paints, target sizes, or dimensioned Figma plan.
The failure does not establish that the file was deleted; account, availability, or connection state may explain it.

Required closure:
Restore a working read connection or provide a current accessible project link.
An exported screen/board package would also permit visual review.
Do not treat local documentation as a substitute for visual inspection.

### R05 Medium — Phase 4 report mixes current and superseded figures

Evidence:
- Opening layout table uses CMP 26.24, C1 11.48, and spine 12.00 m².
- Current JSON and P4-C table use CMP 24.96, C1 10.92, and spine 15.00 m².
- Early prose describes the spine as 1.2 m; P4-C uses 1.5 m.
- Export-test table says 1,224 triangles / 147,392 bytes / 102 mesh objects.
- Current export is 1,272 triangles / 152,844 bytes / 106 mesh nodes.
- Earlier FI-1/FI-2 sections remain present after later sections mark them closed.

Implication:
A reviewer can quote obsolete measurements as if they were current.
The data source itself is consistent; the narrative requires revision hygiene.

Required closure:
Lead with P4-C only.
Move prior figures into an explicitly labelled revision appendix.
Give every check a current, conditional, or superseded status.
Link the current statistics file.

### R06 Medium — browser export test is still uncompleted

Evidence:
- A glTF 2.0 binary export exists and parses successfully.
- Header declared length equals actual length.
- Mesh and triangle totals match the statistics record.
- Furniture identifiers are preserved as node names or prefixes.
- Phase 4 explicitly lists loading the model in the chosen browser viewer and checking materials as pending.
- No browser viewer or test result exists in the local workspace inventory.

Implication:
Export structure is verified.
Browser materials, scale, scene readability, selection, and fallback are not verified.
This is one of the Phase 4 exit dependencies in the execution brief.

Required closure:
Load the GLB in the selected viewer.
Compare it with the reference render and known dimensions.
Inspect representative material colours, cutaway walls, asset names, and geometry scale.
Record a screenshot and model load outcome.
Test unavailable-WebGL or static fallback in the later interaction phase.

### R07 Medium — Phase 2 is a hypothesis-led package

Evidence:
- Research report explicitly marks persona, empathy, and problem content as hypotheses.
- Interview and observation plans are present.
- Five research/curriculum gate items remain unchecked.
- No participant evidence or raw room audit was found in the workspace.

Implication:
The planning package is useful and honestly labelled.
It is not a completed empirical user-research study.
Secondary sources cannot validate these local user claims by themselves.

Required closure:
Keep the distinction in the submission.
Recruit and observe when practical, or document a desk-research-only limitation.
Update requirements when evidence contradicts hypotheses.
Avoid treating invented hypothesis statements as participant quotations.

### R08 Low — current renders are foundations, not finished physical visualisation

Observed:
- Room zoning, repeated stations, capture enclosure, and the wave-to-pixel sculpture are visible.
- Blockout and hero render share a recognisable arrangement.
- Devices, chairs, lighting supports, materials, and wall markers remain simplified.
- Screens are coloured rectangles rather than experiment displays.
- Signal instruments and detailed kit-storage functions are not yet visually represented.
- Bright low-contrast surfaces reduce readability of furniture edges in several views.

Implication:
The renders are appropriate evidence of Phase 4 blockout and concept work.
They do not yet justify calling the interior presentation finished or exhibit-quality.
Refinement belongs in Phase 8 rather than requiring a restart of Phase 4.

Required later work:
Add representative signal/vision equipment and meaningful screen content.
Refine light/material separation and physical details.
Validate chair spacing, working postures, and actual equipment footprints.
Retain simplified technical views alongside presentation renders.

## Independently verified calculations

| Check | Result |
|---|---|
| Room footprint | 10 × 7 = 70 m² |
| Current zone total | 70 m² |
| Overlapping zone rectangles | None |
| Furniture rectangles outside room | None |
| Overlapping furniture rectangles | None |
| GLB format/version | glTF binary, version 2 |
| Declared/actual file length | 152,844 / 152,844 bytes |
| Chunk boundaries | End at file length |
| Mesh nodes | 106 |
| Triangle count from accessors | 1,272 |
| Statistics record | Matches counts and size |
| Furniture ID prefixes in GLB | All present |
| Accessible floor/spine overlap | 0.45 m |
| Remaining spine during planned clear-floor occupation | 1.05 m |
| Camera-to-stage footprint centres | 1.6 m |
| Camera-to-backdrop axis | 2.05 m |

These checks do not test human reach, door hardware, external egress, lighting simulation, ventilation, electrical protection, or full accessibility.
Furniture-footprint non-overlap excludes user bodies, chairs added by the hero script, operating clearances, doors, and cables.
A floor partition totalling 70 m² does not establish an approved occupancy.

## Visual evidence inspected

- [Blockout isometric](../spatial/renders/blockout_iso.png).
- [Blockout entry](../spatial/renders/blockout_entry.png).
- [Hero isometric](../spatial/renders/hero_iso.png).
- [Hero eye-level](../spatial/renders/hero_eye.png).

Images were viewed directly, not inferred from their filenames.
No Figma visual claim is marked independently verified.

## Minimum closure before Phase 5 production freeze

1. Restore visual access and inspect the actual selected creative direction.
2. Close Phase 3's critique/sign-off gate without inventing user-test results.
3. Resolve or explicitly review the CV-04 route overlap.
4. Correct the camera framing measurement/rule.
5. Complete the GLB browser load test.
6. Publish one current Phase 4 summary with conditional checks identified.
7. Keep Phase 2's evidence status visible and schedule validation where available.

Phase 5 exploratory component work can proceed under provisional decisions.
Final token and spatial commitments should wait for the relevant closures.

## Changes made by this review

Created only:
- This review report.
- A small read-only artifact-check script.
- Machine-readable audit evidence.

No research, geometry, render, Figma design, or completion checkbox was changed.

