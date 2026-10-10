# U06 local guide assistant

AI-L1: public project guides only. The user selected local Ollama. The existing `llama3.2:3b` Q4_K_M model is used; no model was downloaded, no API key is needed, and no cloud model is accepted by the adapter.

From the project root, with Ollama running and the local model installed:

```powershell
npm run assistant:start
```

Keep the edition server (`npm start`) or React development server (`npm run lab:dev`) running separately. Open `http://127.0.0.1:4180/apps/lab-web/dist/index.html#/assistant`. The assistant service binds to `127.0.0.1:4192`; allowed browser origins are loopback ports 4180, 4190 and 4191. Node.js 24.13 and Ollama 0.35.0 were observed during verification.

Optional process environment: `OLLAMA_MODEL` defaults to `llama3.2:3b`; `OLLAMA_BASE_URL` defaults to `http://127.0.0.1:11434`. Only a loopback HTTP origin without credentials, paths or query parameters is accepted. The model must appear in `/api/tags` as an installed completion model without remote-host/remote-model markers. A missing model or runtime yields manual fallback. Choosing another model requires rerunning evaluation; installed embeddings and the discovered cloud alias were not used.

The adapter follows Ollama's [chat API](https://docs.ollama.com/api/chat) and [structured output contract](https://docs.ollama.com/capabilities/structured-outputs): non-streaming schema-constrained section IDs, temperature 0, 4096-token context and 120-token output limit. The model selects one passage for hint mode or up to two for explanation. It generates no factual answer wording: the server copies reviewed passage text and a reviewed learning prompt. Citation identity/wording are mechanically verified; relevance still requires review. This small vocabulary-based retriever may refuse valid questions phrased differently. There is no conversational history, embedding index, arbitrary calculation or autonomous tool execution.

The source registry is `../lab-shared/assistant-knowledge.json`. Published E01, E06, WORKFLOW and GEOMETRY guides were reviewed by the project designer against retained sources. This is not institutional or safety-owner approval. Draft and withdrawn revisions expose no body and cannot answer questions. Review source edits against the referenced files, update the guide/collection revision and review date, then evaluate before publishing. Withdraw a guide by changing its state to `withdrawn`; save registry changes atomically. The server rereads it before and after generation. Its SHA-256 fingerprint covers all content and lifecycle metadata, so an overlooked revision bump still invalidates an answer. Rebuild the frontend to update the bundled offline copy; that copy is labelled publication-unchecked when the API is unavailable.

`POST /api/assistant` accepts only request ID, question, selected guide/revision, collection fingerprint and hint/explain purpose. No client role, student record or browser evidence is accepted. Policy checks refuse tested private/live-context and operational requests; the more fundamental boundary is that no such records, credentials or action tools exist in this service. The server retrieves context itself and validates every returned ID. It checks publication again before returning. The 150-second timeout accommodates a cold local model; Cancel aborts the browser request and forwards cancellation to the local provider. The UI ignores late results. A provider may have begun processing before cancellation.

HttpOnly SameSite Strict random cookies identify anonymous local review sessions; they are not institutional authentication. Caches and explicit review flags are isolated by that session. Repeated successful request IDs return the same answer only while source fingerprints match; changed content conflicts. Pending/failed IDs require a new request. Limits: two concurrent generations, 40 requests per session and 100 retained sessions. Questions and answers remain in memory for request recovery; no application transcript file is written. Sessions expire after 30 minutes of inactivity and are lost on server restart. Flags include the question, passages and source revision only after the explicit review action; `/reports` returns the caller's flags. There is no staff notification, cross-user review dashboard, persistent review workflow or automatic model/source correction. The UI question itself is an in-memory draft: navigation/reload clears it. Cancel and recoverable errors retain it.

Checks:

```powershell
npm run assistant:test
npm run assistant:eval
npm run lab:test
npm run lab:build
node apps/lab-web/scripts/validate-u06.cjs
```

The Node tests use clearly identified test adapters/local HTTP fixtures for source withdrawal, malformed output, invalid citations, provider errors, cloud-marker rejection, session isolation and cancellation. The evaluation separately uses the real installed local model. Evidence and remaining scope: [delivery record](../../planning/U06_DELIVERY_RECORD.md).
