import { Alert, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

export default function PrivatePlaceholder({ title }: { title: string }): JSX.Element {
    return (
        <Stack spacing={2}>
        <Typography variant="h4">{title}</Typography>
        <Alert severity="warning">
            Placeholder. El CRUD de este módulo se implementa en las siguientes páginas.
        </Alert>
        </Stack>
    );
}