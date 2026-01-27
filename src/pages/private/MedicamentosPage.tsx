import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
    Pagination,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import MedicamentoFormDialog from "../../components/medicamentos/MedicamentosFormDialog";
import {
    type MedicamentoDto,
    createMedicamento,
    deleteMedicamento,
    getMedicamentos,
    updateMedicamento,
} from "../../services/medicamentos.service";

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

export default function MedicamentosPage(): JSX.Element {
    const [sp, setSp] = useSearchParams();

    const pageParam = Number(sp.get("page") || "1");
    const limitParam = Number(sp.get("limit") || "10");
    const searchParam = sp.get("search") || "";

    const [page, setPage] = useState(pageParam > 0 ? pageParam : 1);
    const [limit] = useState(limitParam > 0 ? limitParam : 10);

    const [search, setSearch] = useState(searchParam);
    const debouncedSearch = useDebouncedValue(search, 450);

    const [items, setItems] = useState<MedicamentoDto[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [current, setCurrent] = useState<MedicamentoDto | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const queryKey = useMemo(
        () => ({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        searchField: debouncedSearch.trim() ? "nombre" : undefined,
        sort: "nombre",
        order: "ASC" as const,
        }),
        [page, limit, debouncedSearch]
    );

    useEffect(() => {
        setSp((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        next.set("limit", String(limit));
        if (search) next.set("search", search);
        else next.delete("search");
        return next;
        });
    }, [page, limit, search, setSp]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const load = useCallback(async () => {
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
    }, [queryKey]);

    useEffect(() => {
        load();
    }, [load]);

    const onCreate = () => {
        setMode("create");
        setCurrent(null);
        setOpen(true);
    };

    const onEdit = (m: MedicamentoDto) => {
        setMode("edit");
        setCurrent(m);
        setOpen(true);
    };

    const onSubmit = async (payload: {
        nombre: string;
        descripcion?: string;
    }) => {
        try {
        setError(null);

        if (mode === "create") {
            await createMedicamento(payload);
            setOpen(false);
            setPage(1);
            await load();
            setSnackbarMsg("Medicamento creado");
            setSnackbarOpen(true);
            return;
        }

        if (!current) return;

        await updateMedicamento(current.id, payload);
        setOpen(false);
        await load();
        setSnackbarMsg("Medicamento actualizado");
        setSnackbarOpen(true);
        } catch {
        setError("No se pudo guardar el medicamento.");
        }
    };

    const onDelete = async (id: string) => {
        try {
        setError(null);
        await deleteMedicamento(id);
        await load();
        setSnackbarMsg("Medicamento eliminado");
        setSnackbarOpen(true);
        } catch {
        setError("No se pudo eliminar el medicamento.");
        }
    };

    return (
        <Stack spacing={2}>
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ sm: "center" }}
        >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Medicamentos
            </Typography>

            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
            Nuevo
            </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
            label="Buscar (por nombre)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
        />

        {loading ? (
            <CircularProgress />
        ) : items.length === 0 ? (
            <Alert severity="info">No hay medicamentos para mostrar.</Alert>
        ) : (
            <>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small" sx={{ "& tbody tr:hover": { bgcolor: "action.hover" } }}>
                <TableHead sx={{ bgcolor: "grey.100" }}>
                    <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.map((m) => (
                    <TableRow key={m.id}>
                        <TableCell>{m.nombre}</TableCell>
                        <TableCell>{m.descripcion || "-"}</TableCell>
                        <TableCell align="right">
                        <Tooltip title="Editar">
                            <IconButton onClick={() => onEdit(m)} color="primary">
                            <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton onClick={() => onDelete(m.id)} color="error">
                            <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="center" sx={{ py: 1 }}>
                <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                />
            </Stack>
            </>
        )}

        <MedicamentoFormDialog
            open={open}
            mode={mode}
            initial={current}
            onClose={() => setOpen(false)}
            onSubmit={onSubmit}
        />
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMsg}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
        </Stack>
    );
}
