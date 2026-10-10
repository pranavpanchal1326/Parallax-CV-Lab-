# U10-R3 · undated, artistic edition

Third revision of the submission packet. It continues [the R2 record](U10_R2_EDITORIAL_RECORD.md). Requested by the user: remove the date from the report, and raise the product's craft further without degrading it.

## Report

- The cover and the page footers no longer carry a revision code or a date. The footer reads "PARALLAX · UI/UX design proposal · Signal & Computer Vision Lab". The body sentence that repeated the review date was shortened.
- Access dates inside the reference list are kept. They belong to the citations of live web pages and removing them would weaken the referencing.
- New pages: a contents page with real page numbers, and "The proposal in nine numbers" with the identity art plate.
- Section 7 gains a smart-features table that states how real each feature is (five working, two simulated, one partly built, one concept).
- The cover carries the signal-rule motif. The report is 23 pages. Every original paragraph is still present; the build asserts it.

## Deck

Same fifteen slides, wording, notes and timings. The cover gains the signal-rule motif. Figures were re-captured from the final interface.

## Application

- Dashboard: a small chart of the four example power intervals, drawn from the existing example data with its gap shown as a gap; and "Smart features, and how real each one is", nine tiles with honest status tags and links.
- The signal-rule motif (one period of the 2 Hz reference with eight samples) as a rule above the footer and on the not-found page.
- No domain rule, fixture, command, scientific model or test changed. New files: `src/styles/polish-art.css`, `src/assets/signal-rule.svg`.

## Checks

139 application tests, 16 assistant tests, type check, production build, root checks and the U02–U09 validators pass. `axe-scan.mjs`: 0 violations over 35 scans. `external-checks.mjs`: four browser engines, four completed downloads, 200% and 400% zoom-equivalent layouts and three keyboard-only tasks pass. Packet images, deck, report and walkthrough video were rebuilt from this build, and the archive was installed and built in an empty folder.

Previous report, deck and builder: `revisions/U13-before-art-footers-20261005/`.

## Still open, and not claimed

A spoken screen-reader pass, a physical phone, a human fifteen-minute rehearsal, and the team declaration, which the user chose to leave blank.

## Experience pass

A deeper look at what would raise the product found that more decoration would not; presenting and navigating it would. Added:

- **Guided tour.** A button in the top bar starts a fourteen-stop path through the prototype in demonstration order. A strip under the menu shows the stop, one line to say, and Back / Next. The position survives a reload and ends on request. It only navigates; it changes no record.
- **Quick search.** Press `/` or Ctrl+K (or the Search button) to jump to any page, experiment or piece of equipment by name. Built on the native dialog element, with arrow keys, Enter and Esc.
- **Page art.** The kit identity plate from the reference studio now appears on the Technician page.
- **Report.** Section 6 gains a wireframe-to-interface figure: WF03 beside the built reservation step.
- The demonstration script and entry page mention the tour.

New files: `src/components/GuidedTour.tsx`, `src/components/CommandPalette.tsx`, `src/styles/polish-ux.css`. No domain rule, fixture, command, model or existing test changed.

Checks: the tour and the search are exercised in Edge, Chrome, Firefox and WebKit by `external-checks.mjs` (nine tasks per engine, all pass); `axe-overlays.mjs` reports no violations with the tour strip showing and the search dialog open, in both editions; `axe-scan.mjs` still reports 0 over 35 scans.

## Play pass

- **Sampling playground on Today.** One dark plate: a 2 Hz signal over one second, four rate buttons, the samples drawn on the wave, and when the rate is too slow the dashed wave the samples would suggest instead. It calls the same `sampledAlias` function and reference as the E01 rehearsal, so the picture and the science cannot drift apart, and it is labelled as a generated model.
- **Role menu.** The view indicator in the top bar now opens a menu to switch between Student, Technician, Faculty, Lab staff and Public display.
- **Poster.** `submission/PARALLAX-Poster.pdf`, one A2 page built by `build-poster.py`: title, room render, the three core ideas, the seven-step journey, the plan, the smart-features status list, four screens, six numbers and the honest boundaries. Every figure restates the report.
- **Report references.** At the user's repeated request the reference list no longer prints access dates; the report now carries no date at all. Each access date remains in `research/u02-sources.json` and the source register.

New files: `src/components/SignalPlayground.tsx`, `src/styles/polish-play.css`. No domain rule, fixture, command, model or existing test changed.

## Regression found and fixed · 7 October 2026

While checking the live flows for the user, the fixed Back / Next bar on the seven journey steps was found half off-screen for anyone with motion enabled, which is most people. Cause: the page-transition animation added in the detail pass animated `transform` and kept its end state, overriding the bar's own centring transform. Every earlier automated run used reduced motion, so none of them saw it. The animation now uses the `translate` property, does not persist after it ends and skips the bar. `external-checks.mjs` gained a motion-enabled check (bar inside the viewport, Next link clickable) so this cannot pass unnoticed again. The packet screenshots were captured with reduced motion and are unaffected.

## Walkthrough review video · 7 October 2026

At the user's request the HyperFrames skills were installed (`npx skills add heygen-com/hyperframes`) and used to make `submission/PARALLAX-Walkthrough-Review.mp4`: 1920 × 1080, 30 fps, 65 seconds, no audio. Nine scenes of real footage were recorded from the running prototype with `video/record.mjs` (browser screencast frames, idle gaps shortened, a drawn cursor), including a live answer from local Ollama; `video/build-composition.mjs` writes the HyperFrames composition with a title card, a numbered review caption per scene and a closing review card. FFmpeg and FFprobe were added as local npm packages inside `video/` rather than installed on the system. HyperFrames lint: 0 errors; frames were checked from the composition and from the rendered file. The footage is a scripted run on example records, with waiting time removed; it is not an unedited screen recording.

### Narrated version

At the user's request the video now carries a spoken explanation and a slower pace: 1 min 56 s, H.264 video with an AAC voice track. Eleven voice lines (`video/narration.json`) were generated locally with Kokoro through `hyperframes tts`, in a private Python environment inside `video/`. The nine scenes were recorded again with each action timed to its line; only the wait for the AI answer is cut, and a clip that ran past its line is played at most 1.2 times faster. The voice is synthetic, not a team member speaking. The earlier silent 65-second cut is kept as `video/PARALLAX-Walkthrough-Review.mp4`.
