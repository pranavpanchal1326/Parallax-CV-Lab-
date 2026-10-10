# PARALLAX smart features and rubric excellence plan

Proposal dated 3 October 2026. This document specifies future design and verification work. It does not claim that features were built, research was conducted, measurements were collected, or marks were awarded. Preserve the existing project and design direction.

The user's subsequent React and art direction is consolidated in [PARALLAX Excellence Blueprint](../PARALLAX_EXCELLENCE_BLUEPRINT.md). Use that document as the upgrade execution specification; retain this file as supporting concept history.

## Product premise

PARALLAX helps students understand whether their setup is ready, what changed between experimental conditions, and what to do when equipment or data becomes unreliable.

Working research hypothesis: students want interpretable experimental results, but equipment status alone does not explain whether the complete setup and its conditions are appropriate. Confirm or revise this through student, faculty and technician research.

Retain the current student journey, stable record identities, evidence provenance, fault propagation, public/private boundaries, accessible alternatives and common geometry. Extend them with contextual observation records and guided support.

## Three concept territories considered

1. Experiment confidence: contextual readiness, condition snapshots and guided interpretation. Recommended because it directly serves the signal/computer-vision curriculum and extends existing evidence records.
2. Operational resilience: resource-impact previews, sensor triage and verified recovery. Strong supporting direction because existing fault workflows already provide a foundation.
3. Sustainable lab: energy context, session-aware standby suggestions and maintainable physical design. Strong supporting direction, but consumption alone does not define a complete student experience.

The proposal combines the first territory as the central student story with bounded operational and sustainability extensions. Generic temperature tiles, an unrelated chatbot and autonomous controls do not provide sufficient task value.

## Connected feature specifications

### 1. Experiment readiness

Before reserving and before starting, show separate readiness checks: complete kit, restrictions, calibration reference where relevant, approved manual revision, station and required conditions. Explain each unresolved check and offer a next action. Do not collapse these into an invented percentage or allow a favourable reading to override a restriction.

Distinguish the student's experiment readiness from the technician's wider operational overview. Booking occupancy comes from existing records and is not presented as a sensor-derived headcount.

Reuse P02 Today, the preparation/check-in steps and P03 Live Lab. A Smart Lab Dashboard label may identify the staff overview without changing the student navigation.

### 2. Environmental observations and condition snapshots

Proposed observations: task-light readings, temperature, humidity, ventilation-related measurements if suitable sensors exist, and equipment electrical consumption. Choose only observations relevant to the actual lab and equipment inventory.

Each observation carries source ID, location, value, unit, observed-at time, received-at time, quality and origin (measured, simulated or estimated). A missing observation remains missing. Freshness policy is explicit and derived from the intended use.

At an evidence capture, attach a versioned snapshot referencing equipment/kit IDs, manual revision, recorded settings, calibration reference, condition observations and sample time. Preserve the snapshot with the captured evidence even if later observations change.

Comparison view explains which conditions changed. It does not infer causation or manufacture performance/confidence metrics from illustrative images. Students can record a manual observation when the protocol permits, with the source labelled.

### 3. Contextual assistant and digital manual

Open help beside the current experiment or equipment task. Provide an approved manual citation, revision, step reference and concise explanation. Suggested interactions: explain a setup step, compare recorded conditions, inspect a reference, rehearse a concept, or ask staff.

The digital manual contains objective, prerequisites, equipment manifest, setup illustration, ordered method, checkpoints, troubleshooting, references and version history. Link from QR passport, Prepare, Bench and the assistant rather than duplicating its text.

A prototype can use curated scripted answers, explicitly labelled as simulated. Actual AI retrieval/generation is a later implementation boundary. Unknown questions have an uncertainty response and a staff handoff. Assistance never fabricates evidence or authorises safety-critical operation.

### 4. Map observations and resource-impact preview

Extend the existing state-linked map with optional observation markers and a what-if mode. In what-if mode, simulate an unavailable camera, light or workstation and show impacted complete kits and sessions using existing dependency rules.

Keep the what-if state separate from operational records. The user explicitly enters/leaves the preview. A preview does not restrict equipment or alter bookings. List and 2D alternatives show equivalent information.

Call the prototype a simulated twin or state-linked map. Live twin status requires actual device observations, time/freshness behaviour, verified asset mapping and integration evidence.

### 5. Virtual rehearsal and optional AR setup guide

Extend Scene Studio with a guided rehearsal of camera position, framing and lighting. Use labelled generated or illustrative content. Any simulated outcome must identify the model assumptions; geometry alone does not establish detector accuracy.

An optional AR concept overlays a recommended setup on a prepared camera view, with a reference diagram and typed/QR equipment identity fallback. Label a prepared overlay as an AR concept; actual camera pose tracking and on-site alignment are unimplemented until tested. A virtual 3D rehearsal is not described as headset VR.

### 6. Equipment health and calibration

Extend the existing fault thread with usage/service history and calibration-reference visibility. Explain the basis of a due/unknown/restricted state. Use transparent institution-approved rules, not unsupported predictive-maintenance claims.

Suggested flow: observation or student report -> technician classification -> impacted assets/bookings -> repair or investigation -> verification -> release. Environmental observations are observations, not automatic diagnoses.

### 7. Energy-aware operation

Show consumption by equipment group over an explicit period; separate instantaneous power from accumulated energy. Include source and gaps. Compare like-for-like periods and label estimates. Savings claims require a baseline and defensible method.

Propose session-aware standby for eligible idle resources after confirming no experiment/acquisition or unsaved work depends on them. In the prototype, simulate the proposal and confirmation. Essential/safety services are excluded by an explicit circuit/resource policy. Automatic switching requires validated hardware controls and institutional policies.

Include lighting circuits, ventilation assumptions, furniture repairability, replaceable components and material evidence on a physical sustainability sheet. Resolve capture-zone daylight/glare conflicts through the room concept rather than applying a lab-wide lighting rule.

### 8. Optional voice input

User-initiated voice access can repeat a manual step, read context-appropriate information or compose a fault-report draft. Display a transcript and editable confirmation. Provide an equivalent typed route; account for lab noise and shared-space privacy.

A prototype may demonstrate prepared commands without requesting microphone access. Do not claim speech recognition exists in that case. Recording, booking changes and device actions require deliberate confirmation appropriate to their consequence; voice never issues an unreviewed shutdown.

## Minimum coherent addition

Build three principal compositions and contextual states before adding another primary destination:

1. Staff Smart Lab Dashboard: active/upcoming sessions, equipment exceptions, environment/energy summaries, and actions.
2. Energy and Environment detail (P29): sources, units, time periods, missing/stale observations and actionable alerts.
3. Guided setup/conditions comparison: extend Prepare/Scene Studio/Notebook with the snapshot and manual/assistant panel.

Add normal, changed, stale/offline and recovery states where they affect the task. Extend the map and existing technician thread for consequence propagation. AR and voice are secondary enhancements, not prerequisites for the first coherent demonstration.

## Demonstration story

1. Student prepares E06 and sees the kit, approved method and contextual readiness.
2. Student rehearses the setup, checks in, and records the first condition with its snapshot.
3. A labelled demonstration event changes the lighting observation; the second snapshot preserves its changed source/time and recorded settings.
4. Student compares conditions, asks a manual-linked question, and writes their own interpretation.
5. A sensor disconnect shows stale/unknown data and the permitted fallback or technician action. It does not silently declare readiness.
6. Existing camera fault recovery restricts the appropriate resources and propagates to bookings, map and public display with their existing visibility boundaries.
7. Session closes; the energy view offers a justified standby proposal for eligible idle resources.

Show simulated status consistently across all surfaces. Do not introduce live integrations merely to improve presentation language.

## Rubric completion evidence

| Criterion | Target evidence for an excellent submission | Completion check |
|---|---|---|
| User Research (10) | Exploratory interviews across students, faculty and technicians; a consented setup-to-return observation if access permits; evidence-backed personas, empathy and journey; uncertainties retained | Notes have participant codes and methods; findings trace to design decisions; sample limitations are stated |
| Problem Analysis (10) | Problem -> evidence -> requirement -> design -> validation matrix; priority and rationale; comparison of rejected alternatives | Every important feature has a user/operational need and observable acceptance condition |
| Space Planning (15) | Dimensioned 70 m² plan, equipment/services/safety/signage layers, capacity and rotation explanation; movement and service clearance review | Area and object IDs agree with geometry; surveyed facts and assumptions are distinct; proposed conflicts are resolved or disclosed |
| UI Design (15) | Wireframes, high-fidelity key compositions, task-specific mobile/wall views and important exception states | Wireframes explain hierarchy/decisions; components and tokens remain consistent; no unresolved clipping or inaccessible controls |
| UX Design (15) | Task entry, IA, complete core journeys, assistant/manual discoverability, recovery, participant sessions and iteration | Users attempt tasks without coaching; help/errors are recorded; consequential problems are revised and re-tested |
| Innovation & Smart Features (10) | Connected readiness -> snapshot -> explanation -> action demonstration; useful map rehearsal, energy and health concepts | Example event changes the appropriate dependent views; sources, freshness and limits are visible; technology solves a named task |
| Accessibility & Safety (10) | Manual keyboard/screen-reader/zoom checks, alternative to 3D/camera/voice, CCTV/ventilation/hazard/emergency concepts | Technical findings are logged; emergency information has a physical fallback; safety proposals are distinct from qualified review |
| Prototype & Demonstration (10) | One coherent student/staff/public demonstration, data propagation and a failure/recovery path; tested launch and backup recording | IDs and consequences agree across surfaces; intentional simulation controls are labelled; critical existing checks still pass |
| Presentation & Documentation (5) | Assignment's ten-section report; 15-minute deck; sources, limitations, contribution record and evidence appendix; editable handoff | All links and exports work from the submission; deck is rehearsed to time; Figma index includes Phase 9 and current additions |

The rubric provides criterion names and weights, not an official excellent-band descriptor. These completion checks are proposed professional acceptance criteria, not a promise of full marks.

## Research and validation approach

Start recruitment while producing wireframes. A pragmatic exploratory starting point is 4–6 students plus a faculty member and a technician; report this as a small convenience sample. Ask about an actual recent practical, equipment/setup difficulty, interruptions and recovery rather than inviting approval of the proposed features.

Observe a permitted session if possible. Run task tests covering finding equipment, booking a complete kit, interpreting changed/stale conditions, reporting an issue and recovering. Record unaided/assisted/failed outcomes and contextual timings. Test hypotheses and assistant comprehension; do not invent findings to fill a report section.

Recruit relevant users for the existing Phase 9 test plan where feasible, including assistive-technology users. Update personas and journey based on what was actually observed. Distinguish findings from the old hypotheses. Re-test changes that affect task completion or trust.

## Preservation and regression gates

- Preserve current compositions and assets as a revision before implementation. Keep existing identifiers and common geometry authoritative.
- Reuse existing typography, semantic tokens, components and spacing. Smart functionality must fit the task hierarchy.
- Add contextual help and observation detail progressively. Do not interrupt the default student route with optional AR/voice/3D.
- Keep measurement quality, equipment readiness and verified safety status distinct. No invented readiness score.
- Keep snapshot evidence immutable and its source/observation time visible. Separate sandbox previews from operational records.
- Preserve public/private visibility and the existing release-after-verification rule.
- Run existing validators after state changes. Add meaningful checks for snapshot preservation, stale-data handling, sandbox isolation, protected-resource exclusions and correct consequence propagation.
- Manually verify keyboard/focus, small-screen layouts, source labels and recovery in the new experiences. Existing automated passes do not verify new flows by themselves.
- Compare the final new views against preserved captures and record any intentional changes. Keep export/source and index revisions consistent.

## Recommended order

1. Requirement/evidence matrix and research recruitment; preserve baseline.
2. Wireframes for dashboard, observation detail and contextual setup/support.
3. Implement the connected core as explicitly simulated features and extend current records.
4. Run participant sessions and revise/re-test.
5. Complete sustainability/safety sheets and physical assumptions review.
6. Complete accessibility/device checks and the report/deck/handoff.
7. Add optional voice/AR only after the coherent core and essential submission evidence are sound.

This scope is a proposal. No code or Figma changes were made while writing it.

## AI product specification and acceptance gates

Expanded 3 October 2026 after the user requested a deeper product-design proposal and an explicit AI role. The following gates are internal project criteria. The assignment does not supply official excellent-band descriptors, so passing these gates does not guarantee a mark.

### Product structure

Organise the experience around preparation, conducting/interpreting an experiment, and closing/improving the lab. Student, faculty and technician surfaces share underlying records but expose different actions and information. Each addition must identify its user, task, source data, consequence, owner, fallback and verification.

The central AI roles are:

| Role | Input and task | Output and user control | Prototype boundary |
|---|---|---|---|
| Learning coach | Approved manual revision, current experiment/step and student question | Referenced explanation, hint ladder, suggested prediction or rehearsal, and staff handoff where appropriate | Actual AI responses require a backend integration and tested source retrieval; scripted scenarios stay labelled as simulations |
| Evidence-review assistant | Selected evidence revision, condition snapshots and computed analysis outputs | Highlights recorded differences or absent information; asks questions about whether a conclusion is supported; student accepts/edits their own reasoning | Values are read from records/computations; no fabricated accuracy or inference of unseen measurements |
| Staff planning copilot | Permitted equipment state, timetable, kit dependencies and approved scheduling constraints | Draft feasible alternatives with impact preview, constraints and trade-offs; faculty explicitly publishes a checked plan | Deterministic validation checks the suggestion; AI does not bypass reservations, capacity rules or release restrictions |

Supporting technician assistance can summarise an issue's recorded symptom/history and draft an inspection checklist from an approved reference. Diagnosis, verification and release remain technician responsibilities. This is an extension of the current fault workflow, not a separate automated maintenance system.

### A realistic AI answer contract

Show the answer in context, a specific source/manual revision, observed record timestamps where relevant, suggested next action, and an editable user contribution when offered. A low-evidence or unknown case explains what information is absent. Avoid an invented confidence percentage.

For evidence questions, distinguish the student's prediction, observations, computed values, AI suggestion and final student-authored interpretation. Give a choice between progressive hints and a fuller explanation; study whether that choice supports learning.

When the assistant is unavailable, retain the manual, task controls and saved evidence. When a source is revised, identify the revision used for an older response or experiment; a later knowledge update must not silently rewrite the evidence record.

### Implementation route (proposed)

The browser sends a contextual request to a server holding the API credential. A permission-aware service retrieves the current approved material and exposes limited reads of lab records. A model returns referenced explanations or proposed actions. Application validation checks any proposed action and the appropriate user confirms it before the existing transaction runs. Requests include stable IDs rather than a second independently invented copy of lab state.

If a hosted model provider is selected, file search can retrieve uploaded knowledge and return file citations; application-defined function calling can supply lab facts and calculations. These capabilities do not themselves ensure source support, correct permissions or correct answers. Test the complete application behaviour.

No credential was inspected, model chosen, document uploaded, paid request made or API integration built for this proposal.

### AI evaluation gate

Use an initial faculty/technician-reviewed set of about 30 task-specific scenarios and an additional held-out check after changes. Include ordinary setup questions, signal reasoning, conditions comparison, unknown questions, missing evidence, stale observations, revised manuals, active restrictions, unavailable AI and requests outside the current role's visibility.

Proposed acceptance:

- Each tested procedural answer cites an available approved source/revision and the cited content supports the answer.
- All deliberately unsupported/unknown cases ask for needed information, disclose uncertainty or hand off rather than fabricate an answer.
- Numerical answers agree with validated computation/reference results within a task-defined tolerance.
- No observed case exposes staff-only information, overrides a restriction, changes a booking without the valid action path, or invents a measurement.
- The tested outage path preserves existing tasks, manual access and saved evidence.
- Reviewers score correctness, source support, usefulness and clarity; record failures by category and re-test them. Passing a small evaluation set is bounded evidence, not proof of universal correctness.

### Additional product capabilities to justify through research

1. **Knowledge approval and publishing:** faculty own approved experiment methods; technician procedures have the appropriate owner; drafts and reviewed revisions have distinct status. AI summaries cannot become approved instructions by themselves.
2. **Dataset provenance:** dataset cards identify origin, permitted use, labels, versions and limitations; evidence refers to the selected version. Demonstrate this on one relevant computer-vision task instead of building a general dataset platform.
3. **Reproducibility package:** export or reopen the evidence, setup manifest, settings, method revision, snapshots and acknowledged limitations needed to repeat a practical. Flag changed/unavailable resources rather than promising exact reproduction.
4. **Curriculum alignment:** map each flagship task to a learning objective and a prediction/reflection checkpoint. Include one signal and one vision route so the lab's identity is supported by the learning content.
5. **Collaboration and handover:** explicit student roles, shared evidence provenance and handover to the next group; rotating responsibilities are a proposed classroom workflow to validate with faculty.
6. **Onboarding and adoption:** test the first-session path, manual discovery, QR/typed ID fallback and the ability to bypass optional coaching. Keep experienced users' task route short.
7. **Policy ownership:** document who sets booking/attendance exceptions, source freshness policies, calibration fitness and alert escalation. No screen or model silently establishes institutional policy.
8. **Service blueprint:** connect physical location/action, user-facing screen, records/services, staff owner and failure response for prepare/book/arrive/capture/fault/return. Use it to expose handoffs missing from polished screens.

### Proposed evidence gates for the nine rubric criteria

| Criterion | Observable gate | Evidence retained |
|---|---|---|
| User Research | Actual exploratory evidence includes student and staff perspectives; important persona/journey statements are tagged as observed/stated/hypothesised; findings visibly inform decisions | Consented anonymised notes, method/sample limits, synthesis and updated maps; observation where access permits |
| Problem Analysis | Every priority feature maps to a problem, evidence/assumption, requirement and acceptance condition; at least the major layout/navigation/AI alternatives have a rationale | Traceability matrix and decision record; no unsupported feature labelled research-validated |
| Space Planning | Dimensioned 70 m² geometry agrees with the model; class-capacity/rotation scenario, circulation, services, storage, safety and signage are explained; unresolved site/inventory facts are labelled | Dimensioned export, equipment/services layers, operational walkthrough and assumptions; no construction/compliance claim without appropriate review |
| UI Design | Key flows include legible wireframes, final views and relevant exception states; new compositions reuse the system and work on the required surfaces | Approximately 8–12 selected wireframes and annotated decisions, source frames, desktop/mobile/wall checks; reconstructions identified |
| UX Design | Initial target: at least four of five student participants finish each agreed critical student task unaided, with no observed false-safe or false-submission understanding; relevant staff can perform planning/triage tasks; consequential failures are revised and re-tested | Task logs with exact counts, assistance and observations; revision/re-test record. Small-sample evidence is not a population estimate |
| Innovation & Smart Features | A connected smart event changes the right snapshot/context/action and dependent views; at least the core AI/manual, observations and energy concepts solve named tasks; AI behaviour is evaluated | Demonstration script/recording, state/source contracts, AI review results and designed/simulated/connected labels |
| Accessibility & Safety | Critical routes receive manual keyboard, screen-reader, actual zoom and relevant browser/device checks; accessible equivalents for optional 3D/voice/camera remain; CCTV, ventilation, hazards, emergency and physical fallback concepts are shown | Technical test log and fixes, annotated safety sheet, visibility boundaries and outstanding qualified-review dependencies |
| Prototype & Demonstration | Booking -> capture -> interpretation -> submission -> return and a fault/recovery path run coherently; critical existing validators still pass; intentional new rules have focused verification; launch and backup demonstration work | Current build/revision, validation outputs, manual walkthrough and backup recording; bounded implementation claims |
| Presentation & Documentation | Every named report section and required design deliverable has a working evidence reference; a rehearsed presentation fits fifteen minutes; Figma/project index and source handoff identify current revisions | Final report/deck, appendix/coverage index, verified links, contribution record and reproduction instructions |

Across these criteria, sustainability must have both physical specifications/concepts and an energy-operation example. AI must have a defined source/permission boundary and evaluation record. New features must meet baseline-preservation gates before being merged into the main demonstration.

### Source grounding for AI implementation and testing

Hosted-provider capabilities considered, 3 October 2026:

- File search — uploaded knowledge retrieval and file citations.
- Function calling — application-mediated access to data and actions.
- Evaluation best practices — task-specific evaluation, representative cases and human review. Use the evaluation principles; no specific hosted evaluation product is selected by this proposal.

All product scope, sample targets and acceptance gates above are recommendations for PARALLAX rather than claims from these technical sources.
