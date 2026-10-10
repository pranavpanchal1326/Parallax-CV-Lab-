# U10-R2 editorial revision

5 October 2026. A full recheck found the build healthy and two quality gaps in the packet: the deck used a generic Arial layout that ignored the project's editorial direction, and the report carried no persona, empathy-map or journey-map visual although the brief lists all three as deliverables. Both are corrected. No application source, fixture, geometry, guide, test or scientific model was edited.

## What changed

| Artifact | Change | Unchanged |
|---|---|---|
| `submission/PARALLAX-Presentation-Final.pptx` | Rebuilt with `planning/u10-build/build-deck-editorial.py`: paper and ink, hairline rules, Georgia headlines with one italic ultramarine phrase, numbered points, crop-marked figures with numbered captions. Slide 15 gains the submission-entry capture. | Fifteen slides, every title and body line, order, 900 planned seconds, speaker notes. `Presenter-Notes.md` is byte-identical to R1. |
| `submission/deck-slides/*.png` | Exported from the installed PowerPoint 16 by `render-deck.ps1` | File names and count, so the slide player is untouched |
| `submission/PARALLAX-Final-Report.pdf` | Rebuilt with `build-report-editorial.py` in the same language; 21 pages (was 16). Adds Fig. 02 personas, Fig. 03 empathy map, Fig. 04 journey map, Fig. 05 six sign studies, Fig. 07 WF06/WF11, Fig. 09 E01 and fault stage 8. | All ten sections, every paragraph and table, fourteen references, twenty requirements and the rubric appendix. The build asserts every original paragraph is present in the PDF text. |
| `submission/source/report-figures.json` | New. Data for the added figures. | `report-content.json` and `presentation-content.json` are not edited. |
| Packet text | Revision line on the entry page, README and evidence index; README gains team-declaration steps | Links, player pages, demo, recorded walkthrough |

## Sources of the research figures

Personas restate the six job-to-be-done lenses in `research/U02_RESEARCH_SYNTHESIS.md`. The empathy map and the journey map restate sections 4 and 5 of `research/PHASE_02_RESEARCH_AND_EXPERIENCE.md`, which that record labels as hypotheses. The figures keep that status in their headings and captions ("likely", "anticipated", "zero participants"), set the anticipated speech without quotation marks, and add no new claim. The emotion line plots the eight emotion words of journey J1 on an authored ordinal scale; it is an illustration of that row, not a measurement.

## Verification on 5 October 2026

- Before the change: 139 React tests, 16 assistant tests, type check, the five root validators, U02–U09 integrity validators and the submission validator all passed; the handoff ZIP matched its recorded hash; the entry page's 22 local targets resolved; 37 application routes rendered without console errors.
- Deck: ZIP CRC, reopen with python-pptx, text and notes parity against the source JSON, 14 pictures with alternative text, opened and exported by PowerPoint 16. All fifteen exports inspected.
- Report: 21 pages rendered and inspected; structure receipt in `planning/u10-build/report-structure.json`.
- Application files: every application row of the R1 source manifest still has the same hash in the R2 manifest (count recorded in `submission/package-receipt.json`).
- After the change the same validators were rerun; results are in the session summary and the refreshed receipts.

## Limits that remain

The 900-second receipt in `submission/demo/rehearsal-receipt.json` is the 4 October automated traversal of the R1 slide images; timings are unchanged but it was not repeated on the R2 images, and it never measured a person speaking. The 4 October packet receipts in `apps/lab-web/evidence/packet-checks/` name the R1 report and deck hashes and are kept as dated history. The R1 deck passed a first-party layout validator that was not available for R2; R2 relies on the checks above. `clean-verification.json` records the 4 October clean extraction; the R2 archive was integrity-checked and hash-compared but not reinstalled from scratch.

Everything in [EXTERNAL_CHECKS.md](../submission/EXTERNAL_CHECKS.md) is still open: spoken screen reader, real browser zoom, second browser and phone, native download completion, a human fifteen-minute rehearsal, and the team's names, contributions and deadline year.

## Later on 5 October 2026: header copy cleanup

At the user's request the React edition's page headers no longer show dates, internal phase or scenario codes (U06, U07, U08, EX-TS-07, S-EXP-02/03, SUS-U04), "example records/clock" tags or the "local edition" strip under the menu; the submission entry header no longer shows a revision and date. Seventeen source files changed in visible copy only; no rule, data, model or control changed. Originals are in `revisions/U11-before-copy-cleanup-20261005/`, and the U09 source-change ledger and `validate-u09.cjs` list the new hashes. In-body notes that say a value is simulated, conceptual or not connected are kept. Screenshots in the report, deck, demo and earlier evidence predate this change and show the old headers. After the change: 139 React tests, type check, production build and the U03–U09 validators pass.

## U12 product polish · 5 October 2026

A design review of 22 pages listed what made the React edition look unfinished: a focus outline around every page, a developer toolbar and developer footer, half-empty pages, a dashboard of zeros and blank readings, two very long pages, tiny repeated disclaimers, default-looking links and form controls, and no imagery. This pass corrects them.

| Area | Change |
|---|---|
| Shell | Menu grouped Student / Staff / Room on its own row; role indicator; icon theme switch; footer rewritten with project links; session tools (activity, export, reset) folded into the footer; footer stays at the bottom of short pages; the view container no longer shows a focus outline |
| Dashboard | Tiles explain their zero state; "nothing needs attention" state; readings default to the *recent example* scenario instead of *disconnected*; long notes folded |
| Environment, Operations desk | One section at a time behind tabs (all sections remain in the page for print and text); the operations result message moved above the sections so every tab shows it |
| Notes | Repeated data caveats become one folded "About…" note per block. The text is kept, not deleted |
| Controls | Consistent buttons, clear disabled state, styled selects, text areas, checkboxes and radios; link rows become quiet tabs |
| Content | Room render on Today; status marks on availability and occupancy; equipment tables collapse to a one-line summary when nothing is restricted; lab-map index one line per item |
| On site, Public display | Shown as a phone and as a wall sign |
| Type | Smaller page headline, 14 px minimum for explanatory text |

Not changed: domain rules, fixtures, commands, persistence, scientific models, guides, tests. The one behavioural default that changed is the environment example shown first (recent example readings; "no hardware is connected" still stated, and the other five source conditions remain selectable).

Checks after the change: 139 React tests, 16 assistant tests, type check, production build, root checks and the U02–U09 validators pass. In the browser: 14 routes without horizontal overflow at 375 px, both tab sets switch correctly, the operations result stays visible on every tab, dark edition works, no console errors, and axe-core 4.10.2 reported zero violations on ten routes at 1280 px (machine-detectable rules only). Source before this pass: `revisions/U12-before-product-polish-20261005/`. The ledger and `validate-u09.cjs` list the 23 reviewed changed files and seven additions.

Screenshots in the report, deck, recorded walkthrough and earlier evidence predate this pass and show the previous interface.

### Packet images refreshed after the polish

So the packet matches the product, the interface figures were captured again from the polished build with `planning/u10-build/capture-ui.mjs` (Playwright driving Edge with a temporary profile): dashboard, E01 at 3 Hz, E06 side light, fault stages 5, 7, 8 and 10, plan-only geometry, phone-width lookup, export fallback, operations allocation, the submission entry, and a fresh real answer from local Ollama (`llama3.2:3b`, E01 revision 01, section E01-alias). The deck, the report and the ten-frame walkthrough now use these images; the four long text alternatives in the walkthrough were regenerated from the same pages, and the 80-second WebM was re-encoded by the page's own recorder (`record-walkthrough.mjs`). Earlier evidence images under `apps/lab-web/evidence/` are untouched and remain dated history; the previous packet images are in `revisions/U12-before-product-polish-20261005/submission/`. The 4 October receipts in `apps/lab-web/evidence/packet-checks/` describe the earlier files.

### Second polish pass and automated external checks

Framework and phase wording ("React session", "P7-A", "SIM-POWER-v1") is replaced by plain words; two-line page titles render as a title with a smaller strapline; the Today page shows a four-figure status strip instead of a second floor plan; plan labels are larger; type is held to one scale (11, 13, 14, 16, 18, 21, 28, 40 and the display size). An inline favicon removes a 404 on first load. Packet images, deck, report and walkthrough were captured and rebuilt again afterwards.

`external-checks.mjs` then ran the machine-checkable part of the external list: seven tasks in Edge, Chrome, Firefox and WebKit; four completed native downloads equal to the displayed text; fourteen routes at 200% and 400% zoom-equivalent viewports; three keyboard-only tasks. All pass; details and limits are in `submission/EXTERNAL_CHECKS.md`. A spoken screen reader, a physical phone, the human rehearsal and the team declaration remain human tasks and are not claimed.

### Clean archive check

The rebuilt handoff ZIP was extracted into an empty folder on 5 October 2026. `npm ci`, 139 React tests, 16 assistant tests, the type and production build and the root checks passed there; the rebuilt `dist` matched the packaged one file for file; the extracted packet served on port 4191 and seven pages rendered without console errors. Receipt: `submission/clean-verification.json` (`u10R2CleanCheck`). This supersedes the earlier note that the R2 archive had not been reinstalled.

### Third review pass

A walk through the real flows (complete E01 journey from preparation to return, every tab, sub-pages, dark edition, not-found page) found and corrected: a list-layout regression on the Safety page introduced by the earlier index styling; "Checking the local service…" shown indefinitely when the assistant is not running; a result bar on the operations desk that read "No booking request yet" on every tab; mono and sans form labels mixed across pages; centred energy-table headers; lowercase route names as browser-tab titles; unstyled loading and not-found states; "in this example session" appended to every confirmation; one headline split mid-sentence; remaining "React" wording on the lab map. The journey's last step now ends with a completion panel.

Deliberately not changed: the art plates and plan masters. Their SVGs and rendered PNGs are fingerprinted in `apps/lab-web/evidence/u08-art-manifest.json`, so the phase code and date in their footers stay as authored. A trial edit was reverted and the source restored to its baseline hash.

After this pass: 139 React tests, 16 assistant tests, type check, build, root checks and U02–U09 validators pass; the automated external checks were rerun (four engines, four downloads, 200% and 400% layouts, keyboard) and pass; packet images, deck, report and walkthrough video were rebuilt once more from the final build.

### U13 · art footers and detail pass

At the user's request the art plates, sign studies, plan layers and the reference packet no longer carry a phase code or a date ("PARALLAX / AUTHORED REFERENCE", "CONCEPT REFERENCE"). This was done as one controlled change: `studio-graphics.mjs`, `studio-catalog.json` and `build-studio.cjs` edited; all 23 masters regenerated; the 21 evidence renders re-rendered at native size with `render-art.mjs`; `evidence/u08-art-manifest.json` refreshed with a `revised` note; the U09 ledger resealed. Artwork, geometry and scientific content are unchanged. Previous sources, masters and renders: `revisions/U13-before-art-footers-20261005/`.

Detail pass: the submission entry page is redesigned in the editorial language (hero with the room render, three deliverable cards, a suggested demonstration order, typed link lists, four verification figures, an honest-boundaries panel) with every previous link kept and its status text brought up to date; the slide player and walkthrough pages share the same styling. In the app: a legend under every floor plan, line icons on quick links and dashboard tiles, the student-eye render behind the public display, a short view transition, card hover, and the menu wraps at tablet width instead of clipping. New stylesheet: `src/styles/polish-detail.css`.

Checks after this pass: 139 React tests, 16 assistant tests, type check, build, root checks and U02–U09 validators pass; `axe-scan.mjs` reports 0 violations over 35 scans (16 routes in each edition plus the three packet pages); the automated external checks pass again; no page-level horizontal overflow at 1440, 1024, 820 and 390 px on the pages captured; packet images, deck, report and walkthrough video rebuilt from the final build.
