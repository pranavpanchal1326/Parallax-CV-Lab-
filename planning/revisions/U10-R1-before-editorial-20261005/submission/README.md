# PARALLAX current submission

U10-R1 · 4 October 2026. Start at [the current submission entry](index.html). The [PDF report](PARALLAX-Final-Report.pdf), [editable presentation](PARALLAX-Presentation-Final.pptx), [notes](Presenter-Notes.md), [backup sequence](demo/index.html) and [evidence index](EVIDENCE_INDEX.md) form the current packet. Original entrypoints remain available.

## Clean assessor start

Extract `PARALLAX-Source-Handoff.zip` to an ordinary folder. It contains source, pinned client package/lock files, prebuilt `dist`, canonical geometry, vendored Three.js, design/research evidence and this packet. No browser local-storage record, API key, model binary, development `node_modules` or private revision archive is required.

With Node.js installed, run from the extracted project root:

```powershell
node submission/serve.cjs 4180
```

Open `http://127.0.0.1:4180/submission/index.html`. `submission/START-PARALLAX.ps1` runs the same command. Keep that terminal open. If a project server already owns 4180, reuse it or choose **4191**; live assistant browser origins are restricted to 4180, 4190 and 4191. The server binds to loopback only. `npm start` intentionally remains the preserved original edition's command.

The prebuilt preview needs no package installation. The report, slide images, speaker notes and demo image/text sequence work without live AI. Figma is an external design link and requires access to the existing file.

## Rebuild from source

Node.js 24.13 was used for application checks. From the extracted root:

```powershell
npm --prefix apps/lab-web ci
npm run lab:test
npm run assistant:test
npm run lab:build
npm run check
```

`npm ci` uses the existing pinned lockfile and requires network access if packages are absent. It installs development dependencies into the extracted copy. Preserve canonical fixtures, geometry and original model source when making changes. U09 source and U10 package validators are documented in the evidence index.

## Optional live local AI

Ollama and `llama3.2:3b` are already installed on the reviewed machine. A new machine needs its own local Ollama installation and installed completion model. This handoff does not distribute the model or start a download.

With Ollama running locally at `127.0.0.1:11434`, use a second terminal:

```powershell
npm run assistant:start
```

The assistant binds to `127.0.0.1:4192`, requires no API key and accepts only the documented loopback browser origins. `OLLAMA_MODEL` defaults to `llama3.2:3b`. Changing the model requires reevaluation. If AI is unavailable, the published/bundled guide reader remains visible with an explicit lifecycle label. See [assistant source/setup](../apps/lab-server/README.md).

## Demonstration order

1. Dashboard and source-age examples; energy gaps and protected standby.
2. E01 prediction at 3 Hz, fixed reference and higher-rate comparison.
3. E06 authored lighting difference, limitation and next investigation.
4. Fault stages 5, 7, 8 and 10: restriction, interruption, refusal and verified restoration.
5. Local Ollama hint with E01 revision/section citation; manual alternative.
6. Independent operations allocation/retry/offline/policy exercise.
7. Current submission index and source/design handoff.

[Presentation playback](presentation.html) totals 900 seconds. Its receipt is an automated technical traversal. A person must separately rehearse spoken delivery and live actions. The [80-second WebM](demo/PARALLAX-Recorded-Walkthrough.webm) encodes actual captured UI frames with captions. It is not an uninterrupted live screen recording, participant session or proof that a future machine will run those actions.

## Exact-text exports

Session, rehearsal and operations exports now expose the same text after requesting a native download. If no file appears, use **Select export text**, copy into a text editor and save with the shown `.json` filename. Navigation clears that temporary display. Exporting does not submit or reset work. Actual browser-visible session and E01 rehearsal text were materialized to disk and parsed during final validation. Native browser download completion remains separately unconfirmed.

## Scope and administrative facts

Research is secondary-only. No participants were studied. Room/sustainability/safety designs remain conceptual. Sensors and power records are simulated. Operations are local exercises. AI-L1 reads public project guides only. Shared authentication/database, hardware and institutional/site approval are conditional integrations.

[External checks](EXTERNAL_CHECKS.md) contain the unperformed access/device and human rehearsal acceptance steps. Team identities/contributions and the deadline year were not supplied; no declaration is invented. The assignment states three students and 5 August without a year. This packet is a reviewable submission draft, not proof of institutional submission.
