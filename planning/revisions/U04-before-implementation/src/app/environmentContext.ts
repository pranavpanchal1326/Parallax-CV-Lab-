import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Scenario } from "../domain/observations";
export const EnvironmentContext = createContext<{
  scenario: Scenario;
  setScenario: Dispatch<SetStateAction<Scenario>>;
} | null>(null);
export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) throw new Error("EnvironmentProvider is required.");
  return context;
}
