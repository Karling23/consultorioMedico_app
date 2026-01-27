import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { JSX } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function PublicHeader(): JSX.Element {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, rgba(25,118,210,1) 0%, rgba(2,136,209,1) 100%)",
      }}
    >
      <Toolbar>
        <Box
  sx={{
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
  }}
>
  <Box display="flex" alignItems="center" gap={2}>
    <LocalHospitalIcon fontSize="large" />
    <Typography variant="h6">VitaCare</Typography>
  </Box>
</Box>


        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" component={RouterLink} to="/">
          Inicio
        </Button>

        <Button color="inherit" component={RouterLink} to="/auth/login">
          Ingresar
        </Button>

        <Button color="inherit" component={RouterLink} to="/auth/register">
          Registro
        </Button>
      </Toolbar>
    </AppBar>
  );
}
