import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
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
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import {
  deleteEspecialidad,
  getEspecialidades,
  type EspecialidadDto,
  type PaginatedEspecialidades,
} from "../../services/especialidades.service";
import { EspecialidadesFormDialog } from "../../components/especialidades/EspecialidadesFormDialog";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function EspecialidadesPage() {
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<PaginatedEspecialidades<EspecialidadDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<EspecialidadDto | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const result = await getEspecialidades({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
      });
      setData(result);
    } catch (error) {
      setError("No se pudieron cargar las especialidades.");
      console.error("Error cargando especialidades", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setError("No tienes permisos para eliminar especialidades.");
      return;
    }
    if (!confirm("¿Eliminar esta especialidad?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteEspecialidad(id);
      fetchData();
      setSuccess("Especialidad eliminada del sistema.");
    } catch {
      setError("No se pudo eliminar la especialidad.");
    }
  };

  const handleCreate = () => {
    if (!isAdmin) {
      setError("No tienes permisos para crear especialidades.");
      return;
    }
    setSuccess(null);
    setSelected(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: EspecialidadDto) => {
    if (!isAdmin) {
      setError("No tienes permisos para editar especialidades.");
      return;
    }
    setSuccess(null);
    setSelected(row);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Especialidades</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nueva Especialidad
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre o descripción..."
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
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                {isAdmin && (
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((row) => (
                <TableRow key={row.id_especialidad}>
                  <TableCell>{row.id_especialidad}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.descripcion || "-"}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDelete(row.id_especialidad)}>
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
                    No se encontraron especialidades.
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

      {openDialog && (
        <EspecialidadesFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(
              selected ? "Especialidad actualizada exitosamente." : "Especialidad creada exitosamente."
            );
          }}
          initialData={selected}
        />
      )}
    </Container>
  );
}
