import { type RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import PrivatePlaceholder from "../pages/private/PrivatePlaceholder";
import MedicamentosPage from "../pages/private/MedicamentosPage";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    children: [
        { index: true, element: <DashboardHome /> },
        { path: "medicamentos", element: <MedicamentosPage /> },
        { path: "posts", element: <PrivatePlaceholder title="Posts" /> },
        { path: "users", element: <PrivatePlaceholder title="Users" /> },
    ],
};