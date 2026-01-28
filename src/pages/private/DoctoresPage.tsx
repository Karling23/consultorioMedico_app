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
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ActionIconButton } from "../../components/common/ActionIconButton";
import { useAuth } from "../../context/AuthContext";
import {
  deleteDoctor,
  getDoctores,
  type DoctorDto,
  type PaginatedDoctores,
} from "../../services/doctores.service";
import { DoctoresFormDialog } from "../../components/doctores/DoctoresFormDialog";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function DoctoresPage() {
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<PaginatedDoctores<DoctorDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<DoctorDto | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const result = await getDoctores({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        searchField: debouncedSearch ? "dias_disponibles" : undefined,
      });
      setData(result);
    } catch (error) {
      setError("No se pudieron cargar los doctores.");
      console.error("Error cargando doctores", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setError("No tienes permisos para eliminar doctores.");
      return;
    }
    if (!confirm("�Eliminar este doctor?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteDoctor(id);
      fetchData();
      setSuccess("Doctor eliminado del sistema.");
    } catch {
      setError("No se pudo eliminar el doctor.");
    }
  };

  const handleCreate = () => {
    if (!isAdmin) {
      setError("No tienes permisos para crear doctores.");
      return;
    }
    setSuccess(null);
    setSelected(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: DoctorDto) => {
    if (!isAdmin) {
      setError("No tienes permisos para editar doctores.");
      return;
    }
    setSuccess(null);
    setSelected(row);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Doctores</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuevo Doctor
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por d�as disponibles..."
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
                <TableCell sx={{ fontWeight: 600 }}>ID Usuario</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID Especialidad</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Horario inicio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Horario fin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>D�as disponibles</TableCell>
                {isAdmin && (
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((row) => (
                <TableRow key={row.id_doctor}>
                  <TableCell>{row.id_doctor}</TableCell>
                  <TableCell>{row.id_usuario}</TableCell>
                  <TableCell>{row.id_especialidad}</TableCell>
                  <TableCell>{row.horario_inicio || "-"}</TableCell>
                  <TableCell>{row.horario_fin || "-"}</TableCell>
                  <TableCell>{row.dias_disponibles || "-"}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <ActionIconButton color="primary" onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </ActionIconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <ActionIconButton color="error" onClick={() => handleDelete(row.id_doctor)}>
                          <DeleteIcon />
                        </ActionIconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                    No se encontraron doctores.
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
        <DoctoresFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(
              selected ? "Doctor actualizado exitosamente." : "Doctor creado exitosamente."
            );
          }}
          initialData={selected}
        />
      )}
    </Container>
  );
}
