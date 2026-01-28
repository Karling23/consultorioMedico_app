import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { JSX } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";

export default function PublicHeader(): JSX.Element {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(8, 16, 28, 0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
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
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                VitaCare
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                Clínica inteligente
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ ml: 3, display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" component={RouterLink} to="/" sx={{ textTransform: "none" }}>
              Inicio
            </Button>
            <Button color="inherit" component={RouterLink} to="/#servicios" sx={{ textTransform: "none" }}>
              Servicios
            </Button>
            <Button color="inherit" component={RouterLink} to="/#planes" sx={{ textTransform: "none" }}>
              Planes
            </Button>
            <Button color="inherit" component={RouterLink} to="/#contacto" sx={{ textTransform: "none" }}>
              Contacto
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", lg: "flex" } }}>
              <IconButton
                size="small"
                color="inherit"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                component="a"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
              >
                <XIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Button
              color="inherit"
              component={RouterLink}
              to="/auth/login"
              sx={{ textTransform: "none", borderColor: "rgba(255,255,255,0.3)" }}
              variant="outlined"
            >
              Acceder
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/auth/register"
              sx={{ textTransform: "none", borderColor: "rgba(255,255,255,0.3)" }}
              variant="outlined"
            >
              Registrar
            </Button>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
