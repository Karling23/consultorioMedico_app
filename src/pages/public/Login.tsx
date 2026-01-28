import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
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
        <Box
            sx={{
                maxWidth: 1120,
                mx: "auto",
                p: { xs: 2, md: 4 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                gap: 4,
                alignItems: "stretch",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(6, 14, 24, 0.75)",
                    }}
                />
                <Stack spacing={3} sx={{ position: "relative" }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: "rgba(255,255,255,0.14)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <LocalHospitalIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                VitaCare
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Acceso clínico seguro
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography variant="h4" fontWeight="bold">
                        Panel clínico con visión 360°
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.85 }}>
                        Gestiona operaciones críticas con control total, métricas accionables y soporte en tiempo real.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip label="Cumplimiento HIPAA" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }} />
                        <Chip label="Backups automáticos" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }} />
                    </Stack>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
                    <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <VerifiedUserIcon />
                            <Typography variant="body2">Autenticación avanzada y control de roles</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <AutoGraphIcon />
                            <Typography variant="body2">Indicadores en tiempo real para decisiones clínicas</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)" }}>
                <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
                    <Stack spacing={0.5}>
                        <Typography variant="h5">Iniciar sesión</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Acceso exclusivo para equipos clínicos autorizados
                        </Typography>
                    </Stack>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button type="submit" variant="contained" fullWidth size="large">
                        Entrar
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
