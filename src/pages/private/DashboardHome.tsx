import { Avatar, Box, Button, Card, CardActionArea, CardContent, Paper, Stack, Typography } from "@mui/material";
import type { JSX } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PeopleIcon from "@mui/icons-material/People";
import LinkIcon from "@mui/icons-material/Link";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";

export default function DashboardHome(): JSX.Element {
  const navigate = useNavigate();
  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 3,
          background:
            "linear-gradient(90deg, rgba(42,157,143,0.08) 0%, rgba(38,70,83,0.06) 100%)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido al panel del consultorio
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Gestiona medicamentos, especialidades, doctores, asignaciones y recetas desde un
          solo lugar.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<CategoryIcon />}
            onClick={() => navigate("/dashboard/medicamentos")}
          >
            Ver Medicamentos
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocalHospitalIcon />}
            onClick={() => navigate("/dashboard/especialidades")}
          >
            Ver Especialidades
          </Button>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardActionArea
            onClick={() => navigate("/dashboard/doctores")}
            sx={{
              transition: "all .2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "primary.main" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <PeopleIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">Doctores</Typography>
                  <Typography color="text.secondary">Disponibilidad y gestión rápida</Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardActionArea
            onClick={() => navigate("/dashboard/especialidades")}
            sx={{
              transition: "all .2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "primary.main" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <LocalHospitalIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">Especialidades</Typography>
                  <Typography color="text.secondary">Catálogo y descripción</Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardActionArea
            onClick={() => navigate("/dashboard/doctores-consultorios")}
            sx={{
              transition: "all .2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "primary.main" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <LinkIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">Asignaciones</Typography>
                  <Typography color="text.secondary">Doctor ↔ Consultorio</Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardActionArea
            onClick={() => navigate("/dashboard/recetas")}
            sx={{
              transition: "all .2s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "primary.main" },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <ReceiptLongIcon color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">Recetas</Typography>
                  <Typography color="text.secondary">Registro y control</Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" startIcon={<CategoryIcon />} onClick={() => navigate("/dashboard/medicamentos")}>
            Ir a Medicamentos
          </Button>
          <Button variant="outlined" startIcon={<ReceiptLongIcon />} onClick={() => navigate("/dashboard/recetas")}>
            Ir a Recetas
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
    return (
        <Stack spacing={2}>
            <Typography variant="h4">Bienvenido a VitaCare</Typography>
        </Stack>
    );
}
