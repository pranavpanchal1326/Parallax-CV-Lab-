import { lazy, StrictMode, Suspense } from "react";
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

const Rehearsal = lazy(() =>
  import("./features/Rehearsal").then((module) => ({
    default: module.Rehearsal,
  })),
);
const Assistant = lazy(() => import("./features/Assistant").then(module => ({default: module.Assistant})));
const OperationsDesk = lazy(() => import("./features/OperationsDesk").then(module => ({default:module.OperationsDesk})));
const ArtStudio = lazy(() => import("./features/ArtStudio").then(module => ({default:module.ArtStudio})));
const FaultWalkthrough = lazy(() =>
  import("./features/FaultWalkthrough").then((module) => ({
    default: module.FaultWalkthrough,
  })),
);
const GeometryRehearsal = lazy(() =>
  import("./features/GeometryRehearsal").then((module) => ({
    default: module.GeometryRehearsal,
  })),
);
const pending = <p role="status">Loading the local rehearsal…</p>;

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
      { path: "studio", element: <Suspense fallback={<p role="status">Loading the reference studio…</p>}><ArtStudio /></Suspense> },
      { path: "assistant", element: <Suspense fallback={<p role="status">Loading the guide reader…</p>}><Assistant /></Suspense> },
      { path: "operations", element: <Suspense fallback={<p role="status">Loading the operations exercise…</p>}><OperationsDesk /></Suspense> },
      {
        path: "walkthrough",
        element: (
          <Suspense fallback={pending}>
            <FaultWalkthrough />
          </Suspense>
        ),
      },
      {
        path: "scene/rehearsal",
        element: (
          <Suspense fallback={pending}>
            <GeometryRehearsal />
          </Suspense>
        ),
      },
      {
        path: ":exp/rehearsal",
        element: (
          <Suspense fallback={pending}>
            <Rehearsal />
          </Suspense>
        ),
      },
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
