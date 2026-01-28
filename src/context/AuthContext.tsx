import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginApi, registerApi } from "../services/auth.service";
import { decodeJwt, isJwtExpired } from "../utils/jwt";
import { api } from "../services/api";

type User = {
    id: number;
    username: string;
    rol: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (payload: { nombre_usuario: string; password: string }) => Promise<void>;
    register: (payload: { nombre_usuario: string; password: string }) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const getStoredToken = () => {
        const rawToken = localStorage.getItem("auth_token");
        if (!rawToken) return null;
        if (isJwtExpired(rawToken)) {
            localStorage.removeItem("auth_token");
            return null;
        }
        return rawToken;
    };

    const [token, setToken] = useState<string | null>(() => getStoredToken());

    const [user, setUser] = useState<User | null>(() => {
        const rawToken = getStoredToken();
        if (!rawToken) return null;

        const payload = decodeJwt(rawToken);
        if (!payload) return null;

        return {
        id: payload.id,
        username: payload.username,
        rol: payload.rol,
        };
    });

    const login = async (payload: {
        nombre_usuario: string;
        password: string;
    }) => {
        const token = await loginApi(payload);
        if (!token) throw new Error("Credenciales incorrectas");

        const decoded = decodeJwt(token);
        if (!decoded) throw new Error("Token inválido");

        setToken(token);
        setUser({
        id: decoded.id,
        username: decoded.username,
        rol: decoded.rol,
        });

        localStorage.setItem("auth_token", token);
    };

        const register = async (payload: {
        nombre_usuario: string;
        password: string;
        }) => {
        const token = await registerApi(payload);

        const decoded = decodeJwt(token);
        if (!decoded) throw new Error("Token inválido");

        setToken(token);
        setUser({
            id: decoded.id,
            username: decoded.username,
            rol: decoded.rol,
        });

        localStorage.setItem("auth_token", token);
        };

    useEffect(() => {
        if (token) {
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common.Authorization;
        }
    }, [token]);


    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
    };

    const value = useMemo(
        () => ({
        user,
        token,
        login,
        register,
        logout,
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}
