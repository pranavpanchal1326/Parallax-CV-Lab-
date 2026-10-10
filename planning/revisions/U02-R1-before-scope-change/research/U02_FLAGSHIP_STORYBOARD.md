# PARALLAX — from conditions to a defensible claim

U02-R1 · 3 October 2026 · **authored scenario, not a participant session**. Seven frames use existing Figma P6-A exports and the EX-2.2 React comparison screenshot. Mixed revisions are labelled; this is a product narrative, not a claim of visual parity or a single captured live run. The original Figma scenes are static fixtures; the React comparison uses local example records.

## ST01 · Understand the question

![E01 preparation screen: method and generated-signal boundary before reservation.](../design/figma-build/thumbs/phase-06_view-2089-1403.jpg)

**Image origin:** Original Figma P6-A · preparation E01.

An authored student prepares to compare sampling conditions and identifies the required kit before reserving.

**Decision / structure:** D-U02-02 · WF02. **Evaluate:** T1: explain the method and what is required before booking.

## ST02 · Record a first condition

![E01 signal bench with the labelled 20 Hz generated sampling fixture.](../design/figma-build/thumbs/phase-06_view-2089-925.jpg)

**Image origin:** Original Figma P6-A · E01 20 Hz fixture.

The student records the higher-rate generated example. A fixture is a teaching reference, not a measurement from hardware.

**Decision / structure:** D-U02-03 · WF05. **Evaluate:** T5: identify source and recorded settings without interpreting first.

## ST03 · Change a condition, retain both

![E01 signal bench with the labelled 3 Hz generated sampling fixture.](../design/figma-build/thumbs/phase-06_view-2089-1040.jpg)

**Image origin:** Original Figma P6-A · E01 3 Hz fixture.

A second example changes sampling rate. The proposed reasoning task asks what is held constant and what could explain the difference.

**Decision / structure:** D-U02-03 · WF05. **Evaluate:** T5: distinguish sampling behaviour from claims about the underlying signal.

## ST04 · Replay what was retained

![React condition replay: retained examples, provenance and comparison table.](../apps/lab-web/evidence/conditions-light.png)

**Image origin:** React EX-2.2 · captured condition comparison.

The current React extension exposes recorded context, including observation freshness; it never replaces an old record with current settings.

**Decision / structure:** D-U02-03 · WF06. **Evaluate:** U-T14: identify changes, missing context and what cannot be concluded.

## ST05 · Write a bounded claim

![E01 notebook with student interpretation and evidence references.](../design/figma-build/thumbs/phase-06_view-2089-1409.jpg)

**Image origin:** Original Figma P6-A · E01 notebook.

The student explains the comparison and limitations. No AI-authored final claim or automatically proven conclusion is implied.

**Decision / structure:** D-U02-03 · WF07. **Evaluate:** T5/T6: connect an own-word claim to evidence and distinguish draft from saved work.

## ST06 · Notice the missing acknowledgement

![E01 submission failure state indicating pending acknowledgement and recovery.](../design/figma-build/thumbs/phase-06_view-2089-1413.jpg)

**Image origin:** Original Figma P6-A · E01 pending submission.

A lost acknowledgement leaves the request pending. The student can recover without treating a click as confirmation.

**Decision / structure:** D-U02-04 · WF08. **Evaluate:** T6 extension: state what is known before retrying.

## ST07 · Confirm the receipt; close the session

![E01 confirmed receipt with separate guidance to leave the fixed bench ready for the next session.](../design/figma-build/thumbs/phase-06_view-2089-1415.jpg)

**Image origin:** Original Figma P6-A · E01 confirmed receipt.

E01 has no portable items to return. Its fixed-bench session still needs a separate close action after receipt; E06 includes a physical kit return. The frozen revision remains the submitted record.

**Decision / structure:** D-U02-04 · WF08. **Evaluate:** T6 extension: distinguish confirmed receipt from a closed session.

## Recovery branches and cross-role consequences

| Trigger | Student-facing state | Responsible role / next step | Record boundary |
|---|---|---|---|
| Capture interruption | Recorded conditions remain; source loss is explicit; a prepared illustration stays labelled | Student chooses recovery or reports the named asset; technician owns physical investigation | No invented live sample or missing historical context; WF05 |
| Submission acknowledgement lost | Request remains pending; retry uses its retained identity | Student checks receipt; faculty receives the submitted revision only when confirmed | Local receipt model is not server-delivery evidence; WF08 |
| Return incomplete / equipment failure | Kit remains unresolved; affected users see qualified availability | Technician checks manifest, restricts if needed, repairs, verifies and explicitly releases | Movement, return, restriction and release are separate records; WF11/WF15 |

## Proposed help moment — U06 concept only

At comparison, optional help first asks the student what changed and what they think the evidence supports. It can point to a faculty-approved method passage or offer a small hint. The student returns to their own notebook. Missing or withdrawn source means abstain and offer staff/manual navigation. No live AI answer, automatic final claim, causal conclusion or equipment instruction is demonstrated in these frames. D-U02-06 remains a concept.

## Story acceptance

A reviewer can follow question → retained conditions → bounded claim → acknowledgement → remaining handover; locate three failure consequences; identify each source/fixture boundary; and find the corresponding structure and validation task. Actual user comprehension and faculty approval remain to be collected. [Rendered review](../design/research-u02/index.html#story) · [Wireframes](../design/wireframes/index.html).
