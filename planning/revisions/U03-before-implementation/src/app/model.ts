import { initialState, transition } from "../domain/adapter";
import type { Action, Model } from "./context";

export function labReducer(model: Model, action: Action): Model {
  if (action.type === "clear-feedback")
    return { ...model, result: null, command: null };
  if (action.type === "reset")
    return {
      state: initialState(),
      result: null,
      command: null,
      sequence: model.sequence + 1,
    };
  return {
    ...transition(model.state, action.command),
    command: action.command.type,
    sequence: model.sequence + 1,
  };
}
