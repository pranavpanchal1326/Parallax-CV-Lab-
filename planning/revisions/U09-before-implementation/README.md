# PARALLAX React lab · U07

React + TypeScript + Vite demonstrator with both scientific student journeys, faculty teaching/attendance/assessment, technician fault/asset/calibration records, mobile typed-ID/report recovery, bookings, linked map, safety and public display. [Coverage ledger](PARITY.md) records functional parity and deliberate design equivalents. Actual accounts, staff authorization, grades, authoritative reservations and devices are not connected.

From the project root, start the edition server for reference, geometry and model assets:

```powershell
npm start
```

Then, in another terminal:

```powershell
npm run lab:dev
```

Open `http://localhost:4190/`. Or build and use the existing edition server at `http://localhost:4180/apps/lab-web/dist/index.html`:

```powershell
npm run lab:test
npm run lab:build
npm run check
node research/validate-u02.cjs
node apps/lab-web/scripts/validate-u03.cjs
node apps/lab-web/scripts/validate-u04.cjs
node apps/lab-web/scripts/validate-u05.cjs
```

Dependencies are pinned in package/lockfile. On a fresh checkout use `npm ci --prefix apps/lab-web`. Build regenerates the isolated map bridge; it never edits the original map. Optional 3D loads only when requested. `?qa=1` adds an explicit local axe-core 4.10.2 diagnostic button; its large QA-only chunk is loaded on demand. Normal views do not load it.

State uses `parallax-react-state-v1`, schema 1. The app never writes either legacy state key or legacy map projection. Old React records remain readable without invented historical context. The optional versioned workspace extension keeps persistent drafts and append-only example teaching/asset records. Cross-tab changes pause saving; incompatible records are retained. Reset and restore first save recovery copies, and refuse the operation if the copy cannot be saved. "Restore previous example session" can undo a reset/restore; each explicit recovery also keeps an archived browser copy.

Core destinations: `#/faculty`, `#/faculty/attendance`, `#/faculty/assessment`, `#/tech`, `#/assets/C1-CAM`, `#/assets/C1-CAM/calibration`, `#/mobile`, `#/mobile/report`, `#/bookings`, `#/map`, `#/safety`, `#/wall`. All share canonical IDs. Teaching/assessment examples are distinct from the student's records; actual React receipts link to their frozen submission views. Deliberate failure controls are labelled as demonstrations. Live QR recognition and network synchronization are not implied by typed lookup or deferred-report examples.

EX-2.2 dashboard, environment, energy previews and immutable replay are preserved at `#/dashboard`, `#/environment`, `#/E01/conditions` and `#/E06/conditions`. Observations, loads, protection windows and sustainability material remain examples/concepts. Recorded signal reference and capture context are retained; energy previews do not report metered savings or operate power.

U06 adds `#/assistant` and guide-scoped preparation links. Start `npm run assistant:start` in a separate terminal with local Ollama running. The installed `llama3.2:3b` selects sections from four reviewed public project guides; answer wording and learning prompts come from those guides. No API key, cloud service, browser evidence, role authority or action tools are used. The readable offline copy is publication-unchecked; local question drafts survive cancellation/errors but clear on navigation/reload. Review flags stay in the anonymous session's server memory. Run `npm run assistant:test`, `npm run assistant:eval` and `node apps/lab-web/scripts/validate-u06.cjs` for the service/evidence checks. [Configuration, source lifecycle and retention runbook](../lab-server/README.md).

U02-R2 is complete for the user's secondary-research-only scope. Fifteen wireframes are at `../../design/wireframes/index.html`, and the evidence edition is at `../../design/research-u02/index.html`. No interviews or participant usability studies will be conducted; local user/site assumptions remain unvalidated. There is no guaranteed rubric score.

U03 local functional parity and U04/U05 local delivery are complete. U06 delivers local AI-L1 guide support; U08–U10 continue in the [phase tracker](../../planning/EXCELLENCE_EXECUTION_PHASES.md). See [verification](VERIFICATION.md), [U06 delivery](../../planning/U06_DELIVERY_RECORD.md) and [master blueprint](../../PARALLAX_EXCELLENCE_BLUEPRINT.md) before reporting results. The original project entrypoints are retained.

U04 delivery: [record](../../planning/U04_DELIVERY_RECORD.md), [physical specification](../../planning/U04_SUSTAINABILITY_SPECIFICATION.md), and packaged `sustainability-sheet.html`. The six source scenarios retain timestamps until explicitly changed/recovered; new captures use the same records as the dashboard. Energy periods show known kWh and retained gaps separately from W averages. Standby review confirms a local simulation only. Node.js 24 is the verified runtime; build regenerates the printable/specification artifacts from the shared UI data. Run `node apps/lab-web/scripts/validate-u04.cjs` from the project root for evidence/preservation checks.

U05 adds `#/E01/rehearsal`, `#/E06/rehearsal`, `#/scene/rehearsal` and `#/walkthrough`. Predict, vary one supported parameter, compare under the declared model and reflect. E01 is generated; E06 lighting is authored; Scene Studio reuses the original geometric calculation with fixed-camera 18°/40°/90° choices and an explicit plan-only fallback. Rehearsal notes save under separate versioned browser keys, with competing-write refusal and archived reset/restore. Unsaved drafts remain in memory; save/export before leaving. Rehearsal never creates experiment evidence or completes preparation. The ten-stage fault sandbox commits existing rules independently, retaining evidence and exposing permitted consequences. U05 views load on demand. Build generates the fixed-model wrapper without changing the original Scene Studio; its reference assets require the edition server, as the linked map does. [Delivery and limits](../../planning/U05_DELIVERY_RECORD.md).

U07 adds `#/operations`, linked from faculty, technician and booking views. Its independent local exercise demonstrates serialised complete-kit/interval conflicts, stable retry, offline revalidation, saved request lookup, method withdrawal with retained evidence, named-owner handover acceptance and allowlisted public consequences. It never changes the primary React example. Snapshots use `parallax-operations-exercise-v1`, explicit save, raw-version conflict checks and unique archives; visible export JSON and reversible in-memory restart protect reviewable work. Prepared actors are not authentication; there is no durable shared database or external notification. Build generates `operations-runbook.html` and `.md` from eight runbooks/five owners, with four operating options/nine unpriced categories. [Delivery and limits](../../planning/U07_DELIVERY_RECORD.md). Run `node apps/lab-web/scripts/validate-u07.cjs` from the project root after the build.

## U08 / Art and physical reference

Open `#/studio` for nine authored compositions, discrete sample-to-pixel inspection, six physical proposals and S-01–S-06 sign studies. Optional discovery links sit in Safety and Lab Map. The build generates `public/studio/` with 21 SVG masters and HTML/Markdown text equivalents from the shared studio catalog/graphics. No operational provider or storage is accessed by the studio. The preserved signal source is REF-2HZ-v1 (2 Hz, 1 V, 1 s); physical geometry remains P4-D and unvalidated on site.

U08 is complete for this local/proposal scope. See [delivery](../../planning/U08_DELIVERY_RECORD.md). Type/build, 138 React tests, 16 server tests and U02–U08 integrity checks pass. Normal app/packet console is clean; standalone SVG viewing has a reproducible in-app viewer limitation documented in the evidence. U09 broadens validation.
