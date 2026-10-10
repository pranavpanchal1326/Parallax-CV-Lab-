# PARALLAX — P5-B native composition upgrade

Built and reviewed directly in the canonical Figma file on 2 October 2026.

[Open the editorial showcase](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2072-1569). [Open the room-led product atlas](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2065-2587).

## Diagnosis and direction

The earlier Phase 5 catalogue documented reusable components but lost much of the physical lab identity and task-specific composition found in Phase 3. The upgrade uses those earlier studies as its reference: room folio for orientation, time canvas for reservations, graphite stage for experiments, manuscript and evidence margin for reasoning. Paper, ultramarine, restrained phosphor accents and the four established font families connect them.

Research sheets, all creative-direction studies and the 40-family / 87-variant native library remain. The earlier six Phase 4 boards were preserved in history section 2064:173 before synchronizing the active drawings to the existing P4-D room source. The previous project index is preserved as 2074:3046.

## Built compositions

| View | Native node |
|---|---|
| Editorial showcase | 2072:1569 |
| Lab atlas | 2065:2587 |
| Reservation | 2065:2662 |
| Reservation conflict | 2065:2812 |
| Vision workbench | 2065:2954 |
| Device recovery | 2065:3142 |
| Evidence notebook | 2065:3333 |
| Evidence save recovery | 2065:3464 |
| Mobile asset recovery | 2065:3595 |
| 2D plan and asset index | 2070:1494 |
| Signal instrument, 20 Hz | 2070:1612 |
| Sampling comparison, 3 Hz | 2070:1727 |

All screens are native editable layers with reusable navigation and button instances. Room renders are content assets, rather than screenshots of whole interfaces. The six showcase previews are editable copies at 0.6 scale; Figma scaling creates local type overrides. Their text and font sizes were compared against the styled source views and matched.

## Spatial synchronization

Active boards 4A–4F retain their original IDs and presentation structure. Three measured drawing layers now match all 17 source furniture footprints and the current power/data points. CV-04 faces west with a separate 1.2 × 0.9 m approach; its chair does not occupy that approach. The camera axis measures 2.05 m to the actual subject centre, 2.35 m to the backdrop. The discussion table is 2.4 × 0.8 m. Current blockout and detailed studio renders replace earlier images.

The unqualified 24/24 compliance statement was replaced by the 16 geometry/export checks in spatial/exports/upgrade-validation.json. Index and exit-gate counts now agree. These describe conceptual geometry and export integrity; site facts and qualified reviews remain open.

## Review and repairs

Visual review covered the existing research/creative/spatial boards, the new atlas/reservation/instrument/notebook compositions, all three recovery states, mobile asset identity, plan alternative, project index and editorial showcase. Final screenshots are stored alongside this document; earlier captures are historical evidence.

Repairs include a camera-specific mobile illustration, consistent L1 lighting labels, correct Friday date, visible parameter thumbs, native plan identifiers and entry/exit markers. Both reservation states now use identical booking fixtures: the camera is restricted 10:00–11:00, all six resources are free in the proposed 11:00–12:00 interval, and other reservations retain their positions when the selected interval changes.

Native audit: no detected child overflow, unbound solid paint roles, unstyled source text, unresolved instances, missing prototype destinations or leftover placeholders in owned P5-B content. The 95 destination reactions include showcase copies; they are not 95 independent user journeys. The preserved library still has the same 40 family owners and 87 variant IDs.

## Scope and continuation

These are linked design studies. Search, safety, My Lab and Equipment headers are not complete flows. Live reservations, camera capture, inference, persistence, assessment and maintenance services are not implemented. Faculty, technician, preparation/check-in, submission, signage, full responsive behavior and participant validation remain future work.

Continue from these native IDs and compare proposed changes against the original Atlas+ studies. Keep the room source, actual asset identity, honest example labels, recovery context and task-specific hierarchy intact. Use the new showcase for presentation; use the original P5-A boards for component anatomy.

## Build records

revision-state.json records returned IDs and scope; native-audit.json and spatial-audit.json record the passing checks. screens.executed.body.js is the successfully executed initial screen source; screens.body.js is its earlier preparation. Additional, showcase and subsequent refinement scripts are recorded separately. These are bounded execution records, not an idempotent sync command. Inspect the populated file before rerunning or editing.

The initial spatial-sync.body.js was followed by recorded service-marker, equipment-schedule and explanatory-copy refinements. spatial-audit.json describes the verified final geometry. Do not replay that initial body as the final state.

