import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    Pagination,
    Paper,
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
import { useEffect, useMemo, useState, type JSX } from "react";
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

    const load = async () => {
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
    };

    useEffect(() => {
        load();
    }, [queryKey]);

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
            return;
        }

        if (!current) return;

        await updateMedicamento(current.id, payload);
        setOpen(false);
        await load();
        } catch {
        setError("No se pudo guardar el medicamento.");
        }
    };

    const onDelete = async (id: string) => {
        try {
        setError(null);
        await deleteMedicamento(id);
        await load();
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
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.map((m) => (
                    <TableRow key={m.id}>
                        <TableCell>{m.nombre}</TableCell>
                        <TableCell>{m.descripcion || "-"}</TableCell>
                        <TableCell align="right">
                        <IconButton onClick={() => onEdit(m)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(m.id)}>
                            <DeleteIcon />
                        </IconButton>
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
        </Stack>
    );
}
