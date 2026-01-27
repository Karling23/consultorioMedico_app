import { Stack, Typography } from "@mui/material";
import type { JSX } from "react";

export default function DashboardHome(): JSX.Element {
    return (
        <Stack spacing={2}>
            <Typography variant="h4">Bienvenido a VitaCare</Typography>
        </Stack>
    );
}
