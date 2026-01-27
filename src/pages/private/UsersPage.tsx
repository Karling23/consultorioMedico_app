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
import {
    createUsuario,
    deleteUsuario,
    getUsuarios,
    type UsuarioDto,
    updateUsuario,
} from "../../services/usuarios.service";
import UserFormDialog from "../../components/users/UserFormDialog";

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

export default function UsersPage(): JSX.Element {
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

    const [items, setItems] = useState<UsuarioDto[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [current, setCurrent] = useState<UsuarioDto | null>(null);

    const queryKey = useMemo(
        () => ({
            page,
            limit,
            search: debouncedSearch.trim() || undefined,
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
        if (!isAdmin) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getUsuarios(queryKey);
                setItems(res.items);
                setTotalPages(res.meta.totalPages || 1);
            } catch {
                setError("No se pudieron cargar los usuarios.");
            } finally {
                setLoading(false);
            }
        })();
    }, [queryKey, isAdmin]);

    const onCreate = () => {
        setMode("create");
        setCurrent(null);
        setOpen(true);
    };

    const onEdit = (u: UsuarioDto) => {
        setMode("edit");
        setCurrent(u);
        setOpen(true);
    };

    const onSubmit = async (payload: {
        nombre_usuario: string;
        password?: string;
        rol?: string;
    }) => {
        try {
            setError(null);
            if (mode === "create") {
                await createUsuario({
                    nombre_usuario: payload.nombre_usuario,
                    password: payload.password || "",
                    rol: payload.rol,
                });
                setOpen(false);
                setPage(1);
                return;
            }

            if (!current) return;

            await updateUsuario(current.id_usuario, payload);
            setOpen(false);
        } catch {
            setError("No se pudo guardar el usuario.");
        } finally {
            const res = await getUsuarios(queryKey);
            setItems(res.items);
            setTotalPages(res.meta.totalPages || 1);
        }
    };

    const onDelete = async (id: number) => {
        try {
            setError(null);
            await deleteUsuario(id);
            const res = await getUsuarios(queryKey);
            setItems(res.items);
            setTotalPages(res.meta.totalPages || 1);
        } catch {
            setError("No se pudo eliminar el usuario.");
        }
    };

    if (!isAdmin) {
        return (
            <Stack spacing={2}>
                <Typography variant="h4">Usuarios</Typography>
                <Alert severity="warning">No tienes permisos para ver este modulo.</Alert>
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Usuarios
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
                    Nuevo
                </Button>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
            />

            {loading ? (
                <CircularProgress />
            ) : items.length === 0 ? (
                <Alert severity="info">No hay usuarios para mostrar.</Alert>
            ) : (
                <>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Rol</TableCell>
                                    <TableCell>Fecha creacion</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((u) => (
                                    <TableRow key={u.id_usuario}>
                                        <TableCell>{u.id_usuario}</TableCell>
                                        <TableCell>{u.nombre_usuario}</TableCell>
                                    <TableCell>{u.rol}</TableCell>
                                    <TableCell>
                                        {u.fecha_creacion ? u.fecha_creacion.slice(0, 10) : "-"}
                                    </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => onEdit(u)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => onDelete(u.id_usuario)}>
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

            <UserFormDialog
                open={open}
                mode={mode}
                initial={current}
                onClose={() => setOpen(false)}
                onSubmit={onSubmit}
            />
        </Stack>
    );
}
