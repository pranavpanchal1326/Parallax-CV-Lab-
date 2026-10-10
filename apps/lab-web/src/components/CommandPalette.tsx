import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { fixtures, experimentIds, experiments } from "../data/fixtures";

type Entry = { label: string; hint: string; to: string };

const pages: Entry[] = [
  { label: "Today", hint: "Student", to: "/" },
  { label: "My bookings", hint: "Student", to: "/bookings" },
  { label: "Lab map", hint: "Student", to: "/map" },
  { label: "On site lookup", hint: "Student", to: "/mobile" },
  { label: "Report a problem", hint: "Student", to: "/mobile/report" },
  { label: "Ask a guide", hint: "Student", to: "/assistant" },
  { label: "Smart lab dashboard", hint: "Staff", to: "/dashboard" },
  { label: "Environment & energy", hint: "Staff", to: "/environment" },
  { label: "Technician", hint: "Staff", to: "/tech" },
  { label: "Fault walkthrough", hint: "Staff", to: "/walkthrough" },
  { label: "Operations desk", hint: "Staff", to: "/operations" },
  { label: "Faculty", hint: "Staff", to: "/faculty" },
  { label: "Attendance", hint: "Staff", to: "/faculty/attendance" },
  { label: "Assessment", hint: "Staff", to: "/faculty/assessment" },
  { label: "Public display", hint: "Room", to: "/wall" },
  { label: "Safety", hint: "Room", to: "/safety" },
  { label: "Art & physical reference", hint: "Room", to: "/studio" },
  { label: "Geometry rehearsal", hint: "Room", to: "/scene/rehearsal" },
];

export function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const entries = useMemo<Entry[]>(
    () => [
      ...pages,
      ...experimentIds.flatMap((exp) => [
        { label: `${exp} · ${experiments[exp].title}`, hint: "Experiment", to: `/${exp}/prepare` },
        { label: `${exp} rehearsal`, hint: "Experiment", to: `/${exp}/rehearsal` },
      ]),
      ...fixtures.resources.map((r) => ({ label: `${r.id} · ${r.name}`, hint: "Equipment", to: `/assets/${r.id}` })),
    ],
    [],
  );
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (q ? entries.filter((e) => `${e.label} ${e.hint}`.toLowerCase().includes(q)) : entries).slice(0, 9);
  }, [entries, query]);
  const open = () => {
    setQuery("");
    setActive(0);
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  };
  const choose = (entry?: Entry) => {
    if (!entry) return;
    dialog.current?.close();
    navigate(entry.to);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable);
      if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button className="pbtn quiet palette-open" onClick={open} aria-haspopup="dialog" aria-label="Search pages and equipment">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.500 15.500 21 21" />
        </svg>
        <span>Search</span>
        <kbd aria-hidden="true">/</kbd>
      </button>
      <dialog ref={dialog} className="palette" aria-label="Search pages and equipment">
        <form
          method="dialog"
          onSubmit={(event) => {
            event.preventDefault();
            choose(results[active]);
          }}
        >
          <label htmlFor="palette-query">Go to a page, experiment or piece of equipment</label>
          <input
            id="palette-query"
            type="text"
            autoComplete="off"
            value={query}
            placeholder="Try “map”, “C1-CAM” or “faculty”"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-option-${active}` : undefined}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((value) => Math.min(value + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((value) => Math.max(value - 1, 0));
              }
            }}
          />
          <ul id="palette-results" role="listbox" aria-label="Results">
            {results.map((entry, index) => (
              <li
                key={entry.to + entry.label}
                id={`palette-option-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(entry)}
              >
                <span>{entry.label}</span>
                <small>{entry.hint}</small>
              </li>
            ))}
            {!results.length && <li className="palette-empty">Nothing matches. Try a shorter word.</li>}
          </ul>
          <p className="palette-help">
            <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close
          </p>
        </form>
      </dialog>
    </>
  );
}
