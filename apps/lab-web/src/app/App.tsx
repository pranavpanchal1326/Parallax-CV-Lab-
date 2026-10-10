import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router";
import { useCommands, useLab, usePersistence } from "./context";
import { REACT_STORAGE_KEY } from "../data/persistence";
import { AccessReview } from "../components/AccessReview";
import { PerformanceReview } from "../components/PerformanceReview";
import { downloadJson, ExportFallback } from "../components/ExportFallback";
import { TourStrip, tourStops } from "../components/GuidedTour";
import { CommandPalette } from "../components/CommandPalette";

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
      ? `Booking confirmed: ${result.booking}.`
      : command === "save-note"
        ? "Notebook claim saved."
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
                  : "Record updated.";
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

const titles: [RegExp, string][] = [
  [/^\/$/, "Today"],
  [/^\/dashboard/, "Smart lab"],
  [/^\/environment/, "Environment & energy"],
  [/^\/faculty\/attendance/, "Attendance"],
  [/^\/faculty\/assessment/, "Assessment"],
  [/^\/faculty/, "Faculty"],
  [/^\/map/, "Lab map"],
  [/^\/assets\/[^/]+\/calibration/, "Calibration"],
  [/^\/assets\//, "Asset record"],
  [/^\/mobile\/report/, "Report a problem"],
  [/^\/mobile/, "On site"],
  [/^\/bookings/, "My bookings"],
  [/^\/safety/, "Safety"],
  [/^\/studio/, "Art & physical reference"],
  [/^\/assistant/, "Ask a guide"],
  [/^\/operations/, "Operations desk"],
  [/^\/walkthrough/, "Fault walkthrough"],
  [/^\/scene\/rehearsal/, "Geometry rehearsal"],
  [/^\/tech/, "Technician"],
  [/^\/wall/, "Public display"],
  [/^\/(E\d+)\/rehearsal/, "$1 rehearsal"],
  [/^\/(E\d+)\/conditions/, "$1 recorded conditions"],
  [/^\/(E\d+)\/(\w+)/, "$1 · $2"],
];
function pageTitle(path: string) {
  for (const [pattern, title] of titles) {
    const match = path.match(pattern);
    if (match) return title.replace("$1", match[1] || "").replace("$2", match[2] || "");
  }
  return "Page not found";
}

export function App() {
  const { state } = useLab();
  const dispatch = useCommands();
  const persistence = usePersistence();
  const location = useLocation();
  const publicView = location.pathname === "/wall";
  const role = publicView
    ? "Public display"
    : /^\/(tech|operations|walkthrough|assets)/.test(location.pathname)
      ? "Technician view"
      : location.pathname.startsWith("/faculty")
        ? "Faculty view"
        : /^\/(dashboard|environment)/.test(location.pathname)
          ? "Lab staff view"
          : "Student view";
  const main = useRef<HTMLElement>(null);
  const roleMenu = useRef<HTMLDetailsElement>(null);
  const [activity, setActivity] = useState(false);
  const navigate = useNavigate();
  const [tour, setTour] = useState<number | null>(() => {
    try {
      const saved = window.sessionStorage.getItem("parallax-tour");
      const value = saved === null ? NaN : Number(saved);
      return Number.isInteger(value) && value >= 0 && value < tourStops.length ? value : null;
    } catch {
      return null;
    }
  });
  const changeTour = (next: number | null) => {
    setTour(next);
    try {
      if (next === null) window.sessionStorage.removeItem("parallax-tour");
      else window.sessionStorage.setItem("parallax-tour", String(next));
    } catch {
      /* The tour position is a convenience only. */
    }
  };
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
    document.title = `${pageTitle(location.pathname)} — PARALLAX`;
    dispatch({ type: "clear-feedback" });
    setNavigationOpen(false);
    if (roleMenu.current) roleMenu.current.open = false;
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    if (main.current) {
      main.current.classList.remove("view-enter");
      void main.current.offsetWidth;
      main.current.classList.add("view-enter");
    }
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
              <span className="nav-group" aria-hidden="true">Student</span>
              <NavLink end to="/">
                Today
              </NavLink>
              <NavLink to="/map">Lab map</NavLink>
              <NavLink to="/mobile">On site</NavLink>
              <NavLink to="/assistant">Ask a guide</NavLink>
              <span className="nav-group" aria-hidden="true">Staff</span>
              <NavLink to="/dashboard">Smart lab</NavLink>
              <NavLink to="/tech">Technician</NavLink>
              <NavLink to="/faculty">Faculty</NavLink>
              <span className="nav-group" aria-hidden="true">Room</span>
            </>
          )}
          <NavLink to="/wall">Public display</NavLink>
          <NavLink to="/safety" state={{ from: location.pathname }}>
            Safety
          </NavLink>
        </nav>
        <div className="mast-tools">
          <button
            className="pbtn quiet tour-open"
            aria-pressed={tour !== null}
            aria-label={tour !== null ? "End tour" : "Guided tour"}
            onClick={() => {
              if (tour !== null) changeTour(null);
              else {
                changeTour(0);
                navigate(tourStops[0].to);
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 21V4M5 4h12l-2.500 4L17 12H5" />
            </svg>
            <span>{tour !== null ? "End tour" : "Guided tour"}</span>
          </button>
          <CommandPalette />
          <details className="role-menu" ref={roleMenu}>
            <summary className="role-chip" aria-label={`${role}. Switch view`}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8.5" r="3.6" />
                <path d="M4.5 20c.8-4 3.8-6 7.5-6s6.700 2 7.500 6" />
              </svg>
              {role}
            </summary>
            <ul className="role-menu-list">
              <li><NavLink end to="/">Student <small>Today</small></NavLink></li>
              <li><NavLink to="/tech">Technician <small>Faults and assets</small></NavLink></li>
              <li><NavLink to="/faculty">Faculty <small>Teaching plan</small></NavLink></li>
              <li><NavLink to="/dashboard">Lab staff <small>Smart lab</small></NavLink></li>
              <li><NavLink to="/wall">Public display <small>Wall screen</small></NavLink></li>
            </ul>
          </details>
          <button
            className="pbtn quiet theme-switch"
            aria-label={
              theme === "light"
                ? "Switch to night edition"
                : "Switch to light edition"
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              {theme === "light" ? (
                <path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="4.200" />
                  <path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" />
                </>
              )}
            </svg>
            <span>{theme === "light" ? "Night" : "Light"}</span>
          </button>
        </div>
      </header>
      {tour !== null && <TourStrip index={tour} onChange={changeTour} />}
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
      <ExportFallback publicView={publicView} route={location.pathname} />
      <footer className="ed-colophon">
        <div>
          <b>PARALLAX</b>Signal &amp; Computer Vision Lab · 70 m²
        </div>
        <div>
          Design prototype. Bookings, readings and records shown here are
          examples.
        </div>
        <div className="colophon-links">
          <a href="/design/index.html">Project edition</a>
          <a href="/design/read.html?doc=phase-09">Verification record</a>
          <a href="/prototype/index.html">Original demonstrator</a>
        </div>
        {!publicView && (
          <div className="colophon-session">
          <details className="session-drawer">
            <summary>Session tools</summary>
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
              ? "Start a fresh session"
              : "Reset this session"}
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
          </details>
          </div>
        )}
      </footer>
      <AccessReview />
      <PerformanceReview />
    </>
  );
}
export function RouteError() {
  useRouteError();
  return (
    <main className="lab-main route-error">
      <p className="ed-kicker">Page not found</p>
      <h1>This view could not load.</h1>
      <p>
        The address may be mistyped, or the page hit a problem. Your saved work
        has not been reset.
      </p>
      <a className="pbtn" href="#/">
        Return to Today
      </a>{" "}
      <a className="pbtn" href="/prototype/index.html">
        Open original demonstrator
      </a>
    </main>
  );
}
