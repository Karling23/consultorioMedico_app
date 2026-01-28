import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { JSX } from "react";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import StarIcon from "@mui/icons-material/Star";
import SpeedIcon from "@mui/icons-material/Speed";
import TimelineIcon from "@mui/icons-material/Timeline";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function PublicHome(): JSX.Element {
  const theme = useTheme();

  const services = [
    {
      title: "Medicina General",
      desc: "Atención integral para el cuidado de tu salud y la de tu familia.",
      icon: <PeopleIcon fontSize="large" />,
      color: "rgba(59, 130, 246, 0.2)",
    },
    {
      title: "Especialidades",
      desc: "Contamos con expertos en diversas ramas de la medicina.",
      icon: <MedicalServicesIcon fontSize="large" />,
      color: "rgba(168, 85, 247, 0.2)",
    },
    {
      title: "Farmacia",
      desc: "Medicamentos de calidad disponibles para tu tratamiento inmediato.",
      icon: <LocalPharmacyIcon fontSize="large" />,
      color: "rgba(249, 115, 22, 0.2)",
    },
    {
      title: "Agendamiento",
      desc: "Reserva tu cita de manera rápida y sencilla desde nuestra web.",
      icon: <EventAvailableIcon fontSize="large" />,
      color: "rgba(16, 185, 129, 0.2)",
    },
  ];

  const metrics = [
    { label: "Pacientes atendidos", value: "+15,000" },
    { label: "Especialistas", value: "+50" },
    { label: "Satisfacción", value: "99%" },
  ];

  const highlights = [
    {
      title: "Atención Segura",
      desc: "Protocolos estrictos de higiene y seguridad para tu tranquilidad.",
      icon: <VerifiedUserIcon />,
    },
    {
      title: "Diagnósticos Precisos",
      desc: "Tecnología de última generación para diagnósticos certeros.",
      icon: <AutoGraphIcon />,
    },
    {
      title: "Atención 24/7",
      desc: "Servicio de urgencias y atención médica continua.",
      icon: <HeadsetMicIcon />,
    },
  ];

  const testimonials = [
    {
      name: "María Fernández",
      role: "Paciente",
      text: "La atención es excelente, desde la recepción hasta los doctores. Muy recomendados.",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Carlos Ruiz",
      role: "Paciente",
      text: "Precios muy accesibles y un trato humano increíble. Me sentí muy cuidado.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Ana López",
      role: "Paciente",
      text: "Los mejores doctores de la ciudad. Instalaciones modernas y limpias.",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80",
  ];

  const mapLink =
    "https://www.google.com/maps/search/?api=1&query=Western%20UTE%20Av.%20Mariana%20de%20Jes%C3%BAs%2C%20Quito%20170129%2C%20Ecuador";

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "white",
          borderRadius: { xs: 4, md: 6 },
          bgcolor: "#0b1324",
          mb: { xs: 6, md: 10 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", py: { xs: 6, md: 10 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Chip
                  label="Tu salud en las mejores manos"
                  sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", width: "fit-content" }}
                />
                <Typography variant="h2" fontWeight="bold">
                  Cuidamos de ti y tu familia con excelencia médica
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.85 }}>
                  Atención médica integral con especialistas altamente calificados. Tecnología avanzada y trato humano para tu bienestar.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="contained" size="large" component={RouterLink} to="/auth/login">
                    Ingresar al portal
                  </Button>
                </Stack>
                <Stack direction="row" spacing={3}>
                  {metrics.map((item) => (
                    <Box key={item.label}>
                      <Typography variant="h5" fontWeight="bold">
                        {item.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
                  alt="Equipo médico"
                  sx={{ width: "100%", borderRadius: 3, height: 320, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    mt: 3,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
                  {[
                    { label: "Eficiencia", icon: <SpeedIcon /> },
                    { label: "Trazabilidad", icon: <TimelineIcon /> },
                    { label: "Humanización", icon: <FavoriteIcon /> },
                  ].map((item) => (
                    <Paper
                      key={item.label}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.12)",
                        textAlign: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>{item.icon}</Box>
                      <Typography variant="subtitle2">{item.label}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="servicios" sx={{ mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              Nuestros Servicios Médicos
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 680 }}>
              Ofrecemos una amplia gama de servicios de salud diseñados para cubrir todas tus necesidades y las de tu familia.
            </Typography>
          </Stack>
          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid key={service.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Avatar sx={{ width: 64, height: 64, bgcolor: service.color, color: "primary.main", mb: 2 }}>
                    {service.icon}
                  </Avatar>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="planes" sx={{ bgcolor: "rgba(148, 163, 184, 0.12)", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="h3" fontWeight="bold">
                  Instalaciones de Primer Nivel
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Espacios diseñados para tu comodidad y recuperación, equipados con la mejor tecnología médica.
                </Typography>
                <Stack spacing={2}>
                  {highlights.map((item) => (
                    <Paper
                      key={item.title}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        bgcolor: "white",
                      }}
                    >
                      <Avatar sx={{ bgcolor: "primary.main" }}>{item.icon}</Avatar>
                      <Box>
                        <Typography fontWeight="bold">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80"
                    alt="Equipo clínico"
                    sx={{ width: "100%", height: 280, objectFit: "cover" }}
                  />
                </Paper>
                <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80"
                    alt="Tecnología médica"
                    sx={{ width: "100%", height: 240, objectFit: "cover" }}
                  />
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "rgba(15, 23, 42, 0.9)", color: "white", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              Lo que dicen nuestros pacientes
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 680, textAlign: "center" }}>
              Testimonios reales de personas que confían su salud en nosotros.
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {testimonials.map((item) => (
              <Grid key={item.name} size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.08)",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={item.avatar} />
                    <Box>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {item.role}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ mt: 2, opacity: 0.85 }}>{item.text}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={`${item.name}-${index}`} fontSize="small" />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              Galería de instalaciones
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 620 }}>
              Espacios modernos listos para brindar atención de primer nivel.
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {gallery.map((img, index) => (
              <Grid key={`${img}-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component="img"
                  src={img}
                  alt="Galería VitaCare"
                  sx={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="contacto" sx={{ bgcolor: "rgba(148, 163, 184, 0.15)", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Typography variant="h3" fontWeight="bold">
                  Hablemos de tu clínica
                </Typography>
                <Typography color="text.secondary">
                  Nuestro equipo de expertos te acompaña en la implementación, migración y capacitación.
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <LocationOnIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">Sede principal</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Western UTE Av. Mariana de Jesús, Quito 170129, Ecuador
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PhoneIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">Asesoría inmediata</Typography>
                      <Typography variant="body2" color="text.secondary">
                        +593 99311404
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <EmailIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">Correo comercial</Typography>
                      <Typography variant="body2" color="text.secondary">
                        sergio.gomez@ute.edu.ec
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
                <Box
                  component="iframe"
                  src={mapLink}
                  title="Mapa VitaCare"
                  sx={{ width: "100%", height: 360, border: 0 }}
                />
              </Paper>
              <Paper
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Agenda tu cita médica
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cuida tu salud con los mejores especialistas.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
