import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { JSX } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome(): JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  const stats = [
    { label: "Pacientes Activos", value: "1,234", icon: <PeopleIcon />, color: theme.palette.primary.main },
    { label: "Citas Hoy", value: "42", icon: <EventIcon />, color: theme.palette.secondary.main },
    { label: "Recetas Emitidas", value: "89", icon: <ReceiptLongIcon />, color: "#e76f51" },
    { label: "Disponibilidad", value: "98%", icon: <TrendingUpIcon />, color: "#2a9d8f" },
  ];

  const quickActions = [
    { label: "Doctores", desc: "Gestión de personal médico", icon: <PeopleIcon fontSize="large" />, to: "/dashboard/doctores", color: "primary.light" },
    { label: "Citas Médicas", desc: "Agenda y programación", icon: <EventIcon fontSize="large" />, to: "/dashboard/citas-medicas", color: "secondary.light" },
    { label: "Pacientes", desc: "Historial y datos", icon: <PeopleIcon fontSize="large" />, to: "/dashboard/pacientes", color: "info.light" },
    { label: "Recetas", desc: "Emisión y consulta", icon: <ReceiptLongIcon fontSize="large" />, to: "/dashboard/recetas", color: "success.light" },
    { label: "Consultorios", desc: "Administración de espacios", icon: <MeetingRoomIcon fontSize="large" />, to: "/dashboard/consultorios", color: "warning.light" },
    { label: "Especialidades", desc: "Catálogo de servicios", icon: <LocalHospitalIcon fontSize="large" />, to: "/dashboard/especialidades", color: "error.light" },
  ];

  return (
    <Stack spacing={4}>
      {/* Hero Welcome */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ¡Hola, {user?.username || "Doctor"}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, mb: 3 }}>
            Bienvenido a tu panel de control VitaCare. Aquí tienes un resumen de la actividad de hoy y accesos rápidos a las funciones más importantes.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: "white", 
              color: "primary.main",
              fontWeight: "bold",
              "&:hover": { bgcolor: "grey.100" } 
            }}
            onClick={() => navigate("/dashboard/citas-medicas")}
          >
            Ver Agenda de Hoy
          </Button>
        </Box>
        {/* Abstract Background Decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            right: 100,
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
            zIndex: 0
          }}
        />
      </Paper>

      {/* KPI Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 3,
        }}
      >
        {stats.map((stat, index) => (
          <Paper
            key={index}
            elevation={0}
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {stat.value}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 56, height: 56 }}>
              {stat.icon}
            </Avatar>
          </Paper>
        ))}
      </Box>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
        Accesos Rápidos
      </Typography>

      {/* Quick Actions Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {quickActions.map((action, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              borderRadius: 3,
              height: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
                borderColor: "primary.main",
              },
            }}
          >
            <CardActionArea onClick={() => navigate(action.to)} sx={{ height: "100%", p: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: action.color,
                      color: "primary.contrastText",
                      width: 56,
                      height: 56,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {action.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {action.desc}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Recent Activity Section (Mock) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Actividad Reciente
            </Typography>
            <Button size="small">Ver todo</Button>
          </Stack>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  "&:hover": { bgcolor: "grey.50", borderRadius: 2 },
                }}
              >
                <Avatar sx={{ bgcolor: "grey.100", color: "grey.600" }}>
                  <AccessTimeIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Nueva Cita Agendada
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Paciente: Juan Pérez - Hace {i * 15} min
                  </Typography>
                </Box>
                <Button size="small" variant="text">
                  Ver
                </Button>
              </Box>
            ))}
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            bgcolor: "primary.dark",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Soporte Técnico
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
            ¿Necesitas ayuda con la plataforma? Contacta a nuestro equipo de soporte disponible 24/7.
          </Typography>
          <Button variant="contained" color="secondary" fullWidth>
            Contactar Soporte
          </Button>
        </Paper>
      </Box>
    </Stack>
  );
}
