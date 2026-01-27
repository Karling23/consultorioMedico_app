import {
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { JSX } from "react";

export default function PublicHome(): JSX.Element {

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
                    Bienvenido a VitaCare
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Explora nuestro cat�logo de medicamentos y gestiona tu consultorio de forma sencilla.
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" component={RouterLink} to="/auth/login">
                        Ingresar
                    </Button>
                    <Button variant="text" component={RouterLink} to="/auth/register">
                        Crear cuenta
                    </Button>
                </Stack>
            </Paper>
            
        </Stack>
    );
}