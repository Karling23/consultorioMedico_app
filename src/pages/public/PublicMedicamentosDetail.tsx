import { useEffect, useState, type JSX } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
    getMedicamentoById,
    type MedicamentoDto,
} from "../../services/medicamentos.service";

export default function MedicamentoPublicDetail(): JSX.Element {
    const { id } = useParams();
    const [medicamento, setMedicamento] = useState<MedicamentoDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
        try {
            if (!id) throw new Error("missing id");
            setLoading(true);
            setError(null);

            const data = await getMedicamentoById(id);
            setMedicamento(data);
        } catch {
            setError("No se pudo cargar el detalle del medicamento.");
        } finally {
            setLoading(false);
        }
        })();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    if (!medicamento)
        return (
        <Stack spacing={2}>
            <Typography variant="h5">Medicamento no encontrado</Typography>
            <Button variant="contained" component={RouterLink} to="/medicamentos">
            Volver al listado
            </Button>
        </Stack>
        );

    return (
        <Stack spacing={2}>
        <Button
            variant="outlined"
            component={RouterLink}
            to="/medicamentos"
            sx={{ width: "fit-content" }}
        >
            ← Volver
        </Button>

        <Typography variant="h4">{medicamento.nombre}</Typography>

        <Box sx={{ whiteSpace: "pre-wrap" }}>
            <Typography variant="body1" color="text.secondary">
            {medicamento.descripcion || "Sin descripción"}
            </Typography>
        </Box>

        {medicamento.createdAt && (
            <Typography variant="caption" color="text.secondary">
            Creado el {new Date(medicamento.createdAt).toLocaleDateString()}
            </Typography>
        )}
        </Stack>
    );
}
