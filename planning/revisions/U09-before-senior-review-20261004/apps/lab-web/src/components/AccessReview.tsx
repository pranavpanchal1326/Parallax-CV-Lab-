import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

// Explicit local QA mode (?qa=1); no automatic scan and no external telemetry.
export function AccessReview() {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const location = useLocation();
  const generation = useRef(0);
  useEffect(() => {
    generation.current++;
    setReport(null);
    setRunning(false);
    return () => { generation.current++; };
  }, [location.pathname, location.search]);
  if (new URLSearchParams(window.location.search).get("qa") !== "1")
    return null;
  return (
    <section
      className="access-review"
      aria-label="Local accessibility diagnostics"
    >
      <h2>Local accessibility check</h2>
      <p className="small">
        Axe-core 4.10.2 · current rendered view only. Automated results do not
        establish full accessibility conformance or screen-reader usability.
      </p>
      <button
        className="pbtn"
        disabled={running}
        onClick={async () => {
          const token = ++generation.current;
          const scannedPath = `#${location.pathname}${location.search}`;
          setRunning(true);
          setReport(null);
          try {
            const { default: axe } = await import("axe-core");
            const result = await axe.run(document, {
              runOnly: {
                type: "tag",
                values: [
                  "wcag2a",
                  "wcag2aa",
                  "wcag21a",
                  "wcag21aa",
                  "wcag22aa",
                  "best-practice",
                ],
              },
            });
            if (token !== generation.current) return;
            setReport(
              JSON.stringify(
                {
                  path: scannedPath,
                  violations: result.violations.map((v) => ({
                    id: v.id,
                    impact: v.impact,
                    help: v.help,
                    nodes: v.nodes.map((n) => ({
                      target: n.target,
                      summary: n.failureSummary,
                    })),
                  })),
                  passedRules: result.passes.length,
                  incomplete: result.incomplete.map((v) => ({
                    id: v.id,
                    nodes: v.nodes.map((n) => ({
                      target: n.target,
                      summary: n.failureSummary,
                    })),
                  })),
                  engine: result.testEngine,
                },
                null,
                2,
              ),
            );
          } catch (error) {
            if (token !== generation.current) return;
            setReport(
              `Accessibility check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
          } finally {
            if (token === generation.current) setRunning(false);
          }
        }}
      >
        {running ? "Checking this view…" : "Check this rendered view"}
      </button>
      {report && (
        <pre
          data-testid="access-report"
          tabIndex={0}
          aria-label="Accessibility diagnostic result"
        >
          {report}
        </pre>
      )}
    </section>
  );
}
