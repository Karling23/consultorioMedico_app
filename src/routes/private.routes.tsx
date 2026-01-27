import { type RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import PrivatePlaceholder from "../pages/private/PrivatePlaceholder";
import MedicamentosPage from "../pages/private/MedicamentosPage";
import UsersPage from "../pages/private/UsersPage";
import HistorialClinicoPage from "../pages/private/HistorialClinicoPage";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    children: [
        { index: true, element: <DashboardHome /> },
        { path: "medicamentos", element: <MedicamentosPage /> },
        { path: "historial-clinico", element: <HistorialClinicoPage /> },
        { path: "posts", element: <PrivatePlaceholder title="Posts" /> },
        { path: "users", element: <UsersPage /> },
    ],
};
