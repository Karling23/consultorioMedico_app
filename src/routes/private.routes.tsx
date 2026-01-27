import { type RouteObject } from "react-router-dom";
import DashboardHome from "../pages/private/DashboardHome";
import PrivatePlaceholder from "../pages/private/PrivatePlaceholder";
import MedicamentosPage from "../pages/private/MedicamentosPage";
import DoctoresPage from "../pages/private/DoctoresPage";
import EspecialidadesPage from "../pages/private/EspecialidadesPage";
import DoctoresConsultoriosPage from "../pages/private/DoctoresConsultoriosPage";
import RecetasPage from "../pages/private/RecetasPage";

export const privateRoutes: RouteObject = {
    path: "/dashboard",
    children: [
        { index: true, element: <DashboardHome /> },
        { path: "medicamentos", element: <MedicamentosPage /> },
        { path: "posts", element: <PrivatePlaceholder title="Posts" /> },
        { path: "users", element: <PrivatePlaceholder title="Users" /> },
        { path: "doctores", element: <DoctoresPage /> },
        { path: "especialidades", element: <EspecialidadesPage /> },
        { path: "doctores-consultorios", element: <DoctoresConsultoriosPage /> },
        { path: "recetas", element: <RecetasPage /> },
    ],
};
