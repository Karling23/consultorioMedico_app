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

import { useAuth } from "../../context/AuthContext";
import HistorialClinicoFormDialog from "../../components/historial-clinico/HistorialClinicoFormDialog";
import {
    createHistorialClinico,
    deleteHistorialClinico,
    getHistorialClinico,
    type HistorialClinicoDto,
    updateHistorialClinico,
} from "../../services/historial-clinico.service";
import { getPacientes } from "../../services/pacientes.service";
import { api } from "../../services/api";

type CitaDto = {
    id_cita: number;
    id_paciente: number;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

async function fetchAllPages<T>(
    fetchPage: (page: number, limit: number) => Promise<{ items: T[]; meta: { totalPages?: number } }>
): Promise<T[]> {
    const items: T[] = [];
    let page = 1;
    const limit = 100;
    while (true) {
        const res = await fetchPage(page, limit);
        items.push(...res.items);
        const totalPages = res.meta.totalPages ?? 1;
        if (page >= totalPages || res.items.length < limit) break;
        page += 1;
    }
    return items;
}

export default function HistorialClinicoPage(): JSX.Element {
    const { user } = useAuth();
    const isAdmin = (user?.rol || "").toLowerCase() === "admin";

    const [sp, setSp] = useSearchParams();
    const pageParam = Number(sp.get("page") || "1");
    const limitParam = Number(sp.get("limit") || "10");
    const searchParam = sp.get("search") || "";

    const [page, setPage] = useState(pageParam > 0 ? pageParam : 1);
    const [limit] = useState(limitParam > 0 ? limitParam : 10);
    const [search, setSearch] = useState(searchParam);
    const debouncedSearch = useDebouncedValue(search, 450);

    const [items, setItems] = useState<HistorialClinicoDto[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [current, setCurrent] = useState<HistorialClinicoDto | null>(null);

    const queryKey = useMemo(
        () => ({
            page,
            limit,
            search: debouncedSearch.trim() || undefined,
            searchField: debouncedSearch.trim() ? "diagnostico" : undefined,
            sort: "createdAt",
            order: "DESC" as const,
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

    const loadAdmin = async () => {
        const res = await getHistorialClinico(queryKey);
        setItems(res.items);
        setTotalPages(res.meta.totalPages || 1);
    };

    const loadUser = async () => {
        if (!user) return;

        const pacientes = await fetchAllPages(async (p, l) => getPacientes({ page: p, limit: l }));
        const paciente = pacientes.find((p) => p.id_usuario === user.id);
        if (!paciente) {
            setItems([]);
            setTotalPages(1);
            return;
        }

        const citas = await fetchAllPages<CitaDto>(async (p, l) => {
            const { data } = await api.get("/citas-medicas", { params: { page: p, limit: l } });
            const payload = data?.data ?? data;
            const items = Array.isArray(payload?.items) ? payload.items : [];
            const meta = payload?.meta ?? {};
            return {
                items: items.map((c: any) => ({
                    id_cita: c.id_cita,
                    id_paciente: c.id_paciente,
                })),
                meta,
            };
        });

        const citaIds = new Set(
            citas.filter((c) => c.id_paciente === paciente.id_paciente).map((c) => c.id_cita)
        );

        const historial = await fetchAllPages(async (p, l) =>
            getHistorialClinico({ page: p, limit: l })
        );

        const filtered = historial.filter((h) => citaIds.has(h.id_cita));
        setItems(filtered);
        setTotalPages(1);
    };

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            if (isAdmin) {
                await loadAdmin();
            } else {
                await loadUser();
            }
        } catch {
            setError("No se pudo cargar el historial clinico.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [queryKey, isAdmin]);

    const onCreate = () => {
        if (!isAdmin) {
            setError("No tienes permisos para crear historial clinico.");
            return;
        }
        setMode("create");
        setCurrent(null);
        setOpen(true);
    };

    const onEdit = (h: HistorialClinicoDto) => {
        if (!isAdmin) {
            setError("No tienes permisos para editar historial clinico.");
            return;
        }
        setMode("edit");
        setCurrent(h);
        setOpen(true);
    };

    const onSubmit = async (payload: {
        id_cita: number;
        diagnostico: string;
        tratamiento: string;
        observaciones: string;
    }) => {
        try {
            setError(null);
            if (!isAdmin) {
                setError("No tienes permisos para guardar historial clinico.");
                return;
            }
            if (mode === "create") {
                await createHistorialClinico(payload);
                setOpen(false);
                setPage(1);
                await load();
                return;
            }
            if (!current) return;
            await updateHistorialClinico(current.id, payload);
            setOpen(false);
            await load();
        } catch {
            setError("No se pudo guardar el historial clinico.");
        }
    };

    const onDelete = async (id: string) => {
        try {
            setError(null);
            if (!isAdmin) {
                setError("No tienes permisos para eliminar historial clinico.");
                return;
            }
            await deleteHistorialClinico(id);
            await load();
        } catch {
            setError("No se pudo eliminar el historial clinico.");
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
                    Historial clinico
                </Typography>

                {isAdmin && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
                        Nuevo
                    </Button>
                )}
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Buscar (por diagnostico)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                disabled={!isAdmin}
            />

            {loading ? (
                <CircularProgress />
            ) : items.length === 0 ? (
                <Alert severity="info">No hay historial clinico para mostrar.</Alert>
            ) : (
                <>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Id cita</TableCell>
                                    <TableCell>Diagnostico</TableCell>
                                    <TableCell>Tratamiento</TableCell>
                                    <TableCell>Observaciones</TableCell>
                                    {isAdmin && <TableCell align="right">Acciones</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((h) => (
                                    <TableRow key={h.id}>
                                        <TableCell>{h.id}</TableCell>
                                        <TableCell>{h.id_cita}</TableCell>
                                        <TableCell>{h.diagnostico}</TableCell>
                                        <TableCell>{h.tratamiento}</TableCell>
                                        <TableCell>{h.observaciones}</TableCell>
                                        {isAdmin && (
                                            <TableCell align="right">
                                                <IconButton onClick={() => onEdit(h)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => onDelete(h.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {isAdmin && (
                        <Stack direction="row" justifyContent="center" sx={{ py: 1 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, v) => setPage(v)}
                            />
                        </Stack>
                    )}
                </>
            )}

            <HistorialClinicoFormDialog
                open={open}
                mode={mode}
                initial={current}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
            />
        </Stack>
    );
}
