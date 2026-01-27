import { type RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PublicHome from "../pages/public/PublicHome";
import PublicMedicamentoDetail from "../pages/public/PublicMedicamentosDetail";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

export const publicRoutes: RouteObject = {
    path: "/",
    element: <PublicLayout />,
    children: [
        { index: true, element: <PublicHome /> },
        { path: "medicamentos/:id", element: <PublicMedicamentoDetail /> },
        { path: "auth/login", element: <Login /> },
        { path: "auth/register", element: <Register /> },
    ],
};
