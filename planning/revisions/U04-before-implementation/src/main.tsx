import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { App, RouteError } from "./app/App";
import { LabProvider } from "./app/LabProvider";
import { StudentJourney, Today } from "./features/StudentJourney";
import { Operations, WallDisplay } from "./features/Operations";
import { EnvironmentProvider } from "./app/EnvironmentProvider";
import { Dashboard, Environment } from "./features/SmartLab";
import { Conditions } from "./features/Conditions";
import { Faculty, Attendance, Assessment } from "./features/Faculty";
import { Asset, Calibration, LabMap } from "./features/Assets";
import { Bookings, MobileLookup, MobileReport } from "./features/Mobile";
import { Safety } from "./features/Safety";
import "./styles/app.css";

const router = createHashRouter([
  {
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Today /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "environment", element: <Environment /> },
      { path: "faculty", element: <Faculty /> },
      { path: "faculty/attendance", element: <Attendance /> },
      { path: "faculty/assessment", element: <Assessment /> },
      { path: "map", element: <LabMap /> },
      { path: "assets/:asset", element: <Asset /> },
      { path: "assets/:asset/calibration", element: <Calibration /> },
      { path: "mobile", element: <MobileLookup /> },
      { path: "mobile/report", element: <MobileReport /> },
      { path: "bookings", element: <Bookings /> },
      { path: "safety", element: <Safety /> },
      { path: ":exp/conditions", element: <Conditions /> },
      { path: ":exp/:step", element: <StudentJourney /> },
      { path: "tech", element: <Operations /> },
      { path: "wall", element: <WallDisplay /> },
      { path: "*", element: <RouteError /> },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LabProvider>
      <EnvironmentProvider>
        <RouterProvider router={router} />
      </EnvironmentProvider>
    </LabProvider>
  </StrictMode>,
);
