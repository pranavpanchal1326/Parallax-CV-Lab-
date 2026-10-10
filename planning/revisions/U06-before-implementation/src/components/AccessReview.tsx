import { useState } from "react";

// Explicit local QA mode (?qa=1); no automatic scan and no external telemetry.
export function AccessReview() {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<string | null>(null);
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
            setReport(
              JSON.stringify(
                {
                  path: window.location.hash,
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
            setReport(
              `Accessibility check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
          } finally {
            setRunning(false);
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
