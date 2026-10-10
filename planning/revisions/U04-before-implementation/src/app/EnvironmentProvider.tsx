import { useState, type ReactNode } from "react";
import { EnvironmentContext } from "./environmentContext";
import type { Scenario } from "../domain/observations";
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario>("disconnected");
  return (
    <EnvironmentContext.Provider value={{ scenario, setScenario }}>
      {children}
    </EnvironmentContext.Provider>
  );
}
