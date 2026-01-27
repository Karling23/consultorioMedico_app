import {Box,Button,CircularProgress,Container,IconButton,Pagination,Paper,Stack,Table,TableBody,
TableCell,TableContainer,TableHead,TableRow,TextField,
Typography,} from "@mui/material";
import { useEffect, useState } from "react";
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
  const isAdmin = user?.rol === 'admin'; 

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<PaginatedPacientes<PacienteDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteDto | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getPacientes({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      console.error("Error cargando pacientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;
    try {
      await deletePaciente(id);
      fetchData();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleCreate = () => {
    setSelectedPaciente(null);
    setOpenDialog(true);
  };

  const handleEdit = (paciente: PacienteDto) => {
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
                <TableCell>Cédula</TableCell>
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
                  <TableCell>{paciente.cedula}</TableCell>
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
                  <TableCell colSpan={isAdmin ? 5 : 4} align="center">
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
          }}
          initialData={selectedPaciente}
        />
      )}
    </Container>
  );
}