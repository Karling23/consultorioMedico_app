import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth(
    { children }: { children: JSX.Element }
): JSX.Element {
    const { user, token } = useAuth();
    const location = useLocation();

    if (!user || !token) {
        return (
        <Navigate
            to="/auth/login"
            replace
            state={{ from: location.pathname }}
        />
        );
    }

    return children;
}
