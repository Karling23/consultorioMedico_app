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
import { useEffect, useMemo, useState, type JSX } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCitasMedicas, type CitaMedicaDto } from "../../services/citas-medicas.service";
import { getPacientes } from "../../services/pacientes.service";
import { getRecetas } from "../../services/recetas.service";
import { getMedicamentos } from "../../services/medicamentos.service";

type CitasPage<T> = { items: T[]; meta: { totalPages?: number } };

async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<CitasPage<T>>
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  const limit = 100;
  while (true) {
    const res = await fetchPage(page, limit);
    items.push(...res.items);
    const totalPages = res.meta.totalPages ?? 1;
    if (page >= totalPages || res.items.length < limit) break;
    page += 1;
  }
  return items;
}

export default function DashboardHome(): JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const role = (user?.rol || "").toLowerCase();
  const isAdmin = role === "admin";
  const isUser = role === "usuario" || role === "paciente";

  const [citas, setCitas] = useState<CitaMedicaDto[]>([]);
  const [citasLoading, setCitasLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsCounts, setStatsCounts] = useState({
    pacientes: 0,
    citas: 0,
    recetas: 0,
  });
  const [adminActivity, setAdminActivity] = useState<
    { id: string; title: string; subtitle: string; timeMs: number }[]
  >([]);

  useEffect(() => {
    let active = true;
    const loadCitas = async () => {
      setCitasLoading(true);
      try {
        const all = await fetchAllPages((page, limit) => getCitasMedicas({ page, limit }));
        if (active) setCitas(all);
      } catch {
        if (active) setCitas([]);
      } finally {
        if (active) setCitasLoading(false);
      }
    };
    loadCitas();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const [pacientesRes, citasRes, recetasRes, medicamentosRes] = await Promise.all([
          getPacientes({ page: 1, limit: 5 }),
          getCitasMedicas({ page: 1, limit: 5 }),
          getRecetas({ page: 1, limit: 5 }),
          getMedicamentos({ page: 1, limit: 5, sort: "createdAt", order: "DESC" }),
        ]);
        if (!active) return;
        setStatsCounts({
          pacientes: pacientesRes.meta.totalItems || pacientesRes.items.length || 0,
          citas: citasRes.meta.totalItems || citasRes.items.length || 0,
          recetas: recetasRes.meta.totalItems || recetasRes.items.length || 0,
        });

        const meds = medicamentosRes.items.map((m) => ({
          id: `med-${m.id}`,
          title: "Medicamento registrado",
          subtitle: m.nombre,
          timeMs: m.createdAt ? Date.parse(m.createdAt) : 0,
        }));
        const citas = citasRes.items.map((c) => ({
          id: `cita-${c.id_cita}`,
          title: "Cita generada",
          subtitle: `Paciente ${c.id_paciente} - ${c.fecha_cita} ${c.hora_cita} - ${c.estado}`,
          timeMs: c.fecha_creacion
            ? Date.parse(c.fecha_creacion)
            : Date.parse(`${c.fecha_cita}T${c.hora_cita || "00:00"}:00`),
        }));
        const recetas = recetasRes.items.map((r) => ({
          id: `receta-${r.id_receta}`,
          title: "Receta emitida",
          subtitle: `#${r.id_receta} - ${r.fecha_emision || "sin fecha"}`,
          timeMs: r.fecha_emision ? Date.parse(r.fecha_emision) : 0,
        }));
        const pacientes = pacientesRes.items.map((p) => ({
          id: `paciente-${p.id_paciente}`,
          title: "Paciente registrado",
          subtitle: `#${p.id_paciente} - ${p.cedula}`,
          timeMs: 0,
        }));

        const combined = [...meds, ...citas, ...recetas, ...pacientes]
          .sort((a, b) => b.timeMs - a.timeMs)
          .slice(0, 6);
        setAdminActivity(combined);
      } catch {
        if (active) {
          setStatsCounts({ pacientes: 0, citas: 0, recetas: 0 });
          setAdminActivity([]);
        }
      } finally {
        if (active) setStatsLoading(false);
      }
    };
    loadStats();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const citasHoy = useMemo(
    () => citas.filter((c) => (c.fecha_cita || "").slice(0, 10) === todayIso).length,
    [citas, todayIso]
  );
  const recentCitas = useMemo(() => {
    const toDate = (c: CitaMedicaDto) => {
      const base = c.fecha_cita ? `${c.fecha_cita}T${c.hora_cita || "00:00"}:00` : "";
      const created = c.fecha_creacion ? c.fecha_creacion : base;
      const parsed = Date.parse(created);
      return Number.isNaN(parsed) ? 0 : parsed;
    };
    return [...citas].sort((a, b) => toDate(b) - toDate(a)).slice(0, 6);
  }, [citas]);

  const stats = [
    { label: "Pacientes registrados", value: statsCounts.pacientes, icon: <PeopleIcon />, color: theme.palette.primary.main },
    { label: "Citas generadas", value: statsCounts.citas, icon: <EventIcon />, color: theme.palette.secondary.main },
    { label: "Recetas emitidas", value: statsCounts.recetas, icon: <ReceiptLongIcon />, color: "#e76f51" },
  ];

  const adminQuickActions = [
    { label: "Doctores", desc: "Gestión de personal médico", icon: <PeopleIcon fontSize="large" />, to: "/dashboard/doctores", color: "primary.light" },
    { label: "Citas Médicas", desc: "Agenda y programación", icon: <EventIcon fontSize="large" />, to: "/dashboard/citas-medicas", color: "secondary.light" },
    { label: "Pacientes", desc: "Historial y datos", icon: <PeopleIcon fontSize="large" />, to: "/dashboard/pacientes", color: "info.light" },
    { label: "Recetas", desc: "Emisión y consulta", icon: <ReceiptLongIcon fontSize="large" />, to: "/dashboard/recetas", color: "success.light" },
    { label: "Consultorios", desc: "Administración de espacios", icon: <MeetingRoomIcon fontSize="large" />, to: "/dashboard/consultorios", color: "warning.light" },
    { label: "Especialidades", desc: "Catálogo de servicios", icon: <LocalHospitalIcon fontSize="large" />, to: "/dashboard/especialidades", color: "error.light" },
  ];
  const userQuickActions = [
    { label: "Medicamentos", desc: "Catalogo de medicamentos", icon: <CategoryIcon fontSize="large" />, to: "/dashboard/medicamentos", color: "primary.light" },
    { label: "Citas Médicas", desc: "Agenda y programación", icon: <EventIcon fontSize="large" />, to: "/dashboard/citas-medicas", color: "secondary.light" },
    { label: "Recetas", desc: "Emisión y consulta", icon: <ReceiptLongIcon fontSize="large" />, to: "/dashboard/recetas", color: "success.light" },
  ];
  const quickActions = isUser ? userQuickActions : adminQuickActions;

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
            {isUser ? "Ver proximas citas medicas" : "Ver Agenda de Hoy"}
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
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {isAdmin ? (
          stats.map((stat, index) => (
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
                width: "100%",
                maxWidth: 360,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {statsLoading ? "..." : String(stat.value)}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
            </Paper>
          ))
        ) : (
          <Paper
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
                Citas Hoy
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                {citasLoading ? "..." : String(citasHoy)}
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: `${theme.palette.secondary.main}20`,
                color: theme.palette.secondary.main,
                width: 56,
                height: 56,
              }}
            >
              <EventIcon />
            </Avatar>
          </Paper>
        )}
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
            {isAdmin ? (
              adminActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay actividad reciente.
                </Typography>
              ) : (
                adminActivity.map((item) => (
                  <Box
                    key={item.id}
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
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.subtitle}
                      </Typography>
                    </Box>
                    <Button size="small" variant="text">
                      Ver
                    </Button>
                  </Box>
                ))
              )
            ) : recentCitas.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay citas registradas.
              </Typography>
            ) : (
              recentCitas.map((cita) => (
                <Box
                  key={cita.id_cita}
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
                      Cita Generada
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paciente {cita.id_paciente} - {cita.fecha_cita} {cita.hora_cita} - {cita.estado}
                    </Typography>
                  </Box>
                  <Button size="small" variant="text" onClick={() => navigate("/dashboard/citas-medicas")}>
                    Ver
                  </Button>
                </Box>
              ))
            )}
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
