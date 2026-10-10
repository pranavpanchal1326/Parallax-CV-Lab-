# Demonstration script

A page-by-page way to present PARALLAX in plain words. Start the server (`node submission/serve.cjs 4180`), open `http://127.0.0.1:4180/submission/index.html`, and click **Open the current prototype**. For the AI page, also run `npm run assistant:start` in a second window.

**Two aids while presenting.** Press **Guided tour** in the top bar: it walks through fourteen pages in this order and shows one line to say on each. Press **/** (or Ctrl+K) to jump to any page or piece of equipment by name.

**Opening line.** "Our lab is the Signal & Computer Vision Lab, 70 m². We designed the room and the digital system together. The main idea: a student books the complete kit, not only a seat, and every result keeps its settings and source."

| # | Page (menu) | What to say | What to click |
|---|---|---|---|
| 1 | Submission entry | One page links the prototype, report, slides, Figma and floor plan. | Open the prototype |
| 2 | Student · Today | The student home: the room, today's experiments and quick actions. | Start "Sampling and aliasing" |
| 3 | Prepare (step 1 of 7) | The digital experiment manual: the question, the kit and the safety check. | Point at the seven steps |
| 4 | Reserve (step 2) | Equipment booking. One click reserves the station and every kit item for the same time. | Reserve a slot |
| 5 | Arrive (step 3) | Attendance. The student checks in at the station and confirms the kit. | Check in |
| 6 | Bench to Return (steps 4 to 7) | Record the result, write a claim with evidence, submit, get a receipt, return the kit. | Move through quickly |
| 7 | Rehearse a sampling choice | A 2 Hz wave sampled at 3 Hz looks like a 1 Hz wave. Predict first, then compare. It is a generated model. | Choose 3 Hz, run |
| 8 | Staff · Smart lab | The dashboard: restrictions, sessions, receipts and example sensor readings. No real sensor is connected and the page says so. | Open Environment & energy |
| 9 | Environment & energy | Each reading shows its source and age. Standby never switches off equipment a booking needs. | Change the source condition; open the Energy and Standby tabs |
| 10 | Student · Lab map | The digital twin: the plan with the status of each station, and a 3D view. | Select a station |
| 11 | Student · On site | The phone view and QR equipment information. Type the label ID to get the record; scanning is a concept. | Type `C1-CAM` |
| 12 | Staff · Technician | Asset tracking and equipment health. A fault report restricts the camera everywhere at once. | Open "Rehearse fault consequences" |
| 13 | Fault walkthrough | Ten stages of one camera fault. At stage 8 the system refuses to release the camera before verification. | Show stages 5, 8 and 10 |
| 14 | Staff · Faculty | Experiment scheduling: the rotation plan, readiness, and attendance correction that keeps the original record. | Open attendance |
| 15 | Student · Ask a guide | The AI assistant runs on this laptop, answers only from reviewed guides and shows the source. | Use the example question |
| 16 | Room · Public display | The digital notice board for the wall screen, with no private data. | Show it |
| 17 | Room · Safety | Exits, extinguishers, first aid, emergency power-off and CCTV. Design positions, not an approved emergency plan. | Point at the markers |

If something fails live, open **Offline recorded-frame walkthrough** on the submission entry.

## What to show in Figma

1. Start page, "Current handoff" board: the index of the file.
2. Phase 2 · Research & Experience: Personas, Empathy Maps, Journeys, Information Architecture, User Flows.
3. Phase 4 drawings: the scaled 70 m² floor plan and renders.
4. Phase 5 design system: colours, typography, 40 component families and 87 variants.
5. Phase 6 student journey prototype: press Play and click prepare, reserve, check in, submit.
6. Phase 7 board: the equipment fault and recovery flow.

Then say: "Figma is the design; the website is the same design built as a working prototype."

## Likely questions

- "Did you interview users?" No. The research uses fourteen published sources; personas are hypotheses and the report says so.
- "Are the sensors real?" No. They are example readings that show how real ones would appear.
- "Is the room real?" It is a 10 × 7 m design model, not a surveyed room.
- "Is the AI real?" Yes. It is a local model (Ollama, llama3.2:3b) limited to the project's reviewed guides.
