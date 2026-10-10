# PARALLAX — Product, AI, Art and React Excellence Blueprint

Version: EX-1.0  
Date: 3 October 2026, Asia/Calcutta  
Project: Signal and Computer Vision Lab · 70 m²  
Status: execution specification; implementation and evidence gates remain open.

This blueprint consolidates the latest requested direction: deepen the product, include useful AI, strengthen artistic expression, adopt React, and establish observable gates against every assignment criterion. It preserves the existing scientific, spatial and operational work.

“Excellent” is the intended quality level. The assignment supplies criterion names and weights, not official excellent-band descriptors. These are proposed project acceptance gates, not a guarantee of marks. Writing a specification does not complete its research, implementation or testing requirements.

## Contents

1. [Mandate, authority and current baseline](#1-mandate-authority-and-current-baseline)
2. [Product strategy and measurable outcomes](#2-product-strategy-and-measurable-outcomes)
3. [Users, jobs and service ownership](#3-users-jobs-and-service-ownership)
4. [Release scope and feature priorities](#4-release-scope-and-feature-priorities)
5. [Information architecture and page coverage](#5-information-architecture-and-page-coverage)
6. [Shared records and scientific integrity](#6-shared-records-and-scientific-integrity)
7. [Flagship journeys and recovery](#7-flagship-journeys-and-recovery)
8. [AI product and implementation contract](#8-ai-product-and-implementation-contract)
9. [Smart observations, safety and physical interaction](#9-smart-observations-safety-and-physical-interaction)
10. [Sustainability as design and operation](#10-sustainability-as-design-and-operation)
11. [Art direction and creative deliverables](#11-art-direction-and-creative-deliverables)
12. [Interface composition, components and motion](#12-interface-composition-components-and-motion)
13. [Wireframes and design-process evidence](#13-wireframes-and-design-process-evidence)
14. [React architecture and stack decisions](#14-react-architecture-and-stack-decisions)
15. [Migration, persistence and rollback](#15-migration-persistence-and-rollback)
16. [Performance and smooth-operation budgets](#16-performance-and-smooth-operation-budgets)
17. [Verification and regression protection](#17-verification-and-regression-protection)
18. [Research and participant validation](#18-research-and-participant-validation)
19. [Rubric excellence gates](#19-rubric-excellence-gates)
20. [Report, presentation and assessor handoff](#20-report-presentation-and-assessor-handoff)
21. [Team responsibilities and decision discipline](#21-team-responsibilities-and-decision-discipline)
22. [Milestones and dependency order](#22-milestones-and-dependency-order)
23. [Risks and unresolved facts](#23-risks-and-unresolved-facts)
24. [Implementation kickoff and release checklist](#24-implementation-kickoff-and-release-checklist)
25. [Source register](#25-source-register)

## 1. Mandate, authority and current baseline

### 1.1 Authority

Apply the user's latest direction first, followed by the assignment, verified project records, actual research/site evidence, and this execution specification. Earlier proposal inventories remain supporting specifications. If evidence contradicts a hypothesis, revise the hypothesis and dependent design.

- [Assignment](./Final%20Year%20Project%20Assignment.docx): required deliverables and 100-mark rubric.
- [Original blueprint](./PARALLAX_DESIGN_BLUEPRINT.md): 34 page families, 40 component contracts, scientific and operational specifications.
- [Execution brief](./planning/PHASE_01_EXECUTION_BRIEF.md): requirements and production priorities.
- [Design brief](./.design/brief.md): current identity and implementation history.
- [Earlier smart-feature plan](./planning/SMART_FEATURES_AND_EXCELLENCE_PLAN.md): supporting concepts and acceptance discussion.

This document governs the proposed upgrade. It does not retroactively change evidence about earlier phases or claim that all original specifications are implemented.

### 1.2 Preserve the foundation

| Foundation | Current authority | Preservation requirement |
|---|---|---|
| Booking, evidence, fault and return rules | `prototype/store.js` | Reuse rule behaviour before extending it |
| Example identities and records | `prototype/fixtures.json` | Preserve existing asset, kit, booking, issue, request and receipt IDs |
| Geometry and plan coordinates | `spatial/lab_geometry.json` | Continue deriving plan, map and model from the same geometry |
| Semantic tokens | `design/system/token-source.json` and generated token files | Reuse tokens; document any intentional extension |
| Scientific simulation | Phase 8 Scene Studio and signal demonstrations | Preserve the stated mathematical/geometric boundaries |
| Design artifacts | Current Figma file and phase records | Preserve earlier pages and clearly identify new revisions |
| Existing demonstrator | `prototype/` | Remain runnable as the comparison and rollback baseline |

The current application uses HTML/CSS/JavaScript and browser localStorage. React, the proposed AI backend and new observation features have not been implemented by writing this document. Reported prior checks come from phase records; they are not new test runs.

### 1.3 Open facts

The submission deadline year, actual team composition, surveyed room openings/services, equipment inventory, class capacity, institutional policies, research access and real device APIs remain unconfirmed. The assignment states three students per team and 5 August without a year. Plan by dependencies and gates until the actual deadline is established.

## 2. Product strategy and measurable outcomes

### 2.1 Product promise

PARALLAX helps students prepare an appropriate setup, understand the conditions behind their evidence, and recover when resources or information become unreliable. Faculty and technicians can see consequences and act on the same records.

Working hypothesis: students need to understand whether a complete setup can produce interpretable evidence; an equipment availability indicator alone does not answer that question. Research must confirm or revise this premise.

### 2.2 Distinctive product mechanisms

1. **Experiment condition snapshot:** preserve equipment, method revision, settings and available observations with each capture.
2. **Prediction and reflection:** connect a student's expectation to observed evidence and their own interpretation.
3. **Reproducible setup:** reopen the method and context needed to repeat a practical; flag changed resources.
4. **Failure rehearsal:** practise interruptions and recovery in an explicitly separate simulation.
5. **Consequence-aware operations:** explain affected kits, sessions and audiences before staff commits a change.

### 2.3 Outcome measures

| Outcome | Measurement approach | Interpretation boundary |
|---|---|---|
| Find a suitable setup | Completion, assistance and time to locate the required complete kit | Small-sample observations, not population statistics |
| Book and arrive correctly | Conflict recovery, station recognition, kit completeness | Successful task completion does not certify equipment safety |
| Understand evidence | Student can identify recorded changes and relevant limitations | AI response satisfaction alone does not establish learning |
| Recover confidently | Saved work is understood; next action and owner are clear | Do not infer comprehension from a button click |
| Resolve restrictions coherently | All dependent views agree before/after verified release | Script checks and participant understanding are separate evidence |
| Operate efficiently | Compare appropriate consumption periods and idle-state decisions | Savings require a defensible baseline; no invented percentage |

Use these measures to compare design iterations. Do not manufacture a single readiness, learning or sustainability score.

## 3. Users, jobs and service ownership

| Audience | Primary jobs | Consequential responsibility |
|---|---|---|
| Student | Prepare, reserve, locate, run, interpret, submit and return | Own predictions, observations and final interpretation |
| Faculty | Plan rotations, publish methods, review attendance and evidence | Approve teaching content and session changes |
| Technician | Identify faults, restrict, investigate, repair, verify and locate items | Own equipment condition and release decisions |
| Administrator | Manage resource definitions, access and approved policies | Own institutional configuration; actual deployment needs enforcement |
| Visitor/public | Orient and read approved notices | Receive information appropriate to a public display |

Build a service blueprint for prepare -> reserve -> arrive -> capture -> interruption -> submission -> return. Each step must show the physical location, user-facing interface, supporting record/service, responsible person and failure response. Extend the existing Phase 2 service work with actual findings rather than representing it as a newly discovered gap.

The student owns their evidence; faculty owns the approved teaching method; technicians own maintenance verification. AI explanations and drafts do not acquire those responsibilities.

## 4. Release scope and feature priorities

### 4.1 Three delivery levels

| Level | Purpose | Contents |
|---|---|---|
| A · Submission-critical | Close explicit brief gaps and preserve existing behaviour | Research evidence, wireframes, dashboard, environment/energy, AI/manual slice, safety/sustainability sheets, React journey parity, report/deck |
| B · Distinctive product depth | Demonstrate the lab-specific learning and operational value | Snapshots, prediction/reflection, reproducibility, failure rehearsal, dataset provenance, collaboration/handover, staff planning preview |
| C · Conditional integrations | Extend only with adequate evidence, time and access | Real IoT acquisition, live twin, actual AR tracking, speech recognition, device power switching, advanced analytics |

All 34 original page families remain in the design coverage inventory. Levels specify production order and implementation depth, not permission to erase previous scope. Combine page families into coherent task areas rather than exposing 34 primary destinations.

### 4.2 Feature acceptance contract

Every feature specification identifies: user and job; trigger; inputs/source; visible result; permitted actions; owner; normal/empty/loading/error/stale/permission states where relevant; recovery; physical link; accessibility equivalent; and evidence of completion.

| Feature | Required result | Key exception |
|---|---|---|
| Smart Lab Dashboard | Prioritised sessions, readiness and actions with drill-down | Unknown/stale context is visible and does not imply readiness |
| Environment and Energy | Relevant observations with units, sources and period | Gaps remain gaps; estimated values are distinguished |
| Lab Assistant | Referenced, contextual help and evaluated uncertainty | Unknown/source-unavailable/provider-unavailable paths |
| Condition comparison | Recorded changes and absent information are understandable | Missing observations are not filled in by AI |
| Reproduce setup | Method/settings/kit context can be reopened | Resource or method changes are highlighted |
| Failure rehearsal | Student can practise recognition and recovery | Sandbox state cannot change actual demonstration records |
| Staff impact preview | Checked options and audience-specific consequences | Staff must review before publishing changes |
| Dataset provenance | Selected data version and limitations follow evidence | Unclear source/use is disclosed rather than silently approved |
| Collaborative handover | Responsibilities, shared evidence and return obligations are explicit | Simultaneous edit conflict has a clear resolution |
| Lifecycle view | Service/calibration/repair history supports decisions | Unsupported predictive-maintenance claims are excluded |

## 5. Information architecture and page coverage

### 5.1 Navigation

Student areas: Today, Experiments, My Work, Lab Map and Help. Equipment can be discovered from Experiments/Map and by QR or typed ID. The assistant opens in the relevant task and does not become a mandatory detour.

Faculty areas: Sessions, Submissions, Teaching Material and Lab Status. Technician areas: Queue, Equipment and Environment. Administration is a restricted staff area. The wall display exposes approved public information only.

These are proposed groupings to test. Preserve familiar working paths while changing navigation. URL access and role visibility must be validated; hiding a tab is not access enforcement.

### 5.2 Coverage inventory

The baseline descriptions below are grounded in existing phase records and a code spot-check, not a fresh audit of every Figma interaction. “Design” and “working demo” describe different levels of completion.

| ID | Family | Baseline / upgrade treatment |
|---|---|---|
| P01 | Entry and access | Design coverage to reconcile; define first visit, permitted role and deep-link return |
| P02 | My Lab | Working Today; extend contextual readiness and continue-work entry |
| P03 | Live Lab | Availability appears in existing views; develop staff Smart Lab Dashboard and freshness |
| P04 | Experiment Atlas | Two demo experiments are discoverable; complete broader learning catalogue design |
| P05 | Experiment Brief | Working Prepare; add approved method version and learning objectives |
| P06 | Reservation Studio | Working complete-kit/conflict rules; preserve then migrate |
| P07 | Booking Detail | Existing confirmation; reconcile change/cancel and impact design |
| P08 | Equipment Library | Existing equipment list/specimens; complete capability discovery and compatibility explanation |
| P09 | Equipment Passport | Existing mobile/staff designs; connect manual, health and provenance |
| P10 | Lab Map | Working 2D/3D; preserve fallback and add optional observation/what-if layers |
| P11 | Session Check-in | Working student check-in; staff attendance corrections are Figma designs |
| P12 | Experiment Workbench | Working E01/E06 demonstrations; attach condition snapshots |
| P13 | Scene Studio | Working geometric simulation; add guided rehearsal without changing its scientific claims |
| P14 | Results Observatory | Existing evidence comparisons; extend checked analysis and contextual review |
| P15 | Research Notebook | Working notes/evidence; preserve ownership and add prediction/reflection |
| P16 | Submission Review | Working stable request/receipt behaviour; preserve acknowledgement recovery |
| P17 | Project Gallery | Reconcile design coverage; approved work only, not private submission exposure |
| P18 | Project Case Study | Reconcile design coverage; question/method/findings/limitations composition |
| P19 | Schedule | Faculty rotation design exists; implement bounded planning and conflict preview |
| P20 | Learning Library | Preparation is partial manual coverage; build versioned approved methods |
| P21 | Dataset Registry | Proposed family; demonstrate one meaningful dataset provenance path |
| P22 | Notices and Events | Existing public notices; reconcile audience, expiry and linked impact |
| P23 | Help and Issue Reporting | Working fault report; extend contextual help and explicit staff handoff |
| P24 | Safety and Readiness | Existing physical/signage concepts; complete dedicated safety/ventilation/hazard treatment |
| P25 | Technician Console | Working fault thread; retain verified-release invariant |
| P26 | Calibration Record | Staff Figma design exists; link fitness source/method/revision |
| P27 | Faculty Workspace | Figma design exists; implement the selected staff demonstration route |
| P28 | Submission Assessment | Figma design exists; keep faculty judgment separate from AI suggestions |
| P29 | Energy and Environment | Proposed; build observation/energy view and stale/alert states |
| P30 | Administration | Reconcile proposed access/resource/policy configuration and enforcement boundary |
| P31 | Mobile Companion | Figma mobile views plus responsive demo; implement key mobile tasks and test them |
| P32 | Wall Display | Working public projection; preserve privacy, freshness and failure behaviour |
| P33 | Notifications and Activity | Working activity log; notification delivery remains a separate integration |
| P34 | Profile and Preferences | Theme/motion controls partly exist; reconcile access summary and preferences |

Create an actual artifact ledger with family, frame/route, implemented states, evidence link and status. Never use this inventory table as proof that a missing family is built.

## 6. Shared records and scientific integrity

### 6.1 Record model

Retain existing Experiment, Resource, Kit, Booking, Session, Evidence, Submission, Issue, Restriction and Activity records. Add explicit contracts where needed:

| Record | Minimum relevant fields |
|---|---|
| Observation | ID, source/sensor ID, resource/zone, value, unit, observedAt, receivedAt, quality, origin |
| ConditionSnapshot | ID, evidence/session reference, equipment IDs, method revision, settings, observation references, capturedAt |
| ManualRevision | Manual ID, revision, experiment/equipment scope, approval status, owner, publishedAt, section IDs |
| DatasetVersion | ID, version, origin, label/schema description, use constraints, known limitations |
| AssistantExchange | Request ID, task context, relevant record revisions, source references, answer/proposal and evaluation metadata |
| PlanProposal | ID, constraints, candidate allocations, affected resources/groups, validation result, staff decision |
| Handover | Session/group references, responsibilities, outstanding items/issues, acknowledgement |

Use explicit origins such as measured, simulated, estimated and manually recorded. Quality and origin are different attributes. A simulated observation may be fresh within a simulation while remaining simulated.

### 6.2 Invariants

- Availability, occupancy, equipment restriction and verified safety status are distinct facts.
- No favourable observation overrides an equipment restriction.
- Evidence references an immutable condition snapshot. Corrections create a revision with provenance.
- A later manual or sensor update never silently rewrites captured context.
- Missing/old data is disclosed. Time-series plots show gaps rather than interpolated fictional observations.
- Keep observed time separate from received time. Distinguish fixture clocks from real device timestamps.
- Calculations use validated code and declared units; the model explains those results rather than inventing them.
- Scene Studio remains a geometric simulation unless exposure/noise/detector models are actually implemented and verified.
- Simulated image overlays do not establish measured detector accuracy.
- Public projections exclude student evidence, reporter identities and private issue details.
- What-if previews and training scenarios are isolated from operational state.

## 7. Flagship journeys and recovery

### 7.1 Vision learning route

Today -> E06 method/objective -> complete-kit readiness -> reservation/conflict recovery -> correct station -> kit count -> rehearsal -> prediction -> capture A and snapshot -> capture B and snapshot -> comparison -> referenced assistance -> student interpretation -> review -> receipt -> return.

A changed observation identifies the recorded difference; it does not prove causation. A missing observation offers the protocol-permitted manual fallback or an explicit staff action.

### 7.2 Signal learning route

E01 preparation -> known generated reference -> prediction for the chosen sampling condition -> computed samples -> comparison/alias explanation -> cited conceptual assistance -> student's reasoning -> submission/return. Keep reference, sampled signal and illustrative reconstruction labelled distinctly.

### 7.3 Operational recovery route

Student report -> technician classification -> restriction preview -> restriction -> affected bookings/map/public notice -> faculty alternatives -> repair -> interrupted verification remains open -> successful verification -> release -> availability restored.

Preserve the existing ISS-0417/C1-CAM thread before adding observation-triggered examples. A sensor anomaly alone is not a verified equipment diagnosis.

### 7.4 Rehearsal and energy closure

Enter practice mode explicitly; select one interruption; predict the response; complete the recovery exercise; exit without altering the booked session. At real demonstration closure, show consumption context and an eligible idle-resource standby proposal. Protect active work and excluded essential services.

### 7.5 Required exception set

Demonstrate booking conflict, wrong station, incomplete/missing kit, restricted asset, interrupted acquisition, save failure with retained draft, missing acknowledgement with stable request identity, stale observation, assistant unavailable, insufficient source evidence, WebGL unavailable and interrupted verification. Identify existing versus newly added states in the ledger.

## 8. AI product and implementation contract

### 8.1 AI roles

| Role | Context | Required output | Human responsibility |
|---|---|---|---|
| Learning coach | Current approved method, step, settings and question | Referenced explanation; hints; prediction/rehearsal suggestion | Student understands and performs the permitted task |
| Evidence-review assistant | Selected evidence revision, snapshots and computed results | Recorded differences, absent information and questions about support for a claim | Student authors the interpretation |
| Staff planning copilot | Permitted timetable, resource dependencies and approved constraints | Checked alternatives with impact/trade-off preview | Faculty reviews and publishes |
| Technician support | Recorded symptom/history and approved maintenance references | Summary and a draft inspection checklist with references | Technician diagnoses, verifies and releases |

Implement real manual-connected Q&A first. Add tool-grounded evidence review next. Staff planning follows after deterministic constraint validation exists. Optional image review must be separately evaluated and disclose the limits of inferring setup geometry from an image.

### 8.2 Answer anatomy

Show: concise answer; source/manual revision and relevant section; facts used and their timestamps where needed; missing information; suggested next action; and a way to ask for more explanation or contact staff. Do not display an invented confidence percentage.

Allow a hint-first learning preference. Distinguish AI suggestions visually and semantically from recorded evidence and student-authored claims. Keep assistant help outside the compulsory route.

### 8.3 Approved knowledge lifecycle

Faculty publishes experiment methods; the appropriate owner publishes maintenance procedures. Keep draft, reviewed, published and withdrawn content distinct. Retrieval respects audience and revision policy. Older evidence retains the method revision it used; outdated advice is identified rather than silently presented as current.

AI may draft content for review. It cannot approve the procedure that it drafted. Actual publication uses the existing appropriate staff action and a record of the decision.

### 8.4 Proposed architecture

```text
React task + selected record IDs
    -> server-side Lab Assistant endpoint
    -> validate request and permitted context
    -> retrieve approved source sections
    -> read allowed facts / run validated calculations
    -> model explanation or proposed action
    -> validate references / proposed action
    -> contextual answer + sources + explicit user decision
```

Hold API credentials on the server. Do not put credentials in browser code or client-exposed environment variables. A demonstration role switch is not trusted authentication; disclose that boundary until server-side identity/access enforcement exists.

Suggested read tools: approved manual sections, selected evidence/snapshot, current permitted resource status, validated signal calculations and resource-impact preview. Booking/restriction/release transactions retain application validation and the appropriate user action.

An initial endpoint can be `POST /api/assistant` with request ID, purpose, record IDs/revisions and question. The backend builds trusted context; it does not accept a client-supplied staff role as authority. Cancellation, source-unavailable, provider-unavailable and stale-context responses are part of the contract.

If a hosted model provider is chosen, retrieval and application function calling support this architecture. Select and pin the model only after comparing correctness, latency and cost on the lab's evaluation cases. No API credential, upload or paid request is required to author this blueprint.

### 8.5 Evaluation

Build approximately 30 faculty/technician-reviewed initial scenarios. Include ordinary questions, unknowns, missing evidence, conflicting recorded conditions, revised/withdrawn sources, stale observations, active restrictions, wrong audience, numerical reasoning and provider failure. Repeat critical scenarios to expose response variability and retain a held-out set after changes.

Proposed gate: every procedural claim in tested answers has a supporting approved reference; unknown cases disclose uncertainty or request context; computed answers meet reference-specific tolerance; no tested answer leaks restricted information, invents a measurement or bypasses a consequential action; outage preserves manual and task access. Review usefulness and clarity with students as well as correctness with staff.

Report case counts, failures and re-tests. A small set passing is bounded evidence. Keep participant research separate from AI-generated cases and summaries.

## 9. Smart observations, safety and physical interaction

### 9.1 Observation design

Select only observations useful to the actual teaching and operating tasks. Candidate sources include task light, temperature/humidity, suitable ventilation-related measurements and equipment power. Hardware choice and freshness thresholds depend on inventory, source behaviour and institutional policy; do not invent thresholds to make a green status appear.

An observation detail contains source, position, unit, time, quality, relevant period, explanatory context and a permitted next action. Disconnect shows last observation plus unknown/stale state. Booking-derived occupancy must not be described as measured headcount.

### 9.2 Safety and surveillance sheet

Show emergency information, fire equipment, first aid, electrical controls, ventilation concept, hazard indicators, CCTV placement/visibility and the physical fallback. Preserve existing emergency/clearance geometry and signage IDs.

Separate security CCTV from experiment cameras. Explain public awareness and staff visibility conceptually; actual access/retention policy belongs to the institution. Do not introduce biometric attendance or assume CCTV verifies readiness.

Emergency information remains accessible independently of AI or WebGL. Sensor readings are not building approval or safety certification. Document which provisions need qualified review before real-world implementation.

### 9.3 Physical touchpoints

Entrance: session/destination/readiness. Station: matching booking and station ID. Equipment tag: passport/manual/issue action with typed-ID alternative. Bench: settings, sources and saved-state clarity. Return bay: correct storage location and outstanding items. Wall: audience-safe orientation and notices.

Test the whole-class scenario: arrival, resource collection, rotations, simultaneous movement, interruptions, cleanup and departure. Geometry footprint checks do not establish dynamic comfort or approved capacity.

## 10. Sustainability as design and operation

| Assignment item | Physical proposal | Digital/operational evidence |
|---|---|---|
| Energy-efficient lighting | Task/decorative circuits, maintainable luminaires and selected product evidence | Lighting group consumption/source where available |
| Natural ventilation | Locate assumed openings, explain airflow concept and capture-zone constraints | Observation context and escalation; no universal safety claim |
| Smart power management | Eligible circuits/resources and exclusions | Session-aware standby proposal, preserved active work and explicit confirmation |
| Recyclable furniture | Material/connection schedule and repair/replace path | Lifecycle/service record and documented sourcing |
| Green materials | Finishes/material evidence and durability rationale | Claim/source register; distinguish candidate from verified product |

Resolve daylight/glare and changing illumination in C1 separately from general working-area comfort. Support repairable assemblies and replaceable electronics. Do not replace evidence with a green colour theme or rank students by energy consumption.

On the web, lazy-load 3D, pause hidden scenes and motion, and offer static alternatives. Measure processing behaviour rather than claiming quantified environmental savings from these choices.

## 11. Art direction and creative deliverables

### 11.1 Creative premise

**From signal to understanding:** use waveform, sample, field-of-view and evidence language to make the laboratory's subject visible. Continue Atlas+ and the existing edition treatment. Art establishes identity, explains a concept or gives spatial orientation; dense operational work retains clear hierarchy.

Preserve warm paper, ink, ultramarine actions, dark scientific instruments, mint traces and reserved danger colours. Keep Familjen Grotesk, DM Sans, JetBrains Mono and editorial Newsreader roles consistent with current artifacts and verified tokens.

### 11.2 Art package

| ID | Deliverable | Art direction | Evidence/constraint |
|---|---|---|---|
| ART-01 | Entrance identity poster | Large editorial title, precise waveform-to-sample composition, zone/subject identity | Decorative/reference status explicit; readable at intended distance |
| ART-02 | Signal-to-pixel installation study | Develop the existing segmented-fin candidate through light/shadow and sample rhythm | Preserve clearance; structure, glare, cleaning and fire review remain dependencies |
| ART-03 | Conditions atlas | Paired evidence plates with aligned settings, time and condition annotations | Actual/simulated origins visible; aligned comparison scales |
| ART-04 | Experiment storyboards | Predict -> set up -> observe -> compare -> reflect in a coherent illustration family | One signal and one vision story; accessible text equivalent |
| ART-05 | Equipment illustration plates | Refine/reuse current kit renders and diagrams, labelled with authoritative IDs | Illustrative forms do not claim actual inventory verification |
| ART-06 | Zone and wayfinding graphics | Continuous spatial vocabulary across entrance, station, storage and capture areas | Existing sign IDs; no intrusion into safety/accessible routes |
| ART-07 | Report and presentation visual system | Editorial spreads, spatial cutaways, evidence annotations and restrained colour | Readable exports, source captions and accurate figures |
| ART-08 | Optional interactive learning artwork | Extend the mathematically defined signal-to-pixel demonstration with deliberate interaction | Clear mathematical model, pause/reduced-motion/static alternatives |

Use one reusable visual language across formats, with task-specific composition. Keep generated/illustrative art separate from experiment measurements. If raster art is later generated, review geometry, exact copy, source labels and material/equipment fidelity before using it.

### 11.3 Creative quality gate

The artwork must visibly relate to signal/vision learning, have a named communication job, agree with current geometry/IDs, retain legibility in exported documents and signage, and preserve task hierarchy. Compare actual rendered results at intended sizes; a prompt or descriptive concept is not a finished artwork.

## 12. Interface composition, components and motion

| Surface | Dominant composition |
|---|---|
| Dashboard | Priority actions and changes, then contextual summaries and drill-down |
| Preparation/manual | Readable sequence, setup diagram and contextual checkpoints |
| Reservation | Time/setup compatibility and consequences |
| Bench | Instrument/work surface with controls close to evidence |
| Conditions comparison | Aligned evidence plates and recorded differences |
| Notebook | Reasoning, provenance and saved-state clarity |
| Technician | Consequence ladder, current action and impact/history |
| Faculty | Rotation/allocation view, checked alternatives and publish preview |
| Environment | Source-aware time series, missing intervals and observation detail |
| Map | Plan/list first; optional spatial exploration |

Reuse the 40 existing component contracts. Add only justified components, such as ObservationDetail, ConditionSnapshot, SourceReference, HintDisclosure, ProposalPreview and DatasetProvenance. Give each a state contract and accessibility behaviour.

Keep colour semantic and labels explicit. Use preferred large mobile targets, clear focus, robust wrapping and proper heading/form structure. Verify narrow screens and real 200%/400% zoom. Source citations and chart values remain usable without a canvas.

Motion explains state changes or spatial continuity. Reuse current timing tokens initially; verify before changing them. Keep animation interruptible, pause offscreen/hidden artwork, and honour reduced motion. Avoid layout shifts while data/AI responses arrive.

## 13. Wireframes and design-process evidence

Produce a selected low-fidelity set sufficient to show hierarchy, navigation and decisions. Suggested twelve:

1. Student Today/readiness.
2. Experiment preparation and approved manual.
3. Complete-kit booking with conflict.
4. Station check-in/mobile typed-ID fallback.
5. Bench with observation/snapshot context.
6. Conditions comparison and evidence assistance.
7. Notebook/prediction/reflection.
8. Submission review with pending acknowledgement.
9. Staff dashboard and impact preview.
10. Environment/energy with stale observation.
11. Technician triage/recovery.
12. Map/rehearsal with no-WebGL alternative.

Show at least the consequential alternatives for navigation, assistant placement and the dashboard hierarchy, with reasons for selection. Wireframes derived from existing final screens are labelled reconstructed; newly explored designs are labelled new exploration. Maintain truthful chronology.

Link wireframe -> final frame -> route -> test evidence. Designs for remaining original families can reuse established structures where appropriate, with family-specific task/state contracts.

## 14. React architecture and stack decisions

### 14.1 Selected direction

Adopt React + TypeScript + Vite for the upgraded application. React provides a component/state architecture; it does not establish runtime smoothness by itself. Use the migration and measured performance gates below.

| Layer | Decision | Reason and boundary |
|---|---|---|
| UI | React and TypeScript | Typed record/component boundaries and reusable task compositions |
| Build | Vite, compatible versions pinned at implementation | Existing project has no app build pipeline; retain reproducible lockfile |
| Routing | React Router Data Mode; initial hash-based deployment | Async loading/pending boundaries while compatible with current static serving constraints |
| Local domain state | `useReducer` with separate state/action contexts and narrow feature consumers | Reuse existing rules; avoid a second source of derived facts |
| UI state | Component-local state | Drawer, selected tab and transient draft view state remain scoped |
| Styles | Existing semantic CSS tokens plus scoped component CSS | Preserve identity; no wholesale replacement of the design system |
| 2D charts/plan | Accessible SVG/HTML using validated data | Retain text/table alternatives and scientific axes/units |
| 3D | Existing Three.js modules through a React lifecycle adapter | Preserve geometric/scientific behaviour before considering another renderer abstraction |
| AI server | Node.js + TypeScript, minimal HTTP service and explicit request validation | Server-held credentials and controlled access to application facts |
| Persistence | Versioned local adapter for the demo; server repository interface for deployment | Browser persistence is not a multi-user transactional database |
| Rule/adapter tests | Existing validators plus targeted Vitest tests | Verify behaviours and intentional migration boundaries |
| Browser verification | Realistic walkthroughs; Playwright for automated regression where available | Complement manual access/user/device checks |

At authoring, shell Node reports v24.13.0. Check runtime/package compatibility again when installing; select compatible supported releases and pin them. Keep the currently vendored Three.js version during initial parity work. Do not install a chart, motion, global-state or 3D-wrapper library merely to lengthen the stack list.

### 14.2 Proposed layout

```text
apps/lab-web/
  src/app/             # shell, routes, bootstrap and error boundaries
  src/features/        # experiments, bookings, evidence, operations, environment
  src/components/      # shared accessible controls and source/snapshot views
  src/domain/          # typed adapter around the existing rule engine
  src/data/            # fixture, persistence and future API adapters
  src/ai/              # client request/response presentation
  src/visuals/         # plan/chart/Three.js lifecycle adapters
  src/styles/          # imported tokens and scoped compositions
  tests/               # meaningful migration/new-feature checks
services/lab-api/       # proposed server-held AI/context service
prototype/              # preserved original demonstrator
design/                 # existing edition and design sources
spatial/                # authoritative geometry and assets
```

These directories are proposed; writing this document does not create an application scaffold. Keep the existing root start/check scripts working until the upgraded app has verified parity. Add separate scripts during implementation and clearly name the new entry point.

### 14.3 State and rendering boundaries

Application rendering reads immutable snapshots. Effects handle persistence/network/3D lifecycles outside reducers. One domain action determines the resulting facts and feedback; components do not independently recompute booking rules.

Keep chart/scene interaction outside whole-app render loops. Use scoped state and measured memoisation; do not add memo wrappers without a demonstrated rendering problem. Provider errors are contained within assistance; a failed assistant must not replace the experiment route with an error page.

Router/Data Mode can own route loading/pending behaviour. Introduce a separate server-cache library only if actual server-data requirements justify it, avoiding two competing caches for the same records.

## 15. Migration, persistence and rollback

### 15.1 Preserve domain behaviour

The current exported functions operate on plain objects and several mutate the object they receive. Do not pass React-owned state directly to those functions. A deterministic adapter works on a cloned/owned draft and returns a new state reference, domain result and presentation feedback. Storage/network side effects remain outside that calculation.

Important: some error results intentionally retain useful state. `saveNote` can keep the current text when saving fails. `submit` can set `ackPending` and record an unacknowledged request before returning `ok: false`. Do not discard all draft changes merely because the result is an error. Classify and preserve the current behaviour through parity tests before adding transaction policies.

Development re-renders/Strict Mode must not create duplicate persistence, requests, logs or acquisition actions. Generate transaction identities at the action boundary and preserve stable submission request/receipt behaviour.

### 15.2 Persistent-state versioning

Separate fixture revision from persistence schema version. Validate imported browser records; support a documented migration or explicit reset with export/recovery guidance. Do not silently overwrite legacy state with a new incompatible object.

Preserve the existing Lab Map projection contract (`parallax-proto-labmap`) while either app participates in the demo. During parallel comparison use separate primary state keys or read-only imports to avoid both applications writing incompatible state. At cutover choose one writer and verify cross-tab notifications and record freshness.

A localStorage failure requires visible retained-draft/unsaved feedback; avoid false “saved” copy. Cross-tab browser events can propagate demo changes but do not solve multi-user concurrency. A deployed system needs server validation, version/concurrency checks and transaction semantics.

### 15.3 Migration stages

1. Capture a known baseline and current validator results without modifying source.
2. Bootstrap the React app separately; import tokens and fixture/geometry contracts.
3. Migrate Today and E01/E06 preparation/reservation with rule parity.
4. Migrate arrival, bench, notebook, submission and return including all recovery states.
5. Migrate technician/public projection and map bridge.
6. Add new observations, snapshots and AI/manual vertical slice behind explicit feature switches.
7. Verify parity, access, art, performance and participant understanding before changing the primary entry point.

Rollback selects the preserved app and compatible state/export. No removal of the old app is necessary for the assignment upgrade.

## 16. Performance and smooth-operation budgets

These are proposed engineering targets, not measurements of current or future builds. Establish baseline values and record device/browser/network conditions before accepting a target.

| Area | Initial target / behaviour | Verification |
|---|---|---|
| Primary task bundle | Aim for <=300 KB compressed JS before optional 3D/analysis chunks; account separately for CSS/fonts/images | Production build report and actual network trace |
| Local UI feedback | Aim for <=100 ms visible feedback for ordinary interactions | At least 30 repeated representative actions on recorded devices; inspect slow cases |
| Route responsiveness | Aim for <=250 ms for already-loaded local task changes | Measure task transitions; distinguish first load and network wait |
| Initial usable task | Aim for <=2.5 s under a stated representative test profile | Cold-load repeated runs; report conditions and range |
| 3D | Opt-in; target >=30 fps on the selected test device, record frame-time stalls | Same model/viewpoints/settings and device; provide lower-quality/static path |
| Idle scenes | Stop unnecessary animation when hidden/offscreen; render on demand where suitable | Runtime inspection and repeated hide/show checks |
| GPU lifecycle | No monotonic resource growth over repeated open/close cycles | Trace renderer counters/memory trend with known retained caches |
| AI | Immediate pending/cancel feedback; disclose delay and preserve the task | Test delayed, cancelled and failed requests; model latency is measured, not promised |

Lazy-load 3D and advanced analysis after intent. Keep a stable static/2D presentation while loading. Limit pixel ratio and optional effects based on measured device behaviour; pause artwork when it cannot be seen. Clean up scene listeners, controls, geometries, materials, textures, targets and renderer ownership appropriately. Repeated React mounts must not leave animation loops running.

Measure controls, typing and scrolling with dense content and incoming observations. Throttle display updates independently of event recording so a sensor stream cannot flood React renders or lose meaningful events.

## 17. Verification and regression protection

### 17.1 Existing checks

The root `npm run check` currently runs the prototype, design-system, Phase 8, spatial and Phase 1–4 checks. Preserve their ability to run. During migration record exact commands, results and source revision; historical pass counts are not new-build evidence.

### 17.2 Meaningful new checks

| Behaviour | Check |
|---|---|
| Rule parity | Same fixtures/actions produce equivalent outcomes and relevant state through the React adapter |
| Retained error state | Save-failed draft and unacknowledged submission survive and recover correctly |
| Snapshot integrity | Later observation/manual changes do not modify captured context |
| Unknown data | Missing/stale observations cannot silently become measured/current |
| Sandbox isolation | Training/what-if actions do not mutate bookings or restrictions |
| Public visibility | Student/private issue/evidence details do not leak into wall projections |
| Protected operations | AI/voice proposals cannot bypass normal validation or required staff decision |
| Persistence | Incompatible records and write failure have explicit recovery |
| 3D lifecycle | Open/close/fallback retains selection and cleans owned resources |
| AI source support | Referenced procedural claims agree with approved source and revision |

Tests cover user-visible rules, risky migrations and recovery. Do not create tests merely to mirror component markup or count decorative elements.

### 17.3 Manual and visual verification

Capture representative before/after views. Verify task hierarchy, accurate artwork, long content, loading/empty/error states, focus order/restoration, actual zoom, small-screen keyboard behaviour, readable charts and reduced motion. Use automated accessibility checks as one layer; retain manual screen-reader and participant checks.

## 18. Research and participant validation

### 18.1 Discovery

Begin recruiting during baseline/wireframes. A pragmatic exploratory start is 4–6 students, one faculty member and one technician, with a permitted setup-to-cleanup observation if possible. Use recent concrete experiences: locating equipment, preparation, failed sessions, sharing resources, cleanup and trusted help.

Seek different levels of familiarity and relevant access needs. Avoid questions that invite approval of the proposed AI features. Label comparable-lab observations accurately when the actual proposed room is inaccessible. Participants provide evidence; AI may assist organising anonymised notes but cannot substitute for fieldwork.

### 18.2 Synthesis

Tag each claim as stated, observed, document-derived or hypothesised. Trace findings to personas/empathy/journey changes, problem priority and design decisions. Retain contradictory cases and the limits of convenience sampling.

### 18.3 Task testing

Extend the existing [participant plan](./research/PHASE_09_TEST_PLAN.md). Test finding/preparing, conflicting reservation, correct check-in, evidence interpretation, changed/stale conditions, fault recovery, return and relevant staff planning/triage. Test assistant understanding against manual-only access where feasible, accounting for order/learning effects.

Record unaided/assisted/failed, errors, hesitations, prompts, contextual time and participant words with consent. Do not infer broad improvement percentages from a small sample.

Initial proposed critical-task target: at least four of five student participants complete each agreed critical student task unaided, with no observed false-safe or false-submission belief. Staff tasks need relevant staff evidence. Revise consequential problems and re-test with fresh participants where feasible; disclose participant reuse.

No fixed number of interviews guarantees marks or saturation. Report what the evidence supports and unresolved issues honestly.

## 19. Rubric excellence gates

All gates begin open. A gate passes only when its evidence exists and has been reviewed. A concept screen, future architecture or checklist tick cannot stand in for participant findings or connected hardware.

| Gate | Criterion | Acceptance condition | Evidence / reviewer |
|---|---|---|---|
| G-RES | User Research · 10 | Real student/staff evidence; traceable findings; updated maps; explicit remaining hypotheses and sample limits | Notes, synthesis and decision links / research + design review |
| G-PRO | Problem Analysis · 10 | Priority features map problem -> evidence/assumption -> requirement -> solution -> validation; consequential alternatives justified | Traceability and decision records / product review |
| G-SPA | Space Planning · 15 | Dimensioned 70 m² plan agrees with geometry; zones/services/storage/signage/safety covered; whole-class scenario and site assumptions documented | Plan layers, equipment/rotation schedule and walkthrough / spatial + staff review |
| G-UI | UI Design · 15 | Required families reconciled; key wireframes and high-fidelity views; task-specific mobile/wall views and consequential states; no unresolved critical legibility/layout problem | Coverage ledger, annotated frames and captures / design + access review |
| G-UX | UX Design · 15 | IA and core tasks tested; proposed critical-task target assessed; false-outcome misunderstandings addressed; consequential changes re-tested | Task logs and iteration record / UX review |
| G-INN | Innovation & Smart Features · 10 | Useful connected smart journey; appropriate sources/freshness; actual AI or clearly labelled simulation; evaluated explanations and meaningful consequences | Demo, source contracts, AI cases and limits / product + technical review |
| G-ACC | Accessibility & Safety · 10 | Manual keyboard/screen-reader/zoom/device checks; 3D/camera/voice alternatives; CCTV/ventilation/hazard/emergency and physical fallback concepts; qualified-review dependencies clear | Test/fix log and safety sheet / access + spatial review |
| G-DEM | Prototype & Demonstration · 10 | Full E01/E06 selected routes and fault/recovery behave coherently; stable IDs; relevant baseline/new checks pass; launch/backup work | Build/revision, checks and recording / engineering + demonstration review |
| G-DOC | Presentation & Documentation · 5 | Ten report sections, complete deliverable/evidence index, current links/source handoff and rehearsed fifteen-minute presentation | Report/deck/appendix/index / editorial + final review |

Horizontal gates: **G-ART** requires rendered, purposeful art with preserved hierarchy and scientific labels; **G-AI** requires the evaluated answer/action contract; **G-PERF** requires measured responsiveness and working fallback; **G-SUS** requires all five sustainability topics with physical and operational evidence; **G-PAR** requires existing rule/identity/geometry parity.

A genuinely blocking task/access/integrity defect fails release even if other areas look strong. Noncritical unresolved findings are documented with consequence and follow-up, not hidden to support an “excellent” label.

## 20. Report, presentation and assessor handoff

### 20.1 Required report structure

| Assignment section | Required content |
|---|---|
| Introduction | Lab context, users, scope and concise product premise |
| Problem Analysis | Evidence/assumption distinction, priorities and traceability |
| User Research | Methods, sample, findings, personas, empathy and journey |
| UI/UX Methodology | Discovery, alternatives, prototyping, testing and revision |
| Design Process | Decisions, service blueprint, art direction and trade-offs |
| Wireframes | Selected annotated flows and truthful chronology |
| Final Prototype | Current screens/routes, smart/AI journey, recovery and limits |
| Floor Plan | Dimensioned 70 m² plan, layout/services/signage/safety and assumptions |
| Technology Stack | Actual current/final build versus proposed integrations; React/AI architecture and verification |
| Conclusion | Supported outcomes, unresolved constraints and next development |

Add references and an evidence appendix. Material/product, safety and accessibility references need an applicability check rather than copying historical summaries as certification.

### 20.2 Fifteen-minute presentation

| Segment | Minutes |
|---|---:|
| Problem and product premise | 1.5 |
| Research evidence | 2.0 |
| Decisions and process | 2.0 |
| Physical layout, safety and sustainability | 2.0 |
| UI/UX and art direction | 2.0 |
| Connected prototype + AI demonstration | 4.0 |
| Validation, limitations and conclusion | 1.5 |
| **Total** | **15.0** |

Rehearse actual duration. Prepare a backup recording and static route sequence, with the same labels and sources as the live demonstration. Do not rely on untested connectivity or a fresh AI answer to reveal the only important evidence during assessment.

### 20.3 Handoff

Provide one entry point, current Figma index, report/deck, key design exports, editable room/design/source files, tested launch instructions, dependency lockfile for the React build, and evidence/limitations index. Update the Figma index for Phase 9 and subsequent additions when those artifacts actually exist.

Use a requirement coverage ledger: requirement, artifact/route/frame, status (designed/simulated/connected/tested), source revision, evidence and unresolved limitation. Check links from a clean assessor start rather than only the developer's current session.

## 21. Team responsibilities and decision discipline

Think in accountable workstreams; this document does not create agents or assume a larger student team.

| Responsibility | Owns | Required handoff |
|---|---|---|
| Product/research | Needs, priorities, methods, synthesis and rubric traceability | Evidence-backed feature contracts |
| Experience/design | IA, wireframes, task compositions, tokens and access | Frames, states and interaction contracts |
| Spatial/art | Plan, services, wayfinding, material concepts and art | Geometry-consistent exports and source/claim labels |
| Frontend/domain | React, adapters, persistence and scientific UI | Parity results and stable routes |
| AI/backend | Approved knowledge, server boundary, tools and evaluations | Evaluated answers and failure/permission behaviour |
| QA/editorial | Cross-role walkthrough, access/performance, report and demonstration | Gate evidence and current handoff |

If three students form the team, distribute these workstreams and rotate cross-review; record actual contributions. The owner and reviewer of a consequential change should be identifiable. Senior-team practice means clear decisions and reviewed evidence, not an unnecessarily large toolchain.

Keep a decision log: trigger/evidence, considered options, choice, consequences, affected artifacts, owner and verification. Update the actual implementation ledger at each milestone; retain earlier design history.

## 22. Milestones and dependency order

| Milestone | Work | Exit gate |
|---|---|---|
| M0 · Baseline and evidence | Preserve current work, capture checks, reconcile coverage, recruit participants, start report/deck skeleton | Baseline reproducible; priority assumptions and evidence plan explicit |
| M1 · Wireframes and React foundation | Key alternatives/wireframes, typed domain adapter, tokens/routes, first E01/E06 parity slice | No existing rule/identity regression in migrated slice |
| M2 · Full journey parity | Student recovery/receipt/return, technician/public projections and map bridge | G-PAR and migrated critical-route verification |
| M3 · Connected smart and AI slice | Dashboard, observations/snapshots, manual lifecycle and real Q&A or explicit simulation mode | Source/freshness/action contracts and initial G-AI evidence |
| M4 · Learning, operations and art | Prediction/reflection, reproducibility, selected staff planning/collaboration, art/safety/sustainability sheets | Required coverage plus reviewed learning/spatial/art outputs |
| M5 · Participant and technical revision | Sessions, fixes/re-tests, access/device/performance and AI evaluation | Rubric/horizontal gates assessed with evidence and disclosed limits |
| M6 · Final submission | Report/deck, source/evidence index, clean launch, Figma index and rehearsal | G-DOC and G-DEM final review |

Research starts at M0 and continues through M5. Document drafting runs alongside design and implementation. Do not defer all research until after the UI is frozen. Conditional AR/voice/live-device integrations follow the coherent core; they cannot displace missing report or testing evidence.

## 23. Risks and unresolved facts

| Risk | Response |
|---|---|
| Feature accumulation obscures the main task | Require a job, owner and acceptance condition; use progressive disclosure |
| React rewrite changes operational rules | Typed adapter and differential parity; additive rollout |
| AI sounds authoritative with insufficient evidence | Supported references, uncertainty path and human responsibility |
| Manual/source drift | Revisioned approval and immutable captured context |
| Two apps write incompatible browser records | Separate comparison state; explicit one-writer cutover |
| Sensors or 3D produce misleading confidence | Separate origin/quality/readiness; preserve static/unknown paths |
| Art reduces legibility or spatial clearance | Purposeful composition and rendered/geometry checks |
| Energy standby interrupts active work | Eligibility/exclusions and validated proposed action |
| Access to people/site/hardware is unavailable | Complete independent design work; report genuine missing evidence without invention |
| Deadline remains ambiguous | No dated delivery promise until institution/user establishes actual date |

## 24. Implementation kickoff and release checklist

### 24.1 First concrete implementation slice

Create the separate React app, import the existing token source, adapt the current rule engine, and migrate Today -> Prepare -> Reserve for both E01 and E06 including the conflict. Establish actual build, keyboard and rule-parity evidence before expanding. This proves the architecture without risking the entire working prototype.

Then complete the existing journey parity before making new smart features the primary demonstration. AI/manual retrieval can be prepared independently against approved material; actual API setup is required only when implementing the real service.

### 24.2 Release checklist

- [ ] Existing prototype, tokens, geometry and identities preserved.
- [ ] React rule/error-state parity and persistence failure paths verified.
- [ ] Explicit assignment requirements and all 34 family coverage reconciled.
- [ ] Actual discovery evidence and honest hypothesis labels present.
- [ ] Required wireframes and design decisions reviewable.
- [ ] Smart/AI journey and numerical/source boundaries evaluated.
- [ ] Safety/CCTV/ventilation/hazard and sustainability sheets complete.
- [ ] Art assets rendered and reviewed at their intended sizes.
- [ ] Participant revisions/re-tests and access/device/performance checks recorded.
- [ ] Full report, fifteen-minute deck, current links and editable handoff verified.
- [ ] Conditional integrations labelled accurately and remaining constraints disclosed.

At blueprint authoring these remain unchecked. The blueprint itself is the completed artifact, not the implementation it describes.

## 25. Source register

### Project grounding

- [Phase 9 prototype and verification](./design/PHASE_09_PROTOTYPE_AND_VERIFICATION.md).
- [Phase 8 3D and interaction](./design/PHASE_08_3D_AND_INTERACTION.md).
- [Phase 7 staff, mobile, wall and signage](./design/PHASE_07_COMPLETE_SYSTEM.md).
- [Physical plan and 3D foundation](./spatial/PHASE_04_SPACE_AND_3D.md).
- [Design system](./design/PHASE_05_DESIGN_SYSTEM.md).
- [Research plan and hypothesis evidence](./research/PHASE_02_RESEARCH_AND_EXPERIENCE.md).
- [Decisions and assumptions](./planning/DECISIONS_AND_ASSUMPTIONS.md).

### Official technical sources

Reviewed 3 October 2026. Product priorities, feature scope, sample targets and performance budgets are project recommendations; they are not requirements from these sources.

- [React adoption in an existing project](https://react.dev/learn/add-react-to-an-existing-project): incremental integration guidance.
- [React useReducer](https://react.dev/reference/react/useReducer): pure reducer/new-state-reference requirements and development behaviour.
- [Vite guide](https://vite.dev/guide/): React/TypeScript tooling and runtime compatibility.
- [React Router modes](https://reactrouter.com/start/modes): Data Mode versus other routing approaches.
- [Three.js cleanup](https://threejs.org/manual/pages/cleanup.html): explicit disposal of owned GPU resources.
- [Vitest guide](https://vitest.dev/guide/): test tooling and compatibility.
- [Playwright introduction](https://playwright.dev/docs/intro): browser test capabilities.
- [Node HTTP](https://nodejs.org/api/http.html): minimal server-service foundation; use installed-version documentation during implementation.
- Hosted file search: approved-knowledge retrieval and file references.
- Hosted function calling: application-mediated records/actions.
- Hosted evaluation best practices: representative task-specific tests and human review; no particular hosted evaluation product is selected here.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): accessibility reference; automated checks alone do not establish conformance.
