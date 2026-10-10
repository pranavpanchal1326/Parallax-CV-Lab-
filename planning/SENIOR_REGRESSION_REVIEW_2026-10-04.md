# Senior regression review · 4 October 2026

The second review found two defects that the earlier passing test suite did not cover. Both are repaired. No regression was observed in the covered source, domain, export, navigation and rendering checks. This is a bounded local review, not a guarantee for every browser, assistive technology or GPU.

| Finding | Origin and correction | Verification |
|---|---|---|
| Repeated 3D selection abandoned cloned highlight materials | Inherited from the preserved original renderer. The generated React copy now releases superseded clones and includes base materials in final disposal; the original remains unchanged. | Execute the actual generated highlight function with controlled materials: 500 selections, 750 allocated clones, 750 released, zero live after clearing. The same check fails against the original code. Twelve alternating selections, named reset and keyboard plan selection also work in the rebuilt browser. |
| Navigation released the accessibility engine lock before its scan settled | The U09 route-result invalidation missed engine concurrency. Retain the lock until completion, discard obsolete results and skip the scan if navigation occurs during dynamic import. | Actual component handlers, transpiled with the installed Vite transformer: cancelled import, overlapping scan refusal, stale output discard and successful next-route scan. Both old-source race checks fail. Browser navigation during a scan showed a disabled control; the next mobile scan completed with zero confirmed violations and contrast incompletes. |
| Initial-render diagnostics could leave a redundant mutation observer attached | QA-only observer now disconnects once the main heading has been observed. | Production/type build and browser diagnostics complete without console errors or warnings. This is lifecycle cleanup, not a new performance benchmark. |

Before editing, the three touched files were copied to `revisions/U09-before-senior-review-20261004/`. The older complete web snapshot and its hashes remain intact. The independent source check verifies all 76 tracked before hashes against current source, all 68 available saved copies, and all eleven protected canonical originals. Sixty-seven tracked files remain byte-identical; nine tracked changes and four additions remain explicitly listed in the resealed U09 ledger. Domain commands, adapter, persistence modules, public projection, guide/provider service, scientific calculations, typography/style sheets and canonical geometry were not changed in this review.

Fresh checks passed: 139 React tests, 16 assistant service tests, production/type build, original root checks, U05 scientific-block preservation and U08/U09 source integrity. U08/U09 validators reconcile preserved historical evidence; they do not rerun every historical browser scenario. New deterministic regression checks execute real source functions/handlers with controlled dependencies and are supplementary to the 139 React tests.

Browser verification used a separate loopback origin at port 4191. Existing records on that origin were retained, including Activity 0 and existing draft/view state. The user's port 4180 review and port 4192 assistant were not stopped or reset. No booking, notebook, operational or rehearsal record was submitted or reset. Export text selected completely, parsed as schema version 1, and remained exactly identical after navigation/reload. Navigation removed the fallback; the public display contained no fallback, scan report, or checked private fixture identifiers. The rebuilt optional map loaded its packaged model, retained list/plan status and supported keyboard selection after detaching 3D. Console inspection returned zero warnings/errors. Native download completion is still outside this check.

The source handoff is rebuilt with these repairs. The existing PDF, editable deck and recorded walkthrough remain intact; their stated 139/16 test counts and qualified scientific claims remain valid. A new source extraction, dependency install, client/service tests, rebuild and original root checks are recorded in `submission/clean-verification.json`. Final archive hashes are verified separately so refreshed evidence/receipt metadata is covered as well.

Evidence:

- [Controlled source checks and before failures](../apps/lab-web/evidence/senior-regression/source-checks.json)
- [Browser checks](../apps/lab-web/evidence/senior-regression/browser-checks.json)
- [Fresh mobile accessibility result](../apps/lab-web/evidence/senior-regression/mobile-axe.json)
- [Rebuilt linked map screenshot](../apps/lab-web/evidence/senior-regression/linked-map-after.png)
- [Source change ledger](../apps/lab-web/evidence/u09-final/source-change-ledger.json)
- [Clean package verification](../submission/clean-verification.json)
- [Unperformed external checks](../submission/EXTERNAL_CHECKS.md)

Outstanding limits remain actual spoken screen-reader use, real browser zoom, a second browser/device, native-download completion, human presenter rehearsal, institutional integration and physical installation validation. The controlled highlight check does not prove global GPU leak freedom. The source comparison establishes preservation; it does not establish student comprehension or production readiness.
