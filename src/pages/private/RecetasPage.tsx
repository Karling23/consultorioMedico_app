import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Tooltip,
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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  deleteReceta,
  getRecetas,
  type RecetaDto,
  type PaginatedRecetas,
} from "../../services/recetas.service";
import { RecetasFormDialog } from "../../components/recetas/RecetasFormDialog";

export default function RecetasPage() {
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedRecetas<RecetaDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<RecetaDto | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }
  const debouncedSearch = useDebouncedValue(search, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res = await getRecetas({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        searchField: debouncedSearch ? "id_receta" : undefined,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setError("No tienes permisos para eliminar recetas.");
      return;
    }
    if (!confirm("¿Eliminar esta receta?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteReceta(id);
      fetchData();
      setSuccess("Receta eliminada del sistema.");
    } catch {
      setError("No se pudo eliminar la receta.");
    }
  };

  const handleCreate = () => {
    if (!isAdmin) {
      setError("No tienes permisos para crear recetas.");
      return;
    }
    setSuccess(null);
    setSelected(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: RecetaDto) => {
    if (!isAdmin) {
      setError("No tienes permisos para editar recetas.");
      return;
    }
    setSuccess(null);
    setSelected(row);
    setOpenDialog(true);
  };

  return (
    <>
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Recetas</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={handleCreate}>
            Nueva
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por ID de receta..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" sx={{ "& tbody tr:hover": { bgcolor: "action.hover" } }}>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID Receta</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID Historial</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha emisión</TableCell>
                {isAdmin && (
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((row) => (
                <TableRow key={row.id_receta}>
                  <TableCell>{row.id_receta}</TableCell>
                  <TableCell>{row.id_historial}</TableCell>
                  <TableCell>{row.fecha_emision || "-"}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDelete(row.id_receta)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} align="center">
                    Sin recetas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {data && (
            <Box display="flex" justifyContent="center" py={2}>
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </TableContainer>
      )}
    </Container>
    {openDialog && (
        <RecetasFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(selected ? "Receta actualizada exitosamente." : "Receta creada exitosamente.");
          }}
          initialData={selected}
        />
    )}
    </>
  );
}
