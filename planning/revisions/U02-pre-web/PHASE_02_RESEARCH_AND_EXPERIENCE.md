# Phase 2 — Research and Experience Definition

Project: PARALLAX Signal and Computer Vision Lab (working name).
Date: 2 October 2026, Asia/Calcutta.
Status: Phase 2 opened. Research instruments are ready; every user insight below is a **hypothesis** until it is backed by consented interview, observation, or artefact evidence.
Canonical design file: [Figma — PARALLAX Phase 2](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF).
Inputs: [Design brief](../.design/brief.md), [Phase 1 execution brief](../planning/PHASE_01_EXECUTION_BRIEF.md), [Decisions](../planning/DECISIONS_AND_ASSUMPTIONS.md), [Blueprint](../PARALLAX_DESIGN_BLUEPRINT.md).

## Evidence tags

Every statement in Phase 2 carries one tag. The Figma boards use the same tags as coloured chips.

| Tag | Meaning | May be used as a design requirement? |
|---|---|---|
| `H` Hypothesis | Designer inference from the brief, blueprint, or domain knowledge | Only as a provisional requirement, linked to a validation method |
| `I` Interview | Stated by a consented participant | Yes, with participant code |
| `O` Observed | Seen during contextual observation | Yes, with session code |
| `A` Artefact | Found in a real document, log, sheet, or room audit | Yes, with artefact code |
| `D` Decision | Committed by the team with a recorded rationale | Yes |
| `S` Secondary | Published study or report about labs in general | Supports a need; never moves a hypothesis to supported on its own |
| `?` Open | Unknown fact, tracked in A01–A10 | No |

No participant quotations, percentages, or findings are invented. Persona and empathy content is written as "likely" behaviour to be confirmed.

---

## 1. Research plan

### Objectives

| ID | Objective |
|---|---|
| RO1 | Understand how students prepare for, run, and report signal and vision experiments today. |
| RO2 | Find where equipment discovery, booking, and kit completeness break down. |
| RO3 | Understand how faculty plan sessions, take attendance, and assess experimental evidence. |
| RO4 | Understand how technicians handle faults, calibration, asset movement, and kit return. |
| RO5 | Identify physical, access, and safety barriers inside a 70 m² lab. |

### Research questions

| ID | Question | Objective | Method |
|---|---|---|---|
| RQ01 | What does a student do between receiving an experiment and arriving at the bench? | RO1 | M1, M2 |
| RQ02 | How do students find out which devices and accessories a setup needs? | RO2 | M1, M4 |
| RQ03 | When is an incomplete or faulty kit discovered, and what happens next? | RO2, RO4 | M1, M2, M4 |
| RQ04 | How are acquisition settings, captures, and results recorded today? | RO1 | M2, M4 |
| RQ05 | How do faculty know whether a cohort is ready before a session? | RO3 | M1 |
| RQ06 | How is attendance taken and corrected, and who is allowed to correct it? | RO3 | M1, M4 |
| RQ07 | How are faults reported, triaged, and communicated to future users? | RO4 | M1, M4 |
| RQ08 | How does a technician know where every asset is and who last used it? | RO4 | M1, M3 |
| RQ09 | Which spatial conditions disrupt capture, audio acquisition, or movement? | RO5 | M2, M3 |
| RQ10 | Which navigation labels match how students describe lab tasks? | RO1 | M6 |

### Methods

| ID | Method | Who | Planned size | Output |
|---|---|---|---|---|
| M1 | Semi-structured interviews (30–40 min) | Students (novice and experienced), faculty, technicians | 6–8 students, 2–3 faculty, 1–2 technicians | Coded notes, affinity map |
| M2 | Contextual observation of a real lab session, setup to cleanup | One teaching session, one open-access session | 2 sessions | Observation log, timed task steps |
| M3 | Room and equipment audit | Team with technician | 1 visit | Measured sketch, inventory sheet, photos (no people) |
| M4 | Artefact review | Manuals, booking sheets, registers, fault logs | All available | Artefact register (A-codes) |
| M5 | Short descriptive survey (optional) | Students who use the lab | ≥ 20 responses | Descriptive counts only; no statistical claims |
| M6 | Open card sort for navigation | Students | 8–12 | Label and grouping recommendations |
| M7 | Assumption tests on low-fidelity flows | Students, one technician | 5 per round | Task observations, revised flows |

### Recruitment screener (students)

1. Have you used an engineering lab for a signal or vision experiment this year? (Yes → continue)
2. How many lab sessions have you attended in this subject? (0–2 → novice; 3+ → experienced; aim for both)
3. Have you booked or borrowed lab equipment yourself? (balance yes/no)
4. Do you use any assistive technology or prefer particular access settings? (optional; invites inclusion, never required)
5. Are you comfortable with an audio-recorded interview? (consent route)

### Interview guide — student (excerpt)

- Warm-up: course, recent experiment, how often in the lab.
- Walk me through the last experiment from the moment you heard about it.
- How did you know what equipment you needed? What was missing or unclear?
- What happens when something on the bench does not work?
- How did you record settings and results? Show me if you can.
- What made writing the report easy or hard?
- If you could change one thing about the lab room itself, what would it be?
- Close: anything we should have asked?

Faculty and technician guides follow the same shape, focusing on RQ05–RQ08.

### Consent and data handling

- Written consent states purpose, recording, retention, and withdrawal.
- Participants are coded (S01, F01, T01); names are not stored with notes.
- Photos show rooms and equipment only, never identifiable people (A10).
- Raw notes are kept separate from interpretation; quotations are verbatim and attributed only by code.
- Research data is deleted at the end of the project unless the institution requires otherwise.

### Synthesis approach

1. Transcribe notes into atomic observations, each with its tag and source code.
2. Affinity map into five themes: Preparation, Resource access, Experimentation, Evidence, Operations.
3. Update each hypothesis (H01–H12) to Supported, Refuted, or Unclear.
4. Rewrite personas, empathy maps, and journeys using evidence; keep unsupported content visibly marked.
5. Update the requirement matrix and record changes in the decision register.

---

## 2. Assumption map

Plotted by impact on the design (if wrong) and current certainty. **Test first** = high impact, low certainty.

| ID | Hypothesis | Impact | Certainty | Validate with | Quadrant |
|---|---|---|---|---|---|
| H01 | Students discover missing or incompatible kit only at the bench. | High | Low | M1, M2 | Test first |
| H02 | Current booking covers room and time, not individual devices and accessories. | High | Low | M4, M1 | Test first |
| H03 | Acquisition settings are lost between capture and report writing. | High | Medium | M2, M4 | Test first |
| H04 | Faults are reported verbally and do not reach future bookers. | High | Low | M1 (T), M4 | Test first |
| H05 | Attendance is taken on paper and corrected informally. | Medium | Medium | M4, M1 (F) | Validate |
| H06 | Novice students hesitate with unfamiliar instruments and wait for help. | High | Medium | M2 | Test first |
| H07 | Faculty cannot see cohort readiness before a session starts. | Medium | Low | M1 (F) | Validate |
| H08 | Asset location relies on technician memory. | Medium | Low | M1 (T), M3 | Validate |
| H09 | Students already use phones for reference during experiments. | Medium | High | M2, M5 | Monitor |
| H10 | Circulation and uncontrolled light disturb camera capture. | High | Low | M2, M3 | Test first |
| H11 | A 3D map helps orientation more than it helps booking. | Low | Low | M7 | Explore later |
| H12 | Students treat model confidence as correctness. | Medium | Medium | M7 | Validate |

---

### Secondary research (added 2 Oct 2026)

| Source | Finding | Hypotheses |
|---|---|---|
| Eur. J. Eng. Educ. (2024), pre-lab resources and cognitive load | Unfamiliar equipment and manuals overload students; preparation reduces anxiety, raises confidence | H01, H06 |
| ELN provenance literature (PMC8802522) | Structured metadata capture enables reproducibility | H03 |
| Reservation-system research (ResearchGate 308925766) | Low equipment utilisation is common | H02 (context) |

See `research/STANDARDS_AND_SOURCES.md`.

---

## 3. Personas (hypothesis)

Personas are role archetypes. Demographic details that do not change design decisions are deliberately omitted. Each persona lists the hypotheses it depends on.

### PA — The First-Run Experimenter (primary)

- Context: early in the course; first time on the vision rig; uses a laptop and phone.
- Goals: understand what the experiment is asking; arrive with the right setup; avoid looking lost.
- Likely frustrations: unclear kit list (H01); unfamiliar controls (H06); unsure what evidence counts.
- Behaviours: reads the brief late; follows peers; photographs the bench with a phone (H09).
- Needs → design: preparation checklist (P05), complete-kit booking (P06), setup illustration and readiness check (P11), labelled workbench stages (P12).
- Access considerations: may prefer reduced motion; benefits from plain-language labels.
- Hypothesis statement: "I want to know exactly what to bring and what to do first, before I'm at the bench."

### PB — The Advanced Builder (primary)

- Context: final-year; runs extended investigations; reuses configurations.
- Goals: fast access to precise parameters; reproducible results; publishable evidence.
- Likely frustrations: settings not recorded with captures (H03); equipment unavailable without warning (H04).
- Needs → design: saved configurations (P12), provenance strip (C39), comparison viewer (P14), stable submission revision (P16), project gallery (P17).
- Hypothesis statement: "If I can't reproduce it, it didn't happen."

### PC — The Instructor (primary staff)

- Context: runs scheduled teaching sessions for a cohort; assesses reports.
- Goals: sessions start on time with ready kits; fair attendance; assessment linked to evidence.
- Likely frustrations: no readiness view (H07); paper attendance (H05); reports without settings (H03).
- Needs → design: faculty workspace with readiness and roster (P27), schedule (P19), evidence-linked rubric (P28).
- Hypothesis statement: "I need to know who is ready before the session, not halfway through it."

### PD — The Lab Technician (primary staff)

- Context: maintains equipment, calibration, storage, and returns.
- Goals: know where every asset is; catch faults before they affect classes; complete returns.
- Likely frustrations: verbal fault reports without context (H04); location by memory (H08); missing accessories after sessions.
- Needs → design: technician console with fault queue and movement history (P25), calibration record (P26), return check (P11 variant), QR passport (P09).
- Hypothesis statement: "A fault I hear about after the class is a fault I couldn't prevent."

### PE — The Administrator (secondary)

- Goals: correct roles and resource definitions; defensible capacity reporting.
- Needs → design: administration (P30), access management flow (W10), audit events.

### PF — The Visitor (tertiary)

- Goals: orientation and approved demonstrations without private records.
- Needs → design: wall display (P32), public notices (P22), project gallery public view (P17).

Inclusive overlays applied to every persona: keyboard-only use, colour-vision variation, motion sensitivity, low bandwidth (blueprint G10.09–G10.12).

---

## 4. Empathy maps (hypothesis)

### PA First-Run Experimenter — during the vision experiment

- Likely says: "Which camera are we supposed to use?" · "Is this the right cable?"
- Likely thinks: "Everyone else seems to know what they're doing." · "Did I save that?"
- Likely does: checks the brief on a phone; waits for the instructor; retakes captures.
- Likely feels: anxious at setup; relieved after the first good capture; uncertain about the report.
- Pains: incomplete kit; unclear first step; lost settings.
- Gains: a clear checklist; confidence before arriving; evidence that writes the report's method for them.

### PC Instructor — running a teaching session

- Likely says: "Has everyone checked in?" · "Which station is free?"
- Likely thinks: "Two kits are probably incomplete again."
- Likely does: walks the room; marks attendance; fixes setups; answers repeated questions.
- Likely feels: stretched across stations; frustrated by preventable delays.
- Pains: no readiness signal; manual attendance; inconsistent evidence quality.
- Gains: readiness at a glance; attendance from check-in; rubric linked to evidence.

### PD Technician — handling a faulty camera kit

- Likely says: "When did this stop working?" · "Who had it last?"
- Likely thinks: "Who else booked this kit this week?"
- Likely does: tests the device; searches for accessories; updates a log; tells faculty.
- Likely feels: interrupted; responsible for problems they could not see coming.
- Pains: symptom-free reports; unknown last user; no link from a fault to future bookings.
- Gains: structured reports with asset ID; automatic impact on bookings; verification record.

---

## 5. Journey maps

### J1 Student — vision experiment E06 (W01)

| Stage | Discover | Prepare | Reserve | Arrive & check in | Capture | Analyse | Document | Submit & return |
|---|---|---|---|---|---|---|---|---|
| Actions | Opens assigned experiment | Reads objective, checks prerequisites | Picks time, reserves full kit | Finds station CV-03, verifies kit | Sets lighting and camera, captures | Runs detection, compares lighting conditions | Records observations and limits | Submits revision, returns kit |
| Touchpoints | P02, P04 | P05 | P06, P07 | Signage, P10, P11 | Capture zone C1, P12 | P14 | P15 | P16, P11 return |
| Likely emotion | Curious | Uncertain | Neutral | Anxious | Focused | Engaged | Tired | Relieved |
| Pain points (H) | Too many similar experiments | Kit list unclear (H01) | Room booked, devices not (H02) | Missing accessory (H01) | Light changes mid-capture (H10) | Confidence read as correctness (H12) | Settings lost (H03) | Unclear if submission is final |
| Opportunities | Topic filters, duration, prerequisites | Checklist that transfers to booking | Complete-kit reservation with conflicts | Same manifest at check-in; report issue inline | Recording indicator; settings captured automatically | Confidence vs ground truth explained | Evidence embeds with provenance | Stable revision + return checklist |

### J2 Technician — camera kit fault (W02)

Report received (P23) → triage with asset context (P25) → restrict asset (P09 status, P06 availability) → notify affected bookings (P33) → repair and verify (P26 / P25) → restore availability.
Moments that matter: the report carries asset ID and symptoms; restriction instantly affects every availability view; verification is recorded before restoring.

### J3 Instructor — teaching session (W04)

Assign experiment (P27) → reserve cohort resources (P19, P06) → review readiness (P27) → run session; attendance from check-in (P11 → P27) → correct attendance with reason (P27) → assess evidence (P28).

### Service blueprint — camera kit fault exception

| Layer | 1 Report | 2 Triage | 3 Restrict | 4 Re-route | 5 Repair & verify | 6 Restore |
|---|---|---|---|---|---|---|
| Student | Reports fault from P09/P11 | — | Sees "restricted" on kit | Accepts alternative time or setup | — | Sees kit available |
| Frontstage digital | P23 issue form, asset preselected | — | P09, P06, P10 show restriction | P33 notice, P07 reschedule | — | P09 ready state |
| Physical | QR label on kit | Technician inspects at S1/C1 | Kit tagged in storage | Alternate kit issued | Calibration target | Kit returned to bay |
| Technician (backstage) | — | P25 queue, priority | Applies restriction rule | Confirms substitute | P26 record, evidence | Verification sign-off |
| Data / systems | Issue record | Issue ↔ asset link | Resource condition | Booking revalidation | MaintenanceRecord | Audit event |

---

## 6. Problem analysis

### Problem statements

| ID | Problem | Linked hypotheses |
|---|---|---|
| PS1 | Students cannot see a complete, compatible setup before arriving. | H01, H02 |
| PS2 | Evidence loses its settings and source between bench and report. | H03, H12 |
| PS3 | Faults are invisible to the next person who books the equipment. | H04 |
| PS4 | Staff lack readiness and attendance visibility during sessions. | H05, H07 |
| PS5 | Asset location and movement depend on memory. | H08 |
| PS6 | The physical room can undermine capture quality and orientation. | H10, H11 |

### How might we

- HMW make a complete setup the unit of booking, not the room? (PS1)
- HMW make every result carry its own method? (PS2)
- HMW let one fault report protect every future booking? (PS3)
- HMW give instructors readiness before the session starts? (PS4)
- HMW turn every move of an asset into a record without extra work? (PS5)
- HMW let the room and the software share one map? (PS6)

### Requirements (provisional until validated)

| ID | Requirement | Problem | Priority | Pages |
|---|---|---|---|---|
| R01 | Experiments declare a versioned kit with accessory quantities. | PS1 | Must | P05, P06 |
| R02 | A booking reserves every required resource for the same interval. | PS1 | Must | P06, P07 |
| R03 | Conflicts preserve the user's choices and offer alternatives. | PS1 | Must | P06 |
| R04 | Check-in reuses the booking manifest and records attendance. | PS1, PS4 | Must | P11, P27 |
| R05 | Every capture stores source, settings, and timestamp automatically. | PS2 | Must | P12 |
| R06 | Every processing output links input, parameters, and version. | PS2 | Must | P12, P14 |
| R07 | Confidence is labelled separately from correctness. | PS2 | Must | P14 |
| R08 | Notebook embeds keep evidence identity and provenance. | PS2 | Must | P15 |
| R09 | Submissions freeze a stable evidence manifest revision. | PS2 | Must | P16 |
| R10 | Issue reports preselect asset ID and capture symptoms. | PS3 | Must | P23, P09 |
| R11 | A restriction updates passport, booking, and map availability together. | PS3 | Must | P09, P06, P10 |
| R12 | Affected bookings are notified with an alternative. | PS3 | Should | P33, P07 |
| R13 | Restoring availability requires recorded verification. | PS3 | Must | P25, P26 |
| R14 | Instructors see cohort readiness before a session. | PS4 | Should | P27 |
| R15 | Attendance corrections record actor, reason, and time. | PS4 | Must | P27 |
| R16 | Asset moves record from/to location, actor, time, and reason. | PS5 | Must | P25 |
| R17 | QR and manual ID entry resolve to the same asset record. | PS5 | Must | P31, P09 |
| R18 | Zone and asset IDs are shared by signage, plan, and software. | PS6 | Must | P10, signage |
| R19 | Every 3D task has a list or 2D equivalent. | PS6 | Must | P10, P13 |
| R20 | Capture zone placement avoids through-circulation (spatial). | PS6 | Must | Floor plan |

---

## 7. Information architecture

- Shared header: Search · Notifications (P33) · Profile & preferences (P34) · **Safety (P24, always reachable)** · Help (P23).
- Student: My Lab (P02) · Experiments (P04 → P05) · Bookings (P06, P07) · Equipment (P08 → P09) · Lab Map (P10) · Projects (P17 → P18) · Library (P20, P21).
- Active session (contextual, not in main nav): Check-in (P11) → Workbench (P12) ↔ Scene Studio (P13) → Results (P14) → Notebook (P15) → Submit (P16).
- Faculty adds: Teaching (P27 planning + attendance, P19 schedule) · Review (P28).
- Technician adds: Operations (P25 console, P26 calibration, P03 live lab).
- Administrator adds: Administration (P30, P29 energy).
- Outside the app shell: Access (P01) · Mobile companion (P31) · Wall display (P32) · Public notices (P22).

Coverage: shell 4 + student nav 13 + session 6 + faculty 3 + technician 3 + admin 2 + outside shell 4 = 35 placements; P03 appears in two views of one family, so all 34 page families are placed exactly once.

Navigation labels are plain; expressive subtitles live on pages. Card sorting (M6) validates labels before Phase 5.

---

## 8. User flows

### F1 Student experiment (W01)

Start: My Lab → Experiment brief → prerequisites met? (no → resolve access) → Reserve complete kit → available? (no → alternative time/setup, choices kept) → Booking confirmed → Arrive, scan station → kit complete? (no → report issue, substitute) → Capture → processing ok? (no → keep inputs, retry) → Compare results → Record observations → evidence complete? (no → back to review) → Submit revision → Return kit → End.

### F2 Equipment fault (W02)

Start: QR or passport → Report issue (asset preselected) → Technician triage → restriction needed? (yes → restrict, notify affected bookings, offer alternatives) → Repair → verification passed? (no → stays restricted) → Restore availability → End.

### F3 QR lookup (W05)

Start: Scan QR → camera permission? (no → type asset ID) → Asset found in this lab? (no → explain location) → Passport → choose: Instructions (P20) / Book (P06) / Report (P23).

### F4 Spatial discovery and booking (W08)

Start: Lab Map → 3D available? (no → 2D plan) → search CV-03 or C1 → zone details → choose compatible setup → booking studio with zone context → interval valid? (no → conflict, selection preserved) → confirm.

### F5 Kit return (W03)

Start: Stop acquisition → evidence saved? (no → save first; a draft is never marked submitted) → return checklist → all items and quantities present? (no → missing item creates follow-up issue) → condition OK? (no → damage reaches technician queue) → resource released per policy → End.

### F6 Teaching session (W04)

Start: Assign template → approved and current? (no → review revision) → schedule session (P19) → reserve cohort kits → enough complete kits? (no → capacity shown; split or reschedule) → review readiness (R14) → attendance from check-in → attendance correct? (no → correct with reason, audited, R15) → assess evidence (P28).

### F7 Project publication (W06)

Start: Prepare narrative → review evidence manifest → all evidence publishable? (no → restricted dataset excluded, gap captioned) → choose audience → approved by reviewer? (no → revise and resubmit) → publish stable revision (P18) → appears in gallery (P17).

### F8 Camera calibration (W07)

Start: Calibration due or after repair → confirm asset and target → capture reference views → pose coverage sufficient? (no → capture more) → estimate and inspect error → meets lab policy? (no → stays restricted, prior record kept) → readiness updated → calibration revision saved.

### F9 Scene Studio learning (W09)

Start: Spatial experiment brief → renderer supported and wanted? (no → prepared static comparisons) → choose preset → change one parameter → compare camera image → configuration realistic? (no → limit explained, reset) → record observation → relate to physical capture.

### F10 Access management (W10)

Start: Request access (P01) → administrator reviews (P30) → approved? (no → clear outcome and next step) → assign permitted role → audit event → access summary (P34) → authorised tasks open (P02). Visible navigation never grants permission (G23.14).

### Coverage

| Workflow | Flow | Requirements |
|---|---|---|
| W01 Student experiment | F1 | R01–R09 |
| W02 Equipment issue | F2 | R10–R13 |
| W03 Kit return | F5 | R04, R16 |
| W04 Teaching session | F6 | R14, R15 |
| W05 QR lookup | F3 | R17 |
| W06 Project publication | F7 | R09 |
| W07 Camera calibration | F8 | R13 |
| W08 Spatial discovery & booking | F4 | R18, R19 |
| W09 Scene Studio learning | F9 | R19 |
| W10 Access management | F10 | G23.14 |

---

## 8b. Laboratory activity inventory

Assignment requirement "laboratory activities". Zones follow the provisional plan; frequencies are left for M2 observation.

| Activity | Who | Where | Pages | Status |
|---|---|---|---|---|
| Prepare and read the brief | Student | Anywhere | P04, P05 | H01, H06 |
| Reserve a complete setup | Student, faculty | Remote | P06, P07 | H02 |
| Check in and set up | Student | CV-01–06, C1, S1 | P10, P11 | H01 |
| Capture images | Student | Capture zone C1 | P12, P13 | H10 |
| Acquire signals | Student | Signal bench S1 | P12 | H03 |
| Process and analyse | Student | CV-01–06 | P12, P14 | H12 |
| Document and submit | Student, team | Stations or remote | P15, P16 | H03 |
| Return the kit | Student, technician | Storage | P11, P25 | H01, H08 |
| Teach and supervise | Faculty | Whole room, demo area | P27, P19 | H05, H07 |
| Assess evidence | Faculty | Remote | P28 | H03 |
| Maintain and calibrate | Technician | S1, C1, storage | P25, P26 | H04, H08 |
| Demonstrate and orient visitors | Faculty, visitor | Collaboration and demo area | P32, P17 | Open (A05) |

---

## 9. Signal demonstrator decision (CAND07)

| Criterion | Weight | E01 Sampling & aliasing | E02 Noise filtering |
|---|---:|---:|---:|
| Concept is visible in one figure | 3 | 5 | 4 |
| Links to vision (samples → pixels) | 3 | 5 | 2 |
| Deterministic prototype fixture | 2 | 5 | 4 |
| Equipment burden | 2 | 4 | 4 |
| Risk of misleading claims | 2 | 4 | 3 |
| Curriculum fit | 3 | ? | ? |
| **Weighted (excluding curriculum)** |  | **56 / 60** | **40 / 60** |

Decision: **E01 Sampling and aliasing becomes the primary signal journey** (recommended, pending curriculum confirmation). E02 stays as the secondary signal scenario. Scores are designer judgement, not research data.

Worked example for the figure: an 11 Hz signal sampled at 12 Hz appears as |11 − 12| = 1 Hz. Validity rule: never imply that interpolation restores information lost below the Nyquist rate.

### Vision counterpart — E06 object detection under lighting

- Learning question: how does lighting change what a detector finds in a fixed scene?
- Recorded parameters (R05): exposure, light position, model version, detection threshold.
- Evidence (R06): capture series, detection overlays, limitations and failure examples.
- Validity (R07): confidence is not accuracy; object-only scenes, no people (A10).
- The Figma figure (three lighting conditions, two detections and one miss) is an illustrative fixture, not a measurement.

---

## 10. Phase 2 gate

Completed in this pass:

- [x] Research plan, screener, guide, consent, synthesis approach.
- [x] Assumption map with test-first priorities.
- [x] Six hypothesis personas with evidence dependencies.
- [x] Three empathy maps (hypothesis).
- [x] Student journey, technician and instructor journeys, fault service blueprint.
- [x] Problem statements, HMW, 20 provisional requirements with page traceability.
- [x] Role-aware information architecture placing all 34 page families.
- [x] Ten workflow flows (W01–W10) with exception branches.
- [x] Signal demonstrator recommendation (E01) and vision evidence specification (E06).
- [x] Laboratory activity inventory with zones and pages.

Requires real-world input before Phase 2 can be called evidence-backed:

- [ ] Recruit and interview participants (M1).
- [ ] Observe at least one session (M2) and audit the room (M3).
- [ ] Collect artefacts (M4) and update H01–H12 status.
- [ ] Run card sort (M6) to confirm navigation labels.
- [ ] Confirm curriculum fit for E01.
