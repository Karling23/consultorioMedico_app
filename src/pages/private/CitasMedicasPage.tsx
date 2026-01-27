import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
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
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";

import {
  type CitaMedicaDto,
  deleteCitaMedica,
  getCitasMedicas,
  type PaginatedCitasMedicas,
} from "../../services/citas-medicas.service";

import { CitasMedicasFormDialog } from "../../components/citas-medicas/CitasMedicasFormDialog";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CitasMedicasPage() {
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<PaginatedCitasMedicas<CitaMedicaDto> | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState<CitaMedicaDto | null>(null);

  type ApiError = {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(null);
      const result = await getCitasMedicas({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      setError("No se pudieron cargar las citas.");
      console.error("Error cargando citas", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteCitaMedica(id);
      fetchData();
      setSuccess("Cita médica eliminada del sistema.");
    } catch (error) {
      const msg =
        (error as ApiError)?.response?.data?.message || "No se pudo eliminar la cita médica.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleCreate = () => {
    if (!isAdmin) return;
    setSelectedCita(null);
    setOpenDialog(true);
  };

  const handleEdit = (cita: CitaMedicaDto) => {
    if (!isAdmin) return;
    setSelectedCita(cita);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Citas Medicas</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nueva Cita
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por estado o motivo..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Motivo</TableCell>
                {isAdmin && <TableCell align="right">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((cita) => (
                <TableRow key={cita.id_cita}>
                  <TableCell>{cita.id_cita}</TableCell>
                  <TableCell>{cita.fecha_cita}</TableCell>
                  <TableCell>{cita.hora_cita}</TableCell>
                  <TableCell>{cita.estado}</TableCell>
                  <TableCell>{cita.motivo || "-"}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(cita)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cita.id_cita)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {data.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                    No se encontraron citas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="center" py={2}>
            <Pagination
              count={data.meta.totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </TableContainer>
      ) : (
        <Alert severity="info">No hay datos.</Alert>
      )}

      {openDialog && isAdmin && (
        <CitasMedicasFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(
              selectedCita ? "Cita médica actualizada exitosamente." : "Cita médica creada exitosamente."
            );
          }}
          initialData={selectedCita}
        />
      )}
    </Container>
  );
}
