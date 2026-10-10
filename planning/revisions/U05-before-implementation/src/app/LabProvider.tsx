import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { initialState } from "../domain/adapter";
import {
  readState,
  writeState,
  readRecovery,
  retainBeforeReset,
} from "../data/persistence";
import {
  ActionContext,
  StateContext,
  PersistenceContext,
  type Action,
} from "./context";
import { labReducer } from "./model";

export function LabProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => {
    try {
      return readState(window.localStorage);
    } catch {
      return {
        state: initialState(),
        warning:
          "Browser storage is unavailable. Work is retained only in this tab.",
      };
    }
  });
  const [model, dispatch] = useReducer(labReducer, {
    state: loaded.state,
    result: null,
    command: null,
    sequence: 0,
  });
  const [persistence, setPersistence] = useState({
    warning: loaded.warning,
    saved: false,
  });
  const blocked = useRef(!!loaded.warning);
  const current = useRef(model.state);
  current.current = model.state;
  const [recovery, setRecovery] = useState(() => {
    try {
      return readRecovery(window.localStorage);
    } catch {
      return null;
    }
  });
  const sendAction = useCallback((action: Action) => {
    if (action.type === "reset") {
      let warning: string | null;
      try {
        warning = retainBeforeReset(
          window.localStorage,
          current.current,
          new Date().toISOString(),
        );
      } catch {
        warning =
          "Reset was not performed. Storage is unavailable; export your current work first.";
      }
      if (warning) {
        setPersistence((p) => ({ ...p, warning }));
        return;
      }
      setRecovery(structuredClone(current.current));
      blocked.current = false;
      setPersistence({ warning: null, saved: false });
    }
    dispatch(action);
  }, []);
  const restore = () => {
    if (!recovery) return;
    let warning: string | null;
    try {
      warning = retainBeforeReset(
        window.localStorage,
        current.current,
        `restore-${new Date().toISOString()}`,
      );
    } catch {
      warning =
        "Restore was not performed. Export your current work first; storage is unavailable.";
    }
    if (warning) {
      setPersistence((p) => ({ ...p, warning }));
      return;
    }
    const target = recovery;
    setRecovery(structuredClone(current.current));
    blocked.current = false;
    dispatch({ type: "restore", state: target });
  };
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== "parallax-react-state-v1") return;
      blocked.current = true;
      setPersistence({
        warning:
          "Another tab changed the React record. This tab has stopped saving. Export this session before reloading or start a fresh example explicitly.",
        saved: false,
      });
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  useEffect(() => {
    // Do not overwrite a rejected or unreadable record during hydration or ordinary actions.
    if (blocked.current) return;
    try {
      const warning = writeState(window.localStorage, model.state);
      setPersistence({ warning, saved: !warning });
    } catch {
      setPersistence({
        warning:
          "Browser storage is unavailable. Work is retained only in this tab.",
        saved: false,
      });
    }
  }, [model.state]);
  return (
    <ActionContext.Provider value={sendAction}>
      <StateContext.Provider value={model}>
        <PersistenceContext.Provider
          value={{ ...persistence, canRestore: !!recovery, restore }}
        >
          {children}
        </PersistenceContext.Provider>
      </StateContext.Provider>
    </ActionContext.Provider>
  );
}
