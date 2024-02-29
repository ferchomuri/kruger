import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  DashboardAdministrator,
  DashboardUser,
  Home,
  Login,
} from "./Pages/index";
import "./index.css";
import { PrivateRoute } from "./bridges/authBridge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "dashboard-administrator",
    element: (
      <PrivateRoute>
        <DashboardAdministrator />
      </PrivateRoute>
    ),
  },
  {
    path: "dashboard-user",
    element: (
      <PrivateRoute>
        <DashboardUser />
      </PrivateRoute>
    ),
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
