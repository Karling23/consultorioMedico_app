import { Alert, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

export default function DashboardHome(): JSX.Element {
    return (
        <Stack spacing={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Alert severity="info">
            Este dashboard está vacío. En la siguiente página se agrega el menú lateral (Drawer).
        </Alert>
        </Stack>
    );
}