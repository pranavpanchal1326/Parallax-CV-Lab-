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

function exportText(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Feedback() {
  const { result, sequence, command } = useLab();
  const ref = useRef<HTMLDivElement>(null);
  const silent = ["prepare", "kit-item", "return-item", "draft-note"].includes(
    command || "",
  );
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
              : "Record updated in this example session.";
  return (
    <div
      ref={ref}
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
  }, [theme]);
  useLayoutEffect(() => {
    document.title = `${location.pathname === "/" ? "Today" : location.pathname.split("/").filter(Boolean).join(" · ")} — PARALLAX`;
    dispatch({ type: "clear-feedback" });
    main.current?.focus();
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
        <Link className="mast-brand" to="/" aria-label="PARALLAX — Today">
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
        <nav className="mast-nav" aria-label="Lab views">
          <NavLink end to="/">
            Today
          </NavLink>
          <NavLink to="/dashboard">Smart Lab</NavLink>
          <NavLink to="/tech">Technician</NavLink>
          <NavLink to="/wall">Public display</NavLink>
          <a href="/design/index.html">Project edition</a>
        </nav>
        <button
          className="pbtn quiet"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "Night edition" : "Light edition"}
        </button>
      </header>
      <div className="migration-strip">
        <span>Smart Lab · EX-2.2 · isolated example session</span>
        <a href="/prototype/index.html">Original demonstrator ↗</a>
      </div>
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
          AI and sensor integrations are later phases.
        </div>
      </footer>
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
