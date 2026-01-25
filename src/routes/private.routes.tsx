import { type RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import PrivatePlaceholder from "../pages/private/PrivatePlaceholder";
import MedicamentosPage from "../pages/private/MedicamentosPage";
import CitasMedicasPage from "../pages/private/CitasMedicasPage";
import PacientesPage from "../pages/private/PacientesPage";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    children: [
        { index: true, element: <DashboardHome /> },
        { path: "medicamentos", element: <MedicamentosPage /> },
        { path: "posts", element: <PrivatePlaceholder title="Posts" /> },
        { path: "users", element: <PrivatePlaceholder title="Users" /> },
        { path: "citas-medicas", element: <CitasMedicasPage /> },
        { path: "pacientes",  element: <PacientesPage /> },
    ],
};