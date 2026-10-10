# PARALLAX React migration · EX-2.1

Separate React + TypeScript + Vite application reusing `../../prototype/store.js`, fixture P9-A, geometry P4-D and the existing Atlas+/Edition tokens. Both seven-step student routes and a technician/public projection are implemented as a migration slice. Full visual, interaction, access and device parity remains under review.

From the project root:

```powershell
npm start
```

Keep the edition server on 4180 for reference links. In another terminal:

```powershell
npm run lab:dev
```

Open `http://localhost:4190/`. Separate state key: `parallax-react-state-v1`. It does not write the legacy primary state or Lab Map projection. Role navigation is a demonstrator preview, not authentication. Examples are not operational reservations or real device data.

```powershell
npm run lab:test
npm run lab:build
npm run check
```

Dependencies are pinned in the local package/lockfile. For a fresh checkout run `npm ci --prefix apps/lab-web`. Build output can be served by the existing root server at `http://localhost:4180/apps/lab-web/dist/index.html`; verify reference links with the root server running.

Immutable transitions retain the existing rule outcomes, including failed-save drafts and pending submission acknowledgements. Persistence catches storage failures and preserves incompatible records. Export controls provide a local copy. New smart integrations and condition records are later upgrade phases.

Upgrade sequence: `../../planning/EXCELLENCE_EXECUTION_PHASES.md`. Master contracts: `../../PARALLAX_EXCELLENCE_BLUEPRINT.md`. Source baseline: `../../planning/revisions/EX-2.1-baseline/`.
