import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import { Link as RouterLink } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function PublicFooter(): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        bgcolor: "#0B1420",
        color: "white",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1.2fr 1.4fr" },
            gap: 4,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocalHospitalIcon />
              </Box>
              <Typography variant="h6" fontWeight="bold">
                VitaCare
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              La suite médica para clínicas modernas. Automatiza procesos, conecta pacientes y aumenta tu
              productividad con una experiencia premium.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                color="inherit"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
              >
                <XIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Producto
            </Typography>
            <Button
              component={RouterLink}
              to="/#servicios"
              color="inherit"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Servicios
            </Button>
            <Button
              component={RouterLink}
              to="/#planes"
              color="inherit"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Planes y precios
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Contacto
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Western UTE Av. Mariana de Jesús, Quito 170129, Ecuador
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon fontSize="small" />
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                +593 99311404
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon fontSize="small" />
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                sergio.gomez@ute.edu.ec
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Recibe tendencias de salud digital y mejoras para tu consultorio.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                placeholder="Tu correo"
                size="small"
                fullWidth
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderRadius: 1,
                  input: { color: "white" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                }}
              />
              <Button variant="contained" sx={{ textTransform: "none" }}>
                Suscribirme
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2026 VitaCare. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" sx={{ textTransform: "none" }}>
              Privacidad
            </Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>
              Términos
            </Button>
            <Button color="inherit" sx={{ textTransform: "none" }}>
              Seguridad
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
