# Submission packet follow-up · 4 October 2026

Continued from the senior regression review by closing the previously unconfirmed packet CSS-reflow check. The submission entry, presentation player and recorded-frame backup each fit at 320, 768 and 1280 CSS pixels in a fixed same-origin iframe. All nine layout checks have no page-level horizontal overflow. This is an embedded CSS-viewport test in the existing browser, not a physical-device or actual browser-zoom test.

The two player pages initially failed the automated `landmark-unique` rule because their resource links and playback controls used unnamed navigation regions. Added distinct names: Submission resources, Presentation controls and Walkthrough controls. The same labels are carried into the authoring generator. No styling, JavaScript, timings, image paths, captions or notes changed; stripping only those new attributes reproduces the complete before files byte-for-byte. The three before files are preserved in `revisions/U10-before-packet-access-20261004/`.

All nine repeated axe-core 4.10.2 scans report zero confirmed violations and zero incomplete rules for the selected WCAG/best-practice rules. Keyboard Enter advances through all fifteen slides and ten backup frames, with the expected disabled end controls. The backup returns to frame one; Previous slide retains keyboard focus. Tab moves from the entry's prototype link to the report link with a visible outline. These checks do not establish spoken screen-reader usability.

The iframe browser console recorded three `MutationObserver.observe` errors during the first run. A separate script-free parent and script-free child reproduce the same error without PARALLAX code or axe. A traced diagnostic rerun captured no application window errors, while the browser console retained the observer error. This establishes that project scripts are not necessary to trigger it; the precise browser/tooling integration responsible is not identified. The errors remain in the evidence instead of being relabelled as a clean console pass.

All 175 application/program files match the last clean rebuild. The PDF, PowerPoint and saved WebM also retain their prior hashes. The 139 client and 16 service test results remain applicable to that unchanged application code. They were not rerun for an attributes-only packet change. The existing 900-second technical traversal is preserved; a human delivery rehearsal is still needed.

The PDF, deck and WebM targets return HTTP 200 with the expected content types from the clean submission server. That establishes serving availability, not native browser-download completion. The source ZIP and selected-file manifest are rebuilt and hash-verified after the evidence update. Existing review/assistant processes and browser records were not reset.

Evidence:

- [Before scans](../apps/lab-web/evidence/packet-checks/before.json)
- [Nine after scans and layouts](../apps/lab-web/evidence/packet-checks/after.json)
- [Keyboard observations](../apps/lab-web/evidence/packet-checks/keyboard.json)
- [Bounded change ledger](../apps/lab-web/evidence/packet-checks/change-ledger.json)
- [Preservation and packet integrity](../apps/lab-web/evidence/packet-checks/integrity.json)
- [320 CSS-pixel verification capture](../apps/lab-web/evidence/packet-checks/entry-320.png)
- [Console observations](../apps/lab-web/evidence/packet-checks/console.json), [attribution rerun](../apps/lab-web/evidence/packet-checks/console-attribution.json), [script-free control](../apps/lab-web/evidence/packet-checks/script-free-control.json)
- [Serving checks](../apps/lab-web/evidence/packet-checks/http.json)

To reproduce the viewport checks after installing the documented client dependencies, run the submission server and open `apps/lab-web/evidence/packet-checks/harness.html` on that origin. Choose a page and width, read the layout and scan accessibility. The scanner uses the installed axe dependency. The script-free control is alongside the harness and requires no dependencies. The harness is a review utility, outside normal product navigation.

Remaining checks are the named external items in [EXTERNAL_CHECKS.md](../submission/EXTERNAL_CHECKS.md): real assistive technology, actual zoom, a second browser and physical device, native downloads and human presentation rehearsal. The actual team names, contribution allocation and deadline year are still awaiting user input. No participant study or institutional submission is claimed.
