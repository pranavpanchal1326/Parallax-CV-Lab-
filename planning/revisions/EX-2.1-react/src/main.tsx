import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { App, RouteError } from "./app/App";
import { LabProvider } from "./app/LabProvider";
import { StudentJourney, Today } from "./features/StudentJourney";
import { Operations, WallDisplay } from "./features/Operations";
import "./styles/app.css";

const router = createHashRouter([
  {
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Today /> },
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
      <RouterProvider router={router} />
    </LabProvider>
  </StrictMode>,
);
