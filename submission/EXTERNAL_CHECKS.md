# External verification and administrative checks

The runnable local implementation and deliverable packet are reviewable. The following checks require a capability, person or institutional fact not available to this workspace. None is counted as a pass. U09's full access/device gate remains open for these named checks.

| Check | What was actually available | Remaining acceptance |
|---|---|---|
| Spoken screen reader | Browser accessibility tree, native form labels, status roles and keyboard actions | Run NVDA/JAWS or VoiceOver in its actual supported browser. Complete typed lookup, unknown-ID recovery, E01 prediction/result/reflection, provider-unavailable manual guide and interrupted verification. Confirm meaningful headings, values, reading order, focus, result announcements and no keyboard trap. Record AT/browser versions and observed results. |
| Actual browser zoom | Seven 320 px reflow views from the prior audit plus fresh corrected mobile evidence. In-app Ctrl+plus did not establish a changed zoom factor | Test actual 200% and 400% browser zoom. Confirm readable content and every task/control, no overlap or page-level two-dimensional scrolling except justified figures/tables. Record browser zoom factor and viewport. |
| Second browser and physical device | Only the in-app browser is exposed; native app inventory is empty | In current Edge/Chrome/Firefox and a real phone, repeat typed lookup, keyboard/mobile navigation, manual/3D fallback and export selection. Review touch targets, layout, scrolling, saved work and optional WebGL behavior. Use embedded studio images/HTML packet; document any native SVG viewer difference. |
| Native download completion | Native download event timed out in the in-app browser. Exact text is visible, selectable and was saved/parsed independently | Download one session, E01/E06 rehearsal and operations JSON in the assessor browser. Reopen each disk file, parse it and confirm source revision/settings/text match the displayed record. Retain a file hash; do not replace a user's existing record. The exact-text alternative remains usable. |
| Human fifteen-minute rehearsal | Editable deck, source notes, explicit live-demo cues and 900-second automated technical traversal | A presenter should speak the notes and execute live actions within fifteen minutes. Record actual elapsed time and where to use the static backup. The automated playback does not establish speech pace or presentation confidence. |
| Team and deadline declaration | Assignment specifies three students and 5 August. Year, team names and contributions are unknown | Supply actual team details and truthful individual contributions, confirm the applicable deadline/year and institutional submission format. No names, marks, dates or contribution claims are inferred. |

Textured-surface contrast has automated incomplete results. Selected rendered typography/focus is inspected and source token pairs pass. A comprehensive applicable-WCAG audit across every state is not claimed. Physical site surveying, circulation under occupancy, electrical/fire/material/access approvals, CCTV policy, calibrated sensors and measured energy are separate installation/integration work. Local UI cannot authorize those operations.

No interviews or participant studies are required by this project scope. External technical checks must not be relabelled as participant validation or fabricated user outcomes.

The original browser-level viewport override did not apply to the submission entry. A [later packet review](../planning/U10_PACKET_VERIFICATION_2026-10-04.md) verified the entry, slide player and backup walkthrough inside fixed 320, 768 and 1280 CSS-pixel iframes: nine layouts without horizontal overflow and nine clean selected-rule scans after navigation names were repaired. A qualified narrow CSS-layout capture is recorded. This closes the embedded layout check, while actual browser zoom and physical-device behavior remain unverified. Include all three packet pages in the external check.

The iframe console observer error also reproduces in a script-free parent/child control. Its exact browser/tooling source remains unidentified. It is retained as an observation limit and is not reported as a clean-console pass.

## Automated follow-up · 5 October 2026

Run with `planning/u10-build/external-checks.mjs` (Playwright, temporary browser profiles) against the polished build. Results: [external-checks.json](../apps/lab-web/evidence/u12-checks/external-checks.json).

| Check above | What the automated run established | What is still open |
|---|---|---|
| Second browser | Eleven tasks (typed lookup, unknown-ID recovery, E01 result, plan-only fallback, tabs, fault stage 8, guided tour, quick search, sampling playground, role menu, manual guide) pass in: Microsoft Edge (Chromium) 154.0.4258.53; Google Chrome 154.0.8037.98; Firefox (Playwright build) 153.0; WebKit (Playwright build, Safari engine) 26.5. No page errors. | A physical phone and touch input. WebKit here is Playwright's Windows build of the Safari engine, not Safari on an Apple device. |
| Native download completion | Four real downloads completed in Edge and were reopened from disk: parallax-react-session.json (3595 bytes), parallax-E01-rehearsal.json (397 bytes), parallax-E06-rehearsal.json (356 bytes), parallax-operations-exercise.json (1391 bytes). Each parses as JSON and is byte-identical to the text the page displays. | Other browsers' download prompts were not exercised. |
| Actual browser zoom | Fourteen routes at the 200% and 400% zoom-equivalent viewports of a 1280 × 800 window (640 and 320 CSS pixels wide): no page-level horizontal scrolling, every page heading visible, the E01 and lookup tasks complete. | The zoom menu itself was not operated; a person should still look once at 200% and 400%. |
| Keyboard | Typed lookup, the E01 rehearsal and the environment tabs complete with Tab, typing and Enter only, with a visible focus indicator on each stop. axe-core 4.10.2 reports no violations on ten routes. | Spoken screen-reader output (NVDA, JAWS or VoiceOver) was not listened to. |

Still entirely human: the spoken screen-reader pass, a real phone, the fifteen-minute spoken rehearsal (the [demonstration script](DEMO-SCRIPT.md) and [presenter notes](Presenter-Notes.md) are ready), and the team's names, contributions and deadline year (`source/team.example.json`).
