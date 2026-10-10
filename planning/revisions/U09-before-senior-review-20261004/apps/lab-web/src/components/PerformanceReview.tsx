import { useEffect, useState } from "react";

// Explicit, local-only instrumentation. Measures input-to-two-animation-frame latency,
// not network latency, student outcomes or assistive-technology usability.
export function PerformanceReview() {
  const [receipt, setReceipt] = useState<Record<string, unknown>>({});
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("qa") !== "1") return;
    let active = true;
    let initialRenderedMs: number | null = null;
    const frames = new Set<number>();
    const samples: {event: string; label: string; ms: number; route: string}[] = [];
    const nextFrame = (callback: FrameRequestCallback) => {
      const id = requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
    };
    const publish = () => {
      if (!active) return;
      if (document.querySelector("main h1")) initialRenderedMs ??= Number(performance.now().toFixed(2));
      setReceipt({method: "event capture to two animation frames; local desktop browser", initialRenderedMs, samples: [...samples]});
    };
    nextFrame(() => nextFrame(publish));
    const main = document.querySelector("main");
    const observer = new MutationObserver(() => {
      if (initialRenderedMs === null && main?.querySelector("h1")) {
        observer.disconnect(); nextFrame(() => nextFrame(publish));
      }
    });
    if (main) observer.observe(main, {childList: true, subtree: true});
    const measure = (event: Event) => {
      const target = event.target instanceof Element ? event.target.closest("button,a,input,select,textarea,summary") : null;
      if (!target || target.closest(".access-review,[data-performance-review]")) return;
      const start = performance.now();
      const label = (target.getAttribute("aria-label") || target.textContent || target.getAttribute("id") || target.tagName).trim().slice(0, 100);
      nextFrame(() => nextFrame(() => {
        samples.push({event: event.type, label, ms: Number((performance.now() - start).toFixed(2)), route: window.location.hash});
        if (samples.length > 200) samples.shift();
        publish();
      }));
    };
    document.addEventListener("click", measure, true);
    document.addEventListener("change", measure, true);
    return () => { active = false; observer.disconnect(); frames.forEach(cancelAnimationFrame); document.removeEventListener("click", measure, true); document.removeEventListener("change", measure, true); };
  }, []);
  if (new URLSearchParams(window.location.search).get("qa") !== "1") return null;
  return <details data-performance-review className="access-review"><summary>Local performance receipt</summary><p>Two-frame visual latency proxy. Inspect the view separately before treating a transition as usable.</p><pre data-testid="performance-report">{JSON.stringify(receipt, null, 2)}</pre></details>;
}
