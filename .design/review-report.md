# PARALLAX — current design and delivery review

4 October 2026 · requested deep completeness check · report-only. [Full remaining-work audit](../planning/REMAINING_WORK_AUDIT_2026-10-04.md).

The local U01–U08 implementation is healthy in the checked states, with distinct scientific/operational artifacts and honest source boundaries. Final validation and submission remain open; one confirmed mobile control defect and stale status/QA copy need focused correction.

## Scope and method

Read the assignment and actual phase contracts, inspected current source/storage/model/guide boundaries, reran tests/typecheck/preservation checks, compared an isolated production build with active dist, inspected local artifact/link inventory and reviewed rendered routes. Dashboard plus 25 route visits, seven narrow views, eight axe scans, ten fault stages, explicit geometry fallback and one real Ollama answer were recorded. [Browser evidence](../apps/lab-web/evidence/u09-audit/browser-summary.json), [technical inspection](../apps/lab-web/evidence/u09-audit/technical-inspection.json).

No product files, original models, active dist, guide sources or primary records were edited. This review does not become a redesign or a U09 completion claim.

## What should be preserved

- Dashboard prioritizes source status and tasks; availability is not presented as occupancy or room safety.
- W/kWh periods preserve coverage gaps; standby remains a human-reviewed local simulation with protected dependencies.
- Scientific sources/intervals, original geometry, generated versus illustrative evidence and retained context remain explicit.
- Guide AI returns reviewed passages with revision/section identity; unsupported private context and operations are outside its service.
- Independent rehearsal/operations exercises, complete-kit/retry rules, restricted verification and allowlisted public projections retain useful recovery boundaries.
- Studio vectors/signs/text packets, editorial hierarchy, responsive navigation and original baseline remain available.

## Bounded scorecard

Scale 0–4: broken, weak, mixed, strong, excellent. Scores are judgments on inspected evidence, not an aggregate mark.

| Dimension | Judgment | Evidence/limit |
|---|---|---|
| Product clarity and credibility | 3 · strong | Lab-specific sources, ownership and simulation labels; obsolete phase copy causes avoidable confusion |
| Composition and hierarchy | 3 · strong | Task headings, asymmetric workspaces, ledgers and domain figures; no new redesign needed |
| Readability and controls | 2 · mixed | Main text and new controls readable; primary mobile lookup misses intended control styling |
| Task/recovery behavior | 3 · strong | Passing rule checks and fault stages; final consolidated scenario/device review remains |
| Responsive behavior | 3 · strong within inspected widths | Seven 320-pixel views fit; no actual zoom/phone/RTL review in this audit |
| Accessibility | Judgment pending verification | No confirmed axe violations; manual contrast, screen reader and device/browser depth missing |
| Performance | Judgment pending verification | Build size inspected; no runtime timing/frame/resource trace |
| Final submission readiness | 1 · weak | Supporting work substantial; final report/deck/launcher/backup rehearsal absent |

The most consequential delivery issue is the missing submission package. The most concrete UI defect is the small typed-ID control, which is the camera-free fallback on the mobile task.

## Findings

| ID | Severity | Area/location | Current behavior | Proposed correction | Impact |
|---|---|---|---|---|---|
| REM-01 | MEDIUM | `apps/lab-web/src/features/Mobile.tsx:87`; `prototype/proto.css:105`; 320 px `/mobile`; [image](../apps/lab-web/evidence/u09-audit/mobile-field.png) | Default text input omits explicit type and misses `[type=text]` CSS: 13.3333 px font, 21.2 px height | Explicit text type or narrow default-text selector; verify 16 px text/44 px intended control height, lookup/focus/reflow | Unnecessarily small primary on-site fallback control. Keyboard operation is not demonstrated broken; no Safari/WCAG failure inferred |
| REM-02 | MEDIUM | `src/app/App.tsx:193`, `src/features/GeometryRehearsal.tsx:367`; README and tracker historical prose | U07 banner and “AI follows in U06” persist after U08/U06 completion | Current neutral edition/status copy and one dated authority; explicitly label stale historical records | Users/assessors cannot easily tell which work remains |
| REM-03 | LOW | `src/components/AccessReview.tsx:6`, route receipt `route-_assistant_guide_E01.txt` | Previous dashboard scan remains displayed after route navigation; hash read after asynchronous scan | Invalidate/label old report on navigation and associate result with captured starting route | QA reviewer may mistake old result for current coverage; explicit fresh scans in this audit were correctly matched |
| REM-04 | MEDIUM for handoff | `design/serve-review.cjs:6`, `design/index.html:105`; Figma README/P9 record | Default assessor entry shows old edition/prototype; current Figma index not evidenced | Current submission launcher/evidence index; verify actual Figma, preserve originals | Latest smart/AI/studio work is difficult to discover from a clean launch |

Source paths abbreviated under `src/` in rows REM-02/03 are relative to `apps/lab-web/`. Confirmed issues are recorded; no fix was applied during this explicit audit.

## Now, next, later

**Now / U09:** fix REM-01/02/03; complete SYS-05/10/13/14 and the consolidated scenario record; perform manual keyboard/contrast/screen-reader/zoom/browser/device checks and measured performance/lifecycle review. Recheck consequential changes against retained screenshots, identities and test evidence.

**Next / U10:** final ten-section report, fifteen-minute deck/notes, current requirement/rubric/Figma index, clean source launch, complete demonstration recording/static fallback and timed rehearsal. Solve REM-04 without removing earlier entrypoints.

**Later / conditional:** shared identity/transactions, real hardware, physical approval, additional AI context/tools, AR/voice/live QR. These are not fabricated requirements for this local delivery.

## Verification gaps and rejected candidates

- Automated contrast checks remain incomplete over the paper texture; token contrast values alone cannot close rendered review.
- Scene Studio's continuous frame loop (`design/phase-08/assets/scene-studio.js:314`) and map detach/dispose (`lab-3d.js:151–155`) warrant idle/resource tracing. No memory leak, duplicated live loop, poor frame rate or device failure was measured, so they are verification risks rather than confirmed performance defects.
- The raw 559 kB axe chunk is only loaded for explicit local QA. It is not evidence that every normal route downloads that chunk.
- Nine Markdown links initially appeared absent in generated `public/studio` source templates; all resolve in the copied `dist` context, which is the actual app path. They are not broken live links.
- Prepared role switching and local operations are deliberately labelled examples. Absence of institutional authentication is a deployment boundary, not a hidden local-prototype security claim.
- Participant comprehension, learning and physical suitability remain unmeasured under the agreed desk-only scope. No participant work is reopened.
- Prior standalone SVG viewer errors remain recorded; current embedded figures and packet are the reviewed path. Print pagination, completed exports, external links/live Figma and clean assessor rehearsal remain unverified.

## Verdict

**Needs changes** for the inspected UI/status/QA issues; no confirmed HIGH task-blocking regression was found. **Final-release verdict pending U09 verification; final submission not ready until U10 deliverables and rehearsal exist.** Keep U09/U10 open and preserve the delivered U01–U08 scope.


## Current closure — 4 October 2026

The confirmed typed-input, edition-copy and stale-scan findings are repaired; exact-text export recovery and copied-scene lifecycle ownership are implemented. Current local retests, source preservation, fourteen-scenario reconciliation and submission artifacts are in `planning/U09_DELIVERY_RECORD.md`, `planning/U10_DELIVERY_RECORD.md` and `submission/EVIDENCE_INDEX.md`. This earlier audit remains historical before evidence. Full external access/device checks, human rehearsal and team facts remain explicit rather than claimed complete.
