import {
  Box,
  Button,
  Chip,
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

// Importamos tipos y funciones del servicio
import {
  deleteConsultorio,
  getConsultorios,
  type ConsultorioDto,
  type PaginatedConsultorios,
} from "../../services/consultorios.service";

// Importamos el formulario (que crearemos en el paso 4)
import { ConsultoriosFormDialog } from "../../components/consultorios/ConsultoriosFormDialog";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ConsultoriosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<PaginatedConsultorios<ConsultorioDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultorio, setSelectedConsultorio] = useState<ConsultorioDto | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getConsultorios({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      console.error("Error cargando consultorios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este consultorio?")) return;
    try {
      await deleteConsultorio(id);
      fetchData();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleCreate = () => {
    setSelectedConsultorio(null);
    setOpenDialog(true);
  };

  const handleEdit = (consultorio: ConsultorioDto) => {
    setSelectedConsultorio(consultorio);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Consultorios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Consultorio
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre o ubicación..."
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
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((cons) => (
                <TableRow key={cons.id_consultorio}>
                  <TableCell>{cons.id_consultorio}</TableCell>
                  <TableCell>{cons.nombre}</TableCell>
                  <TableCell>{cons.ubicacion || "-"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cons.estado} 
                      color={cons.estado === 'activo' ? 'success' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(cons)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cons.id_consultorio)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron consultorios.
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
        <ConsultoriosFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
          }}
          initialData={selectedConsultorio}
        />
      )}
    </Container>
  );
}