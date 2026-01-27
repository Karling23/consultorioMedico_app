import {Alert,Box,Button,CircularProgress,Container,IconButton,Pagination,Paper,Stack,Table,TableBody,
TableCell,TableContainer,TableHead,TableRow,TextField,
Typography,} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {deletePaciente,getPacientes,type PacienteDto,type PaginatedPacientes,} from "../../services/pacientes.service";
import { PacientesFormDialog } from "../../components/pacientes/PacientesFormDialog";

// 1. IMPORTAMOS useAuth PARA SABER EL ROL
import { useAuth } from "../../context/AuthContext";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PacientesPage() {
  // 2. OBTENEMOS EL USUARIO DEL CONTEXTO
  const { user } = useAuth(); 
  const isAdmin = (user?.rol || "").toLowerCase() === "admin"; 

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [data, setData] = useState<PaginatedPacientes<PacienteDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteDto | null>(null);

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
      const result = await getPacientes({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      setError("No se pudieron cargar los pacientes.");
      console.error("Error cargando pacientes", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deletePaciente(id);
      fetchData();
      setSuccess("Paciente eliminado del sistema.");
    } catch (error) {
      const msg =
        (error as ApiError)?.response?.data?.message || "No se pudo eliminar el paciente.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleCreate = () => {
    if (!isAdmin) return;
    setSelectedPaciente(null);
    setOpenDialog(true);
  };

  const handleEdit = (paciente: PacienteDto) => {
    if (!isAdmin) return;
    setSelectedPaciente(paciente);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Pacientes</Typography>
        
        {/* 3. SOLO MOSTRAR BOTÓN CREAR SI ES ADMIN */}
        {isAdmin && ( 
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuevo Paciente
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por cédula..."
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
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID Usuario</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                
                {/* 4. SOLO MOSTRAR COLUMNA ACCIONES SI ES ADMIN */}
                {isAdmin && <TableCell align="right">Acciones</TableCell>}
              
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((paciente) => (
                <TableRow key={paciente.id_paciente}>
                  <TableCell>{paciente.id_paciente}</TableCell>
                  <TableCell>{paciente.id_usuario}</TableCell>
                  <TableCell>{paciente.cedula}</TableCell>
                  <TableCell>{paciente.fecha_nacimiento?.slice(0, 10) || "-"}</TableCell>
                  <TableCell>{paciente.telefono}</TableCell>
                  <TableCell>{paciente.direccion}</TableCell>
                  
                  {/* 5. SOLO MOSTRAR BOTONES EDITAR/BORRAR SI ES ADMIN */}
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(paciente)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(paciente.id_paciente)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}

                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                    No se encontraron pacientes.
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

      {/* El modal solo se renderiza si se abre, pero por seguridad podrías envolverlo también */}
      {openDialog && (
        <PacientesFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(
              selectedPaciente ? "Paciente actualizado exitosamente." : "Paciente creado exitosamente."
            );
          }}
          initialData={selectedPaciente}
        />
      )}
    </Container>
  );
}
