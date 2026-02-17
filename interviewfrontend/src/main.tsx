import { createRoot } from "react-dom/client";
import "./assets/css/Index.css";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

import App from "./App.tsx";
import Index from "./pages/interview/Index.tsx";
import AuthControll from "./pages/auth/AuthControll.tsx";

const rootRoute = createRootRoute();

const routes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: App,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/interview",
    component: Index,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth",
    component: AuthControll,
  }),
];

const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
