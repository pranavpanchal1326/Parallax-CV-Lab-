# Phase 9 — Participant test plan

Status on 3 October 2026: **written, not run.** No participant has been recruited and no result exists. Nothing in this file is a finding.

This plan turns blueprint §28 (G28.01–G28.15) into sessions that can be run with the demonstrator at `prototype/` and the two Phase 8 pages. It needs people, a room and consent that the project does not yet have (open facts A05, A06 and A10).

## 1. What the sessions are for

Scripted checks show that the rules hold. They cannot show whether a student understands the preparation page, notices a conflict, or knows what to do when the camera stops. Each task below has one question that only a person can answer.

## 2. Participants

| Role | Target | Screening |
|---|---|---|
| Student new to E06 or E01 | 5 | Has not done the chosen experiment; mixed familiarity with lab booking |
| Technician or lab assistant | 2 | Handles equipment faults or kit returns in any teaching lab |
| Faculty | 1–2 | Runs a practical session (for the walk-through of Phase 7 screens only) |

Include at least one keyboard-only user and one screen-reader user if they can be recruited. A sample this size is a convenience sample: report what was seen, not percentages or confidence (G28.14).

## 3. Before each session

- Read the consent script; record audio or screen only with written consent; store nothing that identifies a participant in the project folder.
- Press "Start again" in the demonstrator.
- Laptop at a desk for desktop tasks; a phone for T7.
- One facilitator, one note-taker. The facilitator does not point at the screen.
- Ask the participant to say what they expect to happen before each action (G28.11).

## 4. Tasks

| ID | Blueprint | Starting point | Say to the participant | What only a person can show |
|---|---|---|---|---|
| T1 | G28.01 | Today | "You have been assigned the lighting experiment. Find out what you need before you can book it." | Whether they can state the kit and the method in their own words afterwards |
| T2 | G28.02 | Reserve, E06 | "Book it for ten o'clock." | Whether they understand why 10:00 failed and take the offered time without help |
| T3 | G28.03 | Lab Map; then a printed S-04 asset tag | "Find the capture camera and tell me whether you could book it." Repeat by search and by QR or typed ID | Which entry they choose first and where they hesitate |
| T4 | G28.04 | Arrive | "You are at the desk. Check in and get started." Hand them a card reading CV-04 first | Whether the wrong-station message is enough to recover unaided |
| T5 | G28.05, G28.06 | Bench and Notebook, E01 | "Run both rates and write what you can and cannot conclude." | Whether the claim separates what the samples show from what is true of the signal |
| T6 | W01 exception | Bench, E06; facilitator presses "Stop the camera feed" | "Something has happened. Carry on as you would." | Whether they believe their evidence is safe, and whether they report or work around |
| T7 | G28.07 | Lab Map with the review state set to "WebGL unavailable"; phone | "Find a free computing station." | Whether the plan and list are enough without the model |
| T8 | G28.08 | Technician, ISS-0417 open | "A student reported this. Deal with it." | Whether they restrict before repairing, and whether they can say who is affected |
| T9 | W03 | Return, with the CAL-01 card removed from the kit | "Your session is over." | Whether a missing item is reported or the session is abandoned |
| T10 | G28.12 | Any view | After the tasks: "Was anything on screen in your way?" | Whether the editorial styling competes with the task |

## 5. What to record (G28.09, G28.10)

For each task: completed unaided, completed with a prompt, or not completed; each error and each hesitation over about five seconds, with the screen and the words used; the help given; time as context only. Use this sheet, one row per task per participant:

| Participant code | Task | Outcome | Errors | Hesitations | Help given | Their words | Time |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## 6. Acceptance (G28.15)

- **Critical:** a participant cannot finish T1–T2–T4–T5 (the core journey) or T8 even with one prompt, or believes work was submitted or equipment was safe when it was not. Fix before the submission and re-test with at least two people.
- **Major:** two or more participants need a prompt at the same point. Fix or disclose in the report.
- **Minor:** everything else. Log it.

Each finding gets a row in a revision log: finding, evidence (participant code and task), change made, re-test result (G28.13). Findings that are not fixed are disclosed (Q12).

## 7. A route for the six-minute demonstration (G29.13)

1. Today → E06 → tick the checklist → 10:00 is refused → reserve 11:00.
2. Arrive → type CV-04 (refused) → CV-02 → count the kit → start.
3. Record frontal light → stop the camera feed → report.
4. Switch to Technician → classify → restrict → show Today, the wall display and the Lab Map.
5. Repair → verification interrupted → verify → release → bookings restored.
6. Back to the bench → record side light → notebook → submit → receipt → return.
7. If time allows: E01 at 20 Hz and 3 Hz, and the alias.

## 8. Not covered by these sessions

Screen-reader and zoom passes, cross-browser checks and device timing are technical checks listed in `.design/phase-09-review.md`. Faculty tasks (re-plan, attendance correction, assessment) can only be walked through on the Phase 7 Figma screens, because the demonstrator does not model them.
