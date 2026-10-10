import { useCallback, useEffect, useRef, useState } from "react";
import { useLab } from "../app/context";
import { selectors } from "../domain/adapter";
import { fixtures } from "../data/fixtures";
import { useNavigate } from "react-router";

export function LinkedMap() {
  const { state } = useLab(),
    frame = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const project = useCallback(() => {
    const resources = Object.fromEntries(
      fixtures.resources.map((r) => [
        r.id,
        {
          availability: selectors.availability(state, r.id).label,
          occupancy: selectors.occupancy(state, fixtures, r.id).label,
        },
      ]),
    );
    frame.current?.contentWindow?.postMessage(
      {
        type: "parallax-react-map",
        resources,
        time: `${String(Math.floor(state.minute / 60) % 24).padStart(2, "0")}:${String(state.minute % 60).padStart(2, "0")}`,
      },
      window.location.origin,
    );
  }, [state]);
  useEffect(() => {
    const received = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== window.location.origin
      )
        return;
      if (event.data?.type === "parallax-map-ready") {
        project();
        setReady(true);
      }
      if (
        event.data?.type === "parallax-map-open" &&
        fixtures.resources.some((r) => r.id === event.data.asset)
      )
        navigate(`/assets/${event.data.asset}`);
    };
    window.addEventListener("message", received);
    if (ready) project();
    return () => window.removeEventListener("message", received);
  }, [project, ready, navigate]);
  return (
    <section className="linked-map">
      <h2>Optional plan and 3D explorer</h2>
      <p>
        Search, filter and select with the list. The optional model uses the
        same geometry and React availability projection. Model positions show
        home geometry, not tracked equipment movement.
      </p>
      {!enabled ? (
        <button className="pbtn" onClick={() => setEnabled(true)}>
          Load the linked map explorer
        </button>
      ) : (
        <>
          <p className="small" role="status">
            {ready
              ? "React projection linked. Select 3D model inside the explorer to load geometry."
              : "Loading the map explorer. The plan and equipment list above remain available."}
          </p>
          <iframe
            ref={frame}
            className="linked-map-frame"
            title="React-linked floor plan and optional 3D lab map"
            src={new URL("lab-map/index.html", window.location.href).href}
          />
          <p className="small">
            If the explorer cannot load, every equipment task works through the
            React list and asset records above.
          </p>
        </>
      )}
    </section>
  );
}
