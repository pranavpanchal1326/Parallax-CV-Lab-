import {
  createDeskState,
  validDeskState,
  type DeskState,
} from "../domain/operationsDesk";
import type { StoragePort } from "./persistence";
export const operationsKey = "parallax-operations-exercise-v1";
export interface DeskLoad {
  state: DeskState;
  raw: string | null;
  warning: string | null;
  blocked: boolean;
}
export function readDesk(storage: StoragePort | (() => StoragePort)): DeskLoad {
  let raw: string | null = null;
  try {
    const port = typeof storage === "function" ? storage() : storage;
    raw = port.getItem(operationsKey);
    if (raw === null)
      return { state: createDeskState(), raw, warning: null, blocked: false };
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1 || !validDeskState(parsed.state))
      return {
        state: createDeskState(),
        raw,
        warning:
          "The saved operations exercise is unsupported. Its original text is retained; export it before starting another exercise.",
        blocked: true,
      };
    return { state: parsed.state, raw, warning: null, blocked: false };
  } catch {
    return {
      state: createDeskState(),
      raw,
      warning:
        raw === null
          ? "Operations exercise storage could not be read. Use the in-memory exercise and export before leaving."
          : "The saved operations exercise is malformed. Its original text is retained; export it before starting another exercise.",
      blocked: true,
    };
  }
}
export function saveDesk(
  storage: StoragePort,
  state: DeskState,
  expectedRaw: string | null,
) {
  try {
    if (!validDeskState(state))
      return {
        ok: false,
        raw: expectedRaw,
        message:
          "The exercise record could not be verified. Nothing was written.",
      };
    if (storage.getItem(operationsKey) !== expectedRaw)
      return {
        ok: false,
        raw: expectedRaw,
        message:
          "Another tab changed this exercise. Your current version is retained in memory; export both versions before reconciling.",
      };
    if (expectedRaw !== null)
      storage.setItem(
        `${operationsKey}:archive:${new Date().toISOString()}:${state.revision}:${crypto.randomUUID()}`,
        expectedRaw,
      );
    const raw = JSON.stringify({ schemaVersion: 1, state });
    storage.setItem(operationsKey, raw);
    return {
      ok: true,
      raw,
      message:
        "Exercise snapshot saved in this browser. It creates no operational booking or notification.",
    };
  } catch {
    return {
      ok: false,
      raw: expectedRaw,
      message:
        "Exercise storage failed. The current record remains in memory; export before leaving.",
    };
  }
}
