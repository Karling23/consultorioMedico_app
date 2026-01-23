import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";

type LocationState = { from?: string };

export default function Login(): JSX.Element {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state || {}) as LocationState;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        setError(null);
        await login({
            nombre_usuario: nombreUsuario,
            password,
        });
        navigate(state.from || "/dashboard", { replace: true });
        } catch {
        setError("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 420, mx: "auto" }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <Typography variant="h5">Iniciar sesión</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
            label="Usuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
            autoFocus
            />

            <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <Button type="submit" variant="contained" fullWidth>
            Entrar
            </Button>
        </Stack>
        </Paper>
    );
}
