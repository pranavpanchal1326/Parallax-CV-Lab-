import {
  createContext,
  useContext,
} from "react";
import type { Observation, Scenario } from "../domain/observations";
export const EnvironmentContext = createContext<{
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  observations: Observation[];
  refresh: () => void;
} | null>(null);
export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context) throw new Error("EnvironmentProvider is required.");
  return context;
}
