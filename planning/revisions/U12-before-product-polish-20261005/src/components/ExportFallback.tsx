import { useEffect, useRef, useState } from "react";

export function downloadJson(text: string, name: string) {
  window.dispatchEvent(new CustomEvent("parallax-export-ready", {detail: {text, name}}));
  const url = URL.createObjectURL(new Blob([text], {type: "application/json"}));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExportFallback({publicView, route}: {publicView: boolean; route: string}) {
  const [record, setRecord] = useState<{text: string; name: string} | null>(null);
  const text = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {setRecord(null);}, [route]);
  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (typeof detail?.text === "string" && typeof detail?.name === "string") setRecord({text: detail.text, name: detail.name});
    };
    window.addEventListener("parallax-export-ready", receive);
    return () => window.removeEventListener("parallax-export-ready", receive);
  }, []);
  if (publicView || !record) return null;
  return <section className="session-tools" aria-label="Export text fallback">
    <h2>Keep a copy of this export.</h2>
    <p role="status">Download requested: {record.name}. Check your browser's downloads. If no file appears, select the text below and save it as that filename in a text editor.</p>
    <label htmlFor="export-fallback">Exact export text</label>
    <textarea ref={text} id="export-fallback" readOnly rows={12} value={record.text} style={{width: "100%"}} />
    <button className="pbtn" onClick={() => {text.current?.focus(); text.current?.select();}}>Select export text</button>
    <p className="small">This copy stays in this view until navigation or reload. Exporting does not submit work or reset your record.</p>
  </section>;
}
