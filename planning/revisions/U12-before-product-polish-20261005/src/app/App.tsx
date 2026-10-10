import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useRouteError,
} from "react-router";
import { useCommands, useLab, usePersistence } from "./context";
import { REACT_STORAGE_KEY } from "../data/persistence";
import { AccessReview } from "../components/AccessReview";
import { PerformanceReview } from "../components/PerformanceReview";
import { downloadJson, ExportFallback } from "../components/ExportFallback";

const exportText = downloadJson;
function Feedback() {
  const { result, sequence, command } = useLab();
  const ref = useRef<HTMLDivElement>(null);
  const silent = [
    "prepare",
    "kit-item",
    "return-item",
    "draft-note",
    "workspace-draft",
    "review-draft",
  ].includes(command || "");
  useEffect(() => {
    if (
      result &&
      !silent &&
      (!result.ok || document.activeElement === document.body)
    )
      ref.current?.focus();
  }, [sequence, result, silent]);
  if (!result || silent) return null;
  const success =
    command === "reserve"
      ? `Booking confirmed in this example session: ${result.booking}.`
      : command === "save-note"
        ? "Notebook claim saved in this session."
        : command === "submit"
          ? `Submitted: ${result.receipt}.`
          : command === "check-in"
            ? "Checked in at your booked station."
            : command === "start"
              ? "Session started with the required kit."
              : command === "report-defer"
                ? "Report retained as a local draft. It has not been submitted."
                : command === "feedback-publish"
                  ? "Example feedback published as a frozen local record."
                  : "Record updated in this example session.";
  return (
    <div
      ref={ref}
      id="command-feedback"
      tabIndex={-1}
      className={`msg ${result.ok ? "good" : "bad"}`}
      role={result.ok ? "status" : undefined}
    >
      <p>{result.ok ? success : result.message}</p>
      {result.gaps && (
        <ul>
          {result.gaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      )}
      {result.alternative && (
        <p>Compatible alternative: {result.alternative}.</p>
      )}
    </div>
  );
}

export function App() {
  const { state } = useLab();
  const dispatch = useCommands();
  const persistence = usePersistence();
  const location = useLocation();
  const publicView = location.pathname === "/wall";
  const main = useRef<HTMLElement>(null);
  const [activity, setActivity] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return window.localStorage.getItem("parallax-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("parallax-theme", theme);
    } catch {
      /* Display preference is optional. */
    }
  }, [theme]);
  useLayoutEffect(() => {
    document.title = `${location.pathname === "/" ? "Today" : location.pathname.split("/").filter(Boolean).join(" · ")} — PARALLAX`;
    dispatch({ type: "clear-feedback" });
    setNavigationOpen(false);
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, dispatch]);
  return (
    <>
      <a
        className="ed-skip"
        href="#current-view"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to the current task
      </a>
      <header className="mast">
        <Link
          className="mast-brand"
          to={publicView ? "/wall" : "/"}
          aria-label={
            publicView ? "PARALLAX — Public display" : "PARALLAX — Today"
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="2"
              y="2"
              width="14"
              height="14"
              fill="none"
              strokeWidth="2"
            />
            <rect x="8" y="8" width="14" height="14" />
          </svg>
          PARALLAX
        </Link>
        <button
          className="pbtn quiet nav-toggle"
          aria-expanded={navigationOpen}
          aria-controls="lab-navigation"
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          Views
        </button>
        <nav
          id="lab-navigation"
          className="mast-nav"
          aria-label="Lab views"
          data-open={navigationOpen}
        >
          {!publicView && (
            <>
              <NavLink end to="/">
                Today
              </NavLink>
              <NavLink to="/dashboard">Smart Lab</NavLink>
              <NavLink to="/tech">Technician</NavLink>
              <NavLink to="/faculty">Faculty</NavLink>
              <NavLink to="/mobile">On site</NavLink>
              <NavLink to="/map">Lab Map</NavLink>
              <NavLink to="/assistant">Ask a guide</NavLink>
            </>
          )}
          <NavLink to="/wall">Public display</NavLink>
          {!publicView && <a href="/design/index.html">Project edition</a>}
          <NavLink to="/safety" state={{ from: location.pathname }}>
            Safety
          </NavLink>
        </nav>
        <button
          className="pbtn quiet"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "Night edition" : "Light edition"}
        </button>
      </header>
      <main id="current-view" className="lab-main" tabIndex={-1} ref={main}>
        {!publicView && persistence.warning && (
          <div className="msg warn" role="status">
            <p>{persistence.warning}</p>
            <button
              className="pbtn"
              onClick={() => {
                try {
                  exportText(
                    window.localStorage.getItem(REACT_STORAGE_KEY) || "{}",
                    "parallax-retained-record.json",
                  );
                } catch {
                  exportText(
                    JSON.stringify(state, null, 2),
                    "parallax-in-memory-record.json",
                  );
                }
              }}
            >
              Export retained record
            </button>
          </div>
        )}
        {!publicView && <Feedback />}
        <Outlet />
      </main>
      {!publicView && (
        <section
          className="session-tools"
          aria-label="Example session controls"
        >
          <button
            className="pbtn quiet"
            aria-expanded={activity}
            aria-controls="session-activity"
            onClick={() => setActivity(!activity)}
          >
            Activity · {state.log.length}
          </button>
          <button
            className="pbtn quiet"
            onClick={() =>
              exportText(
                JSON.stringify({ schemaVersion: 1, state }, null, 2),
                "parallax-react-session.json",
              )
            }
          >
            Export this session
          </button>
          <button
            className="pbtn quiet"
            onClick={() => dispatch({ type: "reset" })}
          >
            {persistence.warning
              ? "Start fresh React example"
              : "Reset React example"}
          </button>
          {persistence.canRestore && (
            <button className="pbtn quiet" onClick={persistence.restore}>
              Restore previous example session
            </button>
          )}
          <span className="small">
            {persistence.saved
              ? "Saved in this browser"
              : "Session retained in memory"}
          </span>
          {activity && (
            <div id="session-activity">
              <h2 className="cap2">Activity</h2>
              {state.log.length ? (
                <ol className="activity-lines">
                  {[...state.log].reverse().map((l) => (
                    <li key={l.n}>
                      <code>
                        {l.time} · {l.ref}
                      </code>
                      <p>
                        {l.actor} · {l.action}
                      </p>
                      <span>{l.reason}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No actions recorded yet.</p>
              )}
            </div>
          )}
        </section>
      )}
      <ExportFallback publicView={publicView} route={location.pathname} />
      <footer className="ed-colophon">
        <div>
          <b>PARALLAX</b>Signal & Computer Vision Lab.
          <br />
          Example fixtures P9-A · geometry P4-D.
        </div>
        <div>
          React + TypeScript. Existing domain rules retained.
          <br />
          No device, account or operational booking service connected.
        </div>
        <div>
          <a href="/design/read.html?doc=phase-09">
            Existing verification record
          </a>
          <br />
          Local guide AI · no student records; sensors remain simulated.
        </div>
      </footer>
      <AccessReview />
      <PerformanceReview />
    </>
  );
}
export function RouteError() {
  useRouteError();
  return (
    <main className="lab-main">
      <h1>This view could not load.</h1>
      <p>Your browser record has not been reset.</p>
      <a className="pbtn" href="#/">
        Return to Today
      </a>{" "}
      <a className="pbtn" href="/prototype/index.html">
        Open original demonstrator
      </a>
    </main>
  );
}
