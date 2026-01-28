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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
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
        <Box
            sx={{
                maxWidth: 1120,
                mx: "auto",
                p: { xs: 2, md: 4 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
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
                        "url(https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(7, 18, 30, 0.78)",
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
                                Nuevo acceso clínico
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography variant="h4" fontWeight="bold">
                        Activa tu consultorio en minutos
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.85 }}>
                        Configura tu equipo, integra pacientes y accede a flujos optimizados desde el primer día.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip label="Onboarding guiado" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }} />
                        <Chip label="Soporte dedicado" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }} />
                    </Stack>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
                    <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <VerifiedUserIcon />
                            <Typography variant="body2">Accesos por rol y controles de seguridad</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <AutoGraphIcon />
                            <Typography variant="body2">Reportes automáticos desde la primera semana</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)" }}>
                <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
                    <Stack spacing={0.5}>
                        <Typography variant="h5">Crear cuenta</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Registra tu consultorio y comienza a operar en digital
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

                    <Button type="submit" variant="contained" fullWidth size="large" startIcon={<PersonAddIcon />}>
                        Registrar consultorio
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
