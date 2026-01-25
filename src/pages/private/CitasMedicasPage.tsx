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
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500); 
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<PaginatedCitasMedicas<CitaMedicaDto> | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState<CitaMedicaDto | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getCitasMedicas({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      console.error("Error cargando citas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta cita?")) return;
    try {
      await deleteCitaMedica(id);
      fetchData(); 
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleCreate = () => {
    setSelectedCita(null); 
    setOpenDialog(true);
  };

  const handleEdit = (cita: CitaMedicaDto) => {
    setSelectedCita(cita); 
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Citas Médicas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nueva Cita
        </Button>
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
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((cita) => (
                <TableRow key={cita.id_cita}>
                  <TableCell>{cita.id_cita}</TableCell>
                  <TableCell>{cita.fecha_cita}</TableCell>
                  <TableCell>{cita.hora_cita}</TableCell>
                  <TableCell>{cita.estado}</TableCell>
                  <TableCell>{cita.motivo || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(cita)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cita.id_cita)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron citas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Paginación */}
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

      {/* COMPONENTE DEL MODAL (Paso 4) */}
      {openDialog && (
        <CitasMedicasFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
          }}
          initialData={selectedCita}
        />
      )}
    </Container>
  );
}