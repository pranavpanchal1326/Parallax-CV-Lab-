import { useState, type ReactNode } from "react";
import { EnvironmentContext } from "./environmentContext";
import { exampleTime, scenarioObservations, type Scenario } from "../domain/observations";
import { useLab } from "./context";
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const { state } = useLab();
  const [scenario, selectScenario] = useState<Scenario>("fresh");
  const [observations, setObservations] = useState(() => scenarioObservations("fresh", exampleTime(state.minute)));
  const setScenario = (next: Scenario) => {
    selectScenario(next);
    setObservations(scenarioObservations(next, exampleTime(state.minute)));
  };
  return (
    <EnvironmentContext.Provider value={{ scenario, setScenario, observations, refresh: () => setScenario("fresh") }}>
      {children}
    </EnvironmentContext.Provider>
  );
}
