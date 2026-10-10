import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import localPack from "../../../lab-shared/assistant-knowledge.json";

interface Section { id: string; title: string; text: string; hint: string }
interface Guide { id: string; revision: string; title: string; state: string; task?: string; sections: Section[]; references: string[] }
interface Catalog { revision: string; reviewedAt: string; reviewOwner: string; scope: string; fingerprint: string; guides: Guide[] }
interface Answer { answerId: string; requestId: string; question: string; purpose: string; fingerprint: string; guide: {id: string; revision: string; title: string}; passages: Section[]; createdAt: string; provider: {model: string; digest: string}; metrics: {elapsedMs: number; promptTokens: number; outputTokens: number}; method: string; missingInformation: string; nextAction: string }
interface Provider { available: boolean; model: string; digest?: string; reason?: string }
interface Report { answerId: string; reason: string; status: string; createdAt: string }
const offline: Catalog = {...localPack, fingerprint: "", guides: localPack.guides as Guide[]};
const api = () => `http://${window.location.hostname === "localhost" ? "localhost" : "127.0.0.1"}:4192/api/assistant`;
async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(api() + path, {...init, credentials: "include"});
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || "The local assistant could not complete this request.");
  return body as T;
}
const examples: Record<string,string> = { E01: "Why can the 3 Hz samples show a 1 Hz alias?", E06: "Can these illustrations establish detection accuracy?", WORKFLOW: "Why does a repair need verification before release?", GEOMETRY: "What changes when the field of view widens?" };
export function Assistant() {
  const [params, setParams] = useSearchParams();
  const [pack,setPack] = useState<Catalog>(offline);
  const [connected,setConnected] = useState(false);
  const [provider,setProvider] = useState<Provider>();
  const [question,setQuestion] = useState("");
  const [purpose,setPurpose] = useState("hint");
  const [result,setResult] = useState<Answer>();
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const [refreshing,setRefreshing] = useState(false);
  const [reporting,setReporting] = useState(false);
  const [reason,setReason] = useState("unclear");
  const [reports,setReports] = useState<Report[]>([]);
  const [reviewNotice,setReviewNotice] = useState("");
  const generation = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const answerHeading = useRef<HTMLHeadingElement>(null);
  const published = pack.guides.filter(g=>g.state === "published");
  const guide = published.find(g=>g.id === params.get("guide")) || published[0];
  const requestedRevision = params.get("revision");
  const sectionId = params.get("section");
  const changed = result && (result.question !== question.trim() || result.guide.id !== guide.id || result.guide.revision !== guide.revision || result.purpose !== purpose || result.fingerprint !== pack.fingerprint || !connected);
  async function refresh(signal?: AbortSignal) {
    setRefreshing(true);
    const [source,status,review] = await Promise.allSettled([
      json<Catalog>("/catalog",{signal}), json<{provider:Provider}>("/status",{signal}), json<{reports:Report[]}>("/reports",{signal})
    ]);
    if (signal?.aborted) return;
    if (source.status === "fulfilled" && source.value.guides.some(g=>g.state === "published")) { setPack(source.value); setConnected(true); }
    else if (source.status === "fulfilled") { setPack(offline); setConnected(false); setError("No published guides are available for AI. The bundled reader is an archived copy; ask responsible staff for a current source."); }
    else { setConnected(false); setError("Manual reading mode. The local assistant is not running, so hints are off; the bundled guides stay readable. Their current publication status has not been checked."); }
    if (status.status === "fulfilled") setProvider(status.value.provider); else setProvider(undefined);
    if (review.status === "fulfilled") setReports(review.value.reports);
    setRefreshing(false);
  }
  useEffect(()=>{ const controller=new AbortController(); void refresh(controller.signal); return ()=>{controller.abort(); generation.current++; pending.current?.abort();}; },[]);
  useEffect(()=>{
    if (sectionId && (!requestedRevision || requestedRevision === guide.revision)) {
      const section = document.getElementById(`source-${sectionId}`);
      section?.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
      section?.focus({preventScroll:true});
    }
  },[sectionId, requestedRevision, guide.id, guide.revision]);
  async function ask(event: React.FormEvent) {
    event.preventDefault();
    const token = ++generation.current;
    const controller = new AbortController(); pending.current=controller;
    setBusy(true); setError(""); setReviewNotice("");
    try {
      const next = await json<Answer>("", {method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({requestId:crypto.randomUUID(),question,guideId:guide.id,guideRevision:guide.revision,fingerprint:pack.fingerprint,purpose})});
      if (token !== generation.current || controller.signal.aborted) return;
      setResult(next); setTimeout(()=>answerHeading.current?.focus(),0);
    } catch (failure) { if (token === generation.current && !controller.signal.aborted) setError(failure instanceof Error ? failure.message : "The answer could not be checked."); }
    finally { if(token === generation.current) { setBusy(false); pending.current=null; } }
  }
  function cancel() { generation.current++; pending.current?.abort(); pending.current=null; setBusy(false); setError("Request cancelled. Your question is retained; you can read the guide or ask again."); }
  async function report() {
    if (!result) return;
    setReporting(true); setReviewNotice("");
    try { const saved = await json<Report>("/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answerId:result.answerId,reason})}); setReports(previous=>[...previous.filter(r=>r.answerId!==saved.answerId),saved]); setReviewNotice("Flag retained for local review in this session. It does not change the model or guide."); }
    catch(failure) { setReviewNotice(failure instanceof Error ? failure.message : "The flag could not be saved."); }
    finally { setReporting(false); }
  }
  return <>
    <p className="ed-kicker">Learning support · project guides</p>
    <h1>A question, <em>with a source.</em></h1>
    <p className="assistant-intro">Get a hint or find an explanation in a reviewed guide. Check the passage, then make the reasoning your own.</p>
    <div className="assistant-layout">
      <section className="assistant-desk" aria-labelledby="assistant-ask">
        <h2 id="assistant-ask">Ask the guide</h2>
        <p className="assistant-boundary">Your question and selected guide go to local Ollama. Browser evidence, notebook entries and private records are not included.</p>
        <form onSubmit={ask}>
          <label htmlFor="assistant-guide">Project guide</label>
          {params.get("guide") && !published.some(g=>g.id===params.get("guide")) && <p className="msg warn">The requested guide is unavailable. Choose one of the published guides below.</p>}
          <select id="assistant-guide" value={guide.id} disabled={busy} onChange={e=>{setParams({guide:e.target.value});setError("");}}>{published.map(g=><option key={g.id} value={g.id}>{g.id} · {g.title}</option>)}</select>
          <fieldset disabled={busy} className="assistant-purpose"><legend>How would you like to start?</legend>
            <label><input type="radio" name="purpose" value="hint" checked={purpose==="hint"} onChange={()=>setPurpose("hint")}/> A hint first</label>
            <label><input type="radio" name="purpose" value="explain" checked={purpose==="explain"} onChange={()=>setPurpose("explain")}/> More explanation</label>
          </fieldset>
          <label htmlFor="assistant-question">Your question</label>
          <textarea id="assistant-question" rows={5} minLength={4} maxLength={1500} required disabled={busy} value={question} aria-describedby="question-help" onChange={e=>setQuestion(e.target.value)}/>
          <p id="question-help" className="assistant-small">Ask about the method or the limits of its evidence. Keep personal information out of your question.</p>
          <button type="button" className="pbtn quiet" disabled={busy} onClick={()=>{setQuestion(examples[guide.id]);setError("");}}>Use an example question</button>
          <div className="assistant-actions"><button className="pbtn primary" disabled={busy || !connected || question.trim().length<4}>{busy ? "Finding a passage…" : purpose === "hint" ? "Find a hint" : "Find an explanation"}</button>
          {busy && <button type="button" className="pbtn" onClick={cancel}>Cancel request</button>}</div>
        </form>
        {busy && <p role="status">Ollama is reading the selected passages. The first answer can take longer while the model loads.</p>}
        {error && <p className={error.startsWith("Manual reading mode") ? "msg" : "msg warn"} role="alert">{error}</p>}
        <div className="assistant-service">
          <p><strong>{connected && provider?.available ? "Local AI ready" : "Manual reader available"}</strong><br/>{provider?.available ? provider.model : provider?.reason || (error ? "Start the local assistant to turn hints on." : "Checking the local service…")}</p>
          <button className="pbtn quiet" disabled={busy || refreshing} onClick={()=>{setError("");void refresh();}}>{refreshing ? "Checking…" : "Refresh guides & connection"}</button>
          <Link className="assistant-return" to={guide.task || "/"}>Return to {guide.id === "WORKFLOW" ? "the equipment walkthrough" : guide.id === "GEOMETRY" ? "the geometry rehearsal" : `${guide.id} preparation`} →</Link>
        </div>
      </section>
      <div className="assistant-reading">
        <section className="assistant-answer" aria-labelledby="assistant-answer-heading" aria-busy={busy}>
          <p className="ed-kicker">{result ? "Source-backed passage" : "Begin with what is known"}</p>
          <h2 id="assistant-answer-heading" ref={answerHeading} tabIndex={-1}>{result ? "From the guide" : "The source stays in view."}</h2>
          {!result ? <p>Your answer will link to the guide revision and section used. Local AI selects passages; their wording comes directly from the reviewed guide.</p> : <>
            {changed && <p className="msg warn">This answer belongs to an earlier question or source context. Ask again for the current selection.</p>}
            <p className="assistant-small">Asked: {result.question}</p>
            {result.passages.map(s=><div className="assistant-passage" key={s.id}><h3>{s.title}</h3><blockquote>{s.text}</blockquote><Link to={`/assistant?guide=${result.guide.id}&revision=${result.guide.revision}&section=${s.id}`} onClick={()=>{if (guide.id === result.guide.id && guide.revision === result.guide.revision) {const target=document.getElementById(`source-${s.id}`);target?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});target?.focus({preventScroll:true});}}}>{result.guide.id} · revision {result.guide.revision} · {s.id}</Link></div>)}
            <div className="assistant-next"><h3>Your next step</h3><p>{result.nextAction}</p></div>
            <p className="assistant-small">{result.missingInformation}</p>
            <details><summary>How this answer was produced</summary><p>{result.method}</p><p>{result.provider.model} · {(result.metrics.elapsedMs/1000).toFixed(1)} seconds · {result.metrics.promptTokens} input / {result.metrics.outputTokens} output tokens.</p><p>Generated {new Date(result.createdAt).toLocaleString()}. Model digest: <code>{result.provider.digest}</code></p><p>Citations confirm source identity and wording. They do not prove the passage answers your question correctly.</p></details>
            <details className="assistant-review"><summary>Flag this answer for local review</summary><p>This sends the question, quoted passages, source revision and chosen reason to a review list for your current local session. The list is held in server memory until expiry or restart; no staff notification is sent.</p><label htmlFor="review-reason">Reason</label><select id="review-reason" value={reason} onChange={e=>setReason(e.target.value)}><option value="unclear">The answer is unclear</option><option value="irrelevant">The passage does not answer my question</option><option value="source-problem">The guide may be outdated or incorrect</option></select><button className="pbtn" disabled={reporting || reports.some(r=>r.answerId===result.answerId)} onClick={()=>void report()}>{reports.some(r=>r.answerId===result.answerId) ? "Flag retained" : reporting ? "Saving flag…" : "Send question & passage for local review"}</button></details>
          </>}
          {reviewNotice && <p role="status">{reviewNotice}</p>}
        </section>
        <section className="assistant-manual" aria-labelledby="manual-heading">
          <div className="assistant-manual-head"><p className="ed-kicker">Readable without AI</p><h2 id="manual-heading">{guide.title}</h2><p className="assistant-small">{guide.id} · revision {guide.revision} · {connected ? "Published project guide" : "Bundled offline copy · publication status unchecked"}</p></div>
          {requestedRevision && requestedRevision !== guide.revision && <p className="msg warn">Requested revision {requestedRevision} is unavailable here. The reader shows published revision {guide.revision}; it cannot verify an older answer against this copy.</p>}
          {guide.sections.map(s=><article id={`source-${s.id}`} tabIndex={-1} key={s.id}><h3>{s.title}</h3><p>{s.text}</p><span className="assistant-small">Section {s.id}</span></article>)}
          <details><summary>Source scope & lifecycle</summary><p>{pack.scope}</p><p>Reviewed {pack.reviewedAt} by {pack.reviewOwner}. This is project review, not approval by an institution or safety owner.</p><ul>{guide.references.map(ref=><li key={ref}><code>{ref}</code></li>)}</ul><p>Draft and withdrawn revisions cannot be used for answers. Publication is checked again after generation.</p><ul>{pack.guides.filter(g=>g.state!=="published").map(g=><li key={`${g.id}-${g.revision}`}>{g.id} · {g.revision} · {g.state}</li>)}</ul></details>
        </section>
        <details className="assistant-local-reviews"><summary>Your local review flags · {reports.length}</summary>{reports.length ? <ul>{reports.map(r=><li key={r.answerId}>{r.reason} · {r.status} · {new Date(r.createdAt).toLocaleString()}</li>)}</ul> : <p>No flags in this session.</p>}<p>For an actual lab issue, contact responsible staff using the lab's normal procedure.</p></details>
      </div>
    </div>
  </>;
}
