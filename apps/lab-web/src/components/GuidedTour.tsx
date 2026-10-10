import { useNavigate } from "react-router";

// A presenter's path through the prototype. Each stop is a real page; the line is what to say there.
export const tourStops: { to: string; title: string; say: string }[] = [
  { to: "/", title: "Today", say: "The student home: the room, today's experiments and quick actions." },
  { to: "/E01/prepare", title: "Prepare", say: "The digital experiment manual: the question, the kit and a safety check." },
  { to: "/E01/reserve", title: "Reserve", say: "One booking holds the station and every kit item for the same time." },
  { to: "/E01/rehearsal", title: "Rehearse", say: "Predict first, then compare a 2 Hz reference sampled at 3 Hz and 20 Hz." },
  { to: "/dashboard", title: "Smart lab", say: "Restrictions, sessions, receipts, example readings and how real each smart feature is." },
  { to: "/environment", title: "Environment & energy", say: "Every reading shows its source and age. Standby never touches booked equipment." },
  { to: "/map", title: "Lab map", say: "The digital twin: one geometry drives the plan, the status list and the 3D model." },
  { to: "/mobile", title: "On site", say: "Type the printed label to open the right record. No camera permission needed." },
  { to: "/tech", title: "Technician", say: "A fault report restricts the asset everywhere at once." },
  { to: "/walkthrough", title: "Fault walkthrough", say: "Ten stages of one fault. Stage 8 refuses release before verification." },
  { to: "/faculty", title: "Faculty", say: "The rotation plan, cohort readiness and attendance corrections that keep the original." },
  { to: "/assistant", title: "Ask a guide", say: "A local model answers only from reviewed guides, and shows the source." },
  { to: "/wall", title: "Public display", say: "The notice board for the wall screen, with no private data." },
  { to: "/safety", title: "Safety", say: "Exits, extinguishers, first aid and power-off: design positions, not an approved plan." },
];

export function TourStrip({
  index,
  onChange,
}: {
  index: number;
  onChange: (next: number | null) => void;
}) {
  const navigate = useNavigate();
  const stop = tourStops[index];
  const go = (next: number) => {
    onChange(next);
    navigate(tourStops[next].to);
  };
  return (
    <section className="tour-strip" aria-label="Guided tour">
      <p className="tour-count">
        Tour · {String(index + 1).padStart(2, "0")} / {tourStops.length}
      </p>
      <p className="tour-say" role="status">
        <strong>{stop.title}.</strong> {stop.say}
      </p>
      <div className="tour-actions">
        <button
          className="pbtn quiet"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          ← Back
        </button>
        {index < tourStops.length - 1 ? (
          <button className="pbtn primary" onClick={() => go(index + 1)}>
            Next: {tourStops[index + 1].title} →
          </button>
        ) : (
          <button className="pbtn primary" onClick={() => onChange(null)}>
            Finish tour
          </button>
        )}
        <button className="pbtn quiet" onClick={() => onChange(null)}>
          End
        </button>
      </div>
    </section>
  );
}
