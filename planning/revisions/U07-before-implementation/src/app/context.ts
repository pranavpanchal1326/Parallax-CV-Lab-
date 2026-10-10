import { createContext, useContext, type Dispatch } from "react";
import type { Command, DomainResult, LabState } from "../domain/types";

export interface Model {
  state: LabState;
  result: DomainResult | null;
  command: Command["type"] | null;
  sequence: number;
}
export type Action =
  | { type: "command"; command: Command }
  | { type: "reset" }
  | { type: "restore"; state: LabState }
  | { type: "clear-feedback" };
export const StateContext = createContext<Model | null>(null);
export const ActionContext = createContext<Dispatch<Action> | null>(null);
export const PersistenceContext = createContext<{
  warning: string | null;
  saved: boolean;
  canRestore: boolean;
  restore: () => void;
}>({ warning: null, saved: false, canRestore: false, restore: () => {} });
export function useLab() {
  const model = useContext(StateContext);
  if (!model) throw new Error("LabProvider is required.");
  return model;
}
export function useCommands() {
  const dispatch = useContext(ActionContext);
  if (!dispatch) throw new Error("LabProvider is required.");
  return dispatch;
}
export const usePersistence = () => useContext(PersistenceContext);
