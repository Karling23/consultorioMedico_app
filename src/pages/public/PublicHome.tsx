import { useEffect, useMemo, useState, type JSX } from "react";
import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
    getMedicamentos,
    type MedicamentoDto,
} from "../../services/medicamentos.service";

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

export default function MedicamentosHome(): JSX.Element {
    const [sp, setSp] = useSearchParams();

    const qParam = sp.get("q") || "";
    const pageParam = Number(sp.get("page") || "1");
    const limitParam = Number(sp.get("limit") || "10");

    const [q, setQ] = useState(qParam);
    const debouncedQ = useDebouncedValue(q, 450);

    const [items, setItems] = useState<MedicamentoDto[]>([]);
    const [page, setPage] = useState(
        Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
    );
    const [limit] = useState(
        Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10
    );

    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const queryKey = useMemo(
        () => ({
        search: debouncedQ,
        page,
        limit,
        }),
        [debouncedQ, page, limit]
    );

    useEffect(() => {
        setSp((prev) => {
        const next = new URLSearchParams(prev);
        if (q) next.set("q", q);
        else next.delete("q");
        next.set("page", String(page));
        next.set("limit", String(limit));
        return next;
        });
    }, [q, page, limit, setSp]);

    useEffect(() => {
        (async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getMedicamentos(queryKey);

            setItems(res.items);
            setTotalPages(res.meta.totalPages || 1);
        } catch {
            setError("No se pudieron cargar los medicamentos.");
        } finally {
            setLoading(false);
        }
        })();
    }, [queryKey]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQ]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

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
            Explora nuestro catálogo de medicamentos y gestiona tu consultorio de forma sencilla.
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

        <Typography variant="h5">Medicamentos</Typography>

        <TextField
            label="Buscar medicamento"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            fullWidth
        />

        {items.length === 0 ? (
            <Alert severity="info">No hay resultados.</Alert>
        ) : (
            <>
            {items.map((m) => (
                <Card key={m.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardActionArea
                    component={RouterLink}
                    to={`/medicamentos/${m.id}`}
                    sx={{
                    transition: "all .2s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 3, borderColor: "primary.main" },
                    }}
                >
                    <CardContent>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {m.nombre}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {m.descripcion || "Sin descripción"}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
            ))}

            <Stack direction="row" justifyContent="center" sx={{ py: 1 }}>
                <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                />
            </Stack>
            </>
        )}
        </Stack>
    );
}
