import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState, type JSX, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register(): JSX.Element {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        setError(null);
        await register({
            nombre_usuario: nombreUsuario,
            password,
        });
        navigate("/dashboard", { replace: true });
        } catch {
        setError("No se pudo registrar. Revisa los datos o intenta más tarde.");
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 520, mx: "auto" }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <Typography variant="h5">Registro</Typography>

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
            Registrar
            </Button>
        </Stack>
        </Paper>
    );
}
