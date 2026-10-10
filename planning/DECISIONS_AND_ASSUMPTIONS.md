# Decisions and Assumptions

Updated: 2 October 2026, Asia/Calcutta.
Source context: user direction, assignment, master blueprint, and Phase 1 checks.

## Decision states

- Locked: a planning commitment derived from the brief or user request.
- Candidate: a proposed choice to compare or validate.
- Verified: a fact observed through documents or tools.
- Open: a fact not established.
- Superseded: a previous plan replaced by a dated decision.

## Locked decisions

| ID | Decision | Rationale | Revisit condition |
|---|---|---|---|
| D01 | Design all 34 page families; prioritise production | Preserve whole-system scope and build coherence | User changes scope |
| D02 | Student experiment journey is the backbone | Connect booking, equipment, learning, and evidence | Research disproves the task model |
| D03 | Include signal and vision demonstrators | Match the selected laboratory subject | Curriculum changes |
| D04 | Include Scene Studio and a fault exception | Demonstrate useful innovation and operational depth | Equipment or assessment constraints |
| D05 | Compare three visual directions on identical content | Evaluate actual craft before mass production | User selects an existing direction |
| D06 | Local Blender is the baseline authoring route | Executable verified; avoids reliance on an unverified provider | Export/render test fails |
| D07 | Label simulation and future integration | Keep the demonstrator technically credible | Integration becomes verified |
| D08 | Add explicit attendance correction and movement history | Assignment requires attendance and asset tracking | Institutional workflow differs |
| D09 | Preserve scientific evidence fidelity | Visual styling must not distort findings | A clearly separated editorial asset is created |
| D10 | Essential 3D tasks have non-3D alternatives | Support access and device limitations | No removal without task-equivalent replacement |

## Candidate decisions

| ID | Proposal | Validation phase |
|---|---|---|
| CAND01 | Working name PARALLAX | 3 |
| CAND02 | Living atlas of perception concept | 3 |
| CAND03 | Ivory/ultramarine visual foundation | 3 |
| CAND04 | Signal-to-pixel architectural sculpture | 4 |
| CAND05 | Six shared workstations | 4 |
| CAND06 | E06 lighting/detection flagship | 2 |
| CAND07 | E01 sampling or E02 filtering signal journey | 2 |
| CAND08 | Browser 3D engine selection | 4/8 |
| CAND09 | Figma as canonical interface source | File access test before production |
| CAND10 | Canva final presentation | 10 |

## Open facts

| ID | Unknown | Current handling | Confirmation needed |
|---|---|---|---|
| A01 | Submission deadline/year | No calendar promise | User or institution |
| A02 | Existing versus hypothetical room | Conceptual envelope labelled | User or site |
| A03 | Dimensions, doors, windows, fixed services | No final room-specific fit claim | Site plan or measurements |
| A04 | Equipment inventory | Resource categories only | Actual inventory |
| A05 | Class capacity/access/booking policies | Hypothesis workflows | Faculty/technician |
| A06 | Research participants | Research plan only | Consented recruitment |
| A07 | Editable Figma project destination | No external file edit assumed | Project URL and access |
| A08 | CAD route | Specification and drawing deliverables planned | Available tool/export test |
| A09 | Sensor and hardware integration | Labelled simulation | Actual APIs and tests |
| A10 | People capture/data handling | Object-only sample direction | Institutional policy |

## Verified capability evidence

| Check | Result | Limitation |
|---|---|---|
| Workspace inventory | Assignment and master blueprint present | No existing application or model |
| Assignment extraction | Requirements and 100-mark rubric re-read | Deadline year remains absent |
| Master blueprint | 34 pages, 40 components, 12 experiments, 10 workflows | Counts do not establish craft |
| Blender version | 5.2.2 LTS returned successfully | Render/export execution untested |
| Figma authentication | Successful; Starter/View seat reported | Specific file write not tested |
| Canva search | Successful; no PARALLAX match | No design created |
| Tool inventory | No Meshy/Tripo callable tool exposed in this check | Not a claim that no integration exists elsewhere |
| Standard CAD paths | No AutoCAD/FreeCAD found in checked paths | Narrow check, not exhaustive |
| Node executable | Found | No web project built |
| Python command | WindowsApps alias found | Runtime not verified |

## Phase 9 updates — 3 October 2026

| ID | Decision | Evidence | Affected artifacts | Next verification |
|---|---|---|---|---|
| D11 | The prototype is the Figma pages plus a runnable web demonstrator (resolves G30.12) | Figma cannot carry a record change between frames; blueprint §34 and G23.15 require it | `prototype/`, `design/phase-08/assets/lab-map.js`, `design/PHASE_09_PROTOTYPE_AND_VERIFICATION.md` | Participant sessions in `research/PHASE_09_TEST_PLAN.md` |
| D12 | A restriction or an unlocated item marks every open booking that holds it | Rule in `prototype/store.js`; 65 of 65 checks | Technician console, booking views | Confirm against real booking policy (A05) |

Still open after Phase 9: A05 and A06 (participants and policies) block the test sessions; A09 (device APIs) keeps all evidence simulated.

## Phase 2 updates — 2 October 2026

| ID | Change | Evidence | Affected artifacts |
|---|---|---|---|
| D11 | Phase 2 boards use a neutral "research document" system (paper, ink, evidence-status chips) rather than the candidate product palette | Keeps F04 intact: product palette stays open until Phase 3 | Figma file, foundations page |
| D12 | Every Phase 2 claim carries an evidence tag: H, I, O, A, D or ? | Research integrity rule G09.15, Q09 | Research doc, all boards |
| CAND07 → Recommended | E01 Sampling and aliasing as the primary signal journey; E02 secondary | Weighted designer scoring 56/60 vs 40/60 (arithmetic corrected from an earlier 58/42); curriculum fit still open | Research doc §9 |
| Verified | Figma design file created: `pHYpJXqlaHOSAs1Q6kmzIu` | `create_new_file` succeeded; write access confirmed | A07 partially resolved |
| Verified constraint | Figma Starter plan allows 3 pages per file | `createPage` refused the 3rd+ page | Sheets laid out on one canvas page |
| Verified constraint | Figma Starter plan caps MCP tool calls | Rate-limit error after Sheet 04 | Sheets 05–09 pending in Figma; full content exists in `research/PHASE_02_RESEARCH_AND_EXPERIENCE.md` |

## Official-text review — 2 October 2026 (geometry P4-C)

| ID | Change | Evidence | Status |
|---|---|---|---|
| D26 | Main spine 1.5 m (supersedes 1.2 m) | HG 2021 cl. 4.4.1(2), official text | Locked |
| D27 | Computing aisle 1.0 m | HG 2021 cl. 4.4.1(4): office areas ≥ 0.9 m | Locked |
| D28 | Kit bays open into computing; blackout partition closes C1 | Closes FI-2; removes traffic through capture (H10) | Locked |
| D29 | S1 bench 0.6 m deep | Closes FI-1 | Locked |
| D30 | Sockets at desk level 0.9 m; controls ≥ 0.4 m from corners | HG 2021 cl. 4.15 | Locked |
| D31 | Knee clearance spec 680 mm (supersedes 650) | HG 2021 cl. 4.3(5) | Locked |
| Verified | 24 / 24 checks pass | Sheet 4A (P4-C) | — |
| Added | "Start here" project index page with linked sheets | Figma page 1 | — |
| Caveat | IS 2190 and EN 12464-1 still from summaries | Verify before submission | Open |

## Standards review — 2 October 2026 (geometry P4-B)

| ID | Change | Evidence | Status |
|---|---|---|---|
| D19 | Planning rules now cite their source (NBC 2016 Part 4, IS 2190, HG 2021, EN 12464-1) | `research/STANDARDS_AND_SOURCES.md`, Sheet 4E | Locked |
| D20 | Desk/table height 740 → 750 mm | HG 2021 work surface 750–900 mm | Locked |
| D21 | CV-04 designated accessible station (knee 900 × 480 × 650, adjustable) | HG 2021; no accessible station existed | Locked |
| D22 | Door threshold raised to NBC 1000 mm (from 900) | NBC 4.4.2.4.1(b) | Locked |
| D23 | Lighting specification added (500 lx / UGR 19 / Ra 80; C1 Ra 90, own circuit) | EN 12464-1, IS 3646 | Specified |
| D24 | Extinguisher mounting top 1.0 m | IS 2190 | Locked |
| D25 | Evidence tier "S · Secondary" added; secondary support recorded for H01, H03, H06 (H02 context) | Published studies | Hypotheses remain open |
| Verified | 18 of 20 compliance and fit checks pass; FI-1, FI-2 open | Sheet 4A | — |
| Verified | WCAG 2.5.8 on Direction v1: min target 36 px; "Show" enlarged | Sheet 3B F7 | — |
| Caveat | HG 2021, IS 2190 and EN 12464-1 values came from summaries | Verify against official texts before submission | Open |

## Phase 4 updates — 2 October 2026

| ID | Change | Evidence | Status |
|---|---|---|---|
| D16 | `spatial/lab_geometry.json` is the single geometry source for plan, checks, renders and export | Plan, overlays, blockout and GLB all generated from it | Locked |
| D17 | Fitted zone areas replace blueprint targets where clearances require (CMP +2.24, COL −2.52, S1 −1.88 m²) | Accessible 1.2 m aisle needs 4.1 m depth | Locked for concept envelope |
| D18 | Two outward-opening exits on opposite walls via a 1.2 m spine | Plan 4B, overlay 4C | Pending fire review (G12.15) |
| CAND05 → Fitted | Six shared stations fit with accessible aisle | Fit checks 4A | Pending real room (A02) |
| D06 verified | Blender route works headless: blockout, 2 renders, GLB export | 1 224 tris, 144 KB, valid glTF 2.0 | Viewer test pending (CAND08) |
| Open | FI-1 S1 user zone 0.95 m; FI-2 tripod vs kit bay 0.5 m | Computed checks | Mitigations listed on 4A |

## Phase 3 updates — 2 October 2026

| ID | Change | Evidence | Status |
|---|---|---|---|
| D13 | Studies share one layout skeleton; identity lives in a variable collection with one mode per study | 18 frames built from identical content (D05) | Locked for Phase 3 |
| CAND02/03 → Recommended | Direction v1 "Atlas+": Atlas foundation, Theatre instrument tokens, Manuscript editorial type | Weighted critique 57 / 50 / 46; measured WCAG failures in Atlas and Manuscript instrument pairs | Pending team critique + M7 five-second tests |
| D14 | Red is reserved for danger; never a brand accent | Manuscript collision on P06, P14, P31 | Locked |
| D15 | Dedicated instrument tokens (instAccent, instWarn) for dark viewers | Atlas accent 2.48:1 → instAccent 11.64:1 | Locked |
| Verified | Student-plan file supports variable modes (4 in use) and more than 3 pages | Collection created with 4 modes; page test | — |

## Phase 2 quality audit — 2 October 2026

| Finding | Severity | Fix |
|---|---|---|
| Only 4 of 10 workflows (W01–W10) had flows, against the Phase 1 handoff | Major | Added F5–F10 and a W01–W10 coverage index (Sheet 08, research doc §8) |
| Vision evidence (E06) was not specified alongside E01 | Major | Added E06 section with parameters, evidence, validity rule and illustrative figure (Sheet 09) |
| Assignment's "laboratory activities" was not explicitly covered | Medium | Added activity inventory with who/where/pages (Sheet 05 §D, research doc §8b) |
| IA coverage count text was wrong (shell 5, technician 2) | Error | Corrected to shell 4, technician 3 → 34 families (Sheet 07) |
| E01/E02 weighted totals mis-added (58/42) | Error | Corrected to 56/40; recommendation unchanged |
| Student-file page limit was stated without verification | Error | Tested by creating and removing two pages: student file allows more than 3 pages; note corrected (Sheet 09) |
| Persona statements could be mistaken for quotations | Integrity | Labelled "Hypothesis statement · not a quotation" |
| Cover, Sheet 06 and Sheet 09 still said "four flows" | Consistency | Updated to ten workflow flows |
| Persona card heights uneven; Sheet 01 pipeline text clipped (component sizing bug) | Visual | Cards equalised; Note/Flow components hug content; verified by screenshot |

## Changes made in Phase 1

- Created a reusable concise project brief.
- Created an execution brief with requirements and page-priority coverage.
- Defined explicit attendance and asset-movement coverage.
- Reconciled the ten-phase sequence with the earlier master proposal.
- Recorded artistic tokens and room assumptions as candidates.
- Confirmed local Blender availability.
- Preserved open questions after the user requested autonomous professional progress.

## Change discipline

Record the date, changed decision, evidence, affected artifacts, and next verification.
Update the brief when a decision changes before broad design production.
Do not overwrite a confirmed fact with a convenient modelling assumption.
If another coding agent is used, assign a separate task and file ownership explicitly.

