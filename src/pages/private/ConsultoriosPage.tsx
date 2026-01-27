import {
  Box,
  Button,
  Alert,
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

import {deleteConsultorio,getConsultorios,type ConsultorioDto,type PaginatedConsultorios,} from "../../services/consultorios.service";
import { ConsultoriosFormDialog } from "../../components/consultorios/ConsultoriosFormDialog";

// 1. Importamos useAuth
import { useAuth } from "../../context/AuthContext";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ConsultoriosPage() {
  // 2. Verificamos Rol
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<PaginatedConsultorios<ConsultorioDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultorio, setSelectedConsultorio] = useState<ConsultorioDto | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(null);
      const result = await getConsultorios({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setData(result);
    } catch (error) {
      setError("No se pudieron cargar los consultorios.");
      console.error("Error cargando consultorios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    if (!confirm("¿Estás seguro de eliminar este consultorio?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteConsultorio(id);
      fetchData();
      setSuccess("Consultorio eliminado del sistema.");
    } catch (error) {
      const msg =
        (error as any)?.response?.data?.message || "No se pudo eliminar el consultorio.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleCreate = () => {
    if (!isAdmin) return;
    setSelectedConsultorio(null);
    setOpenDialog(true);
  };

  const handleEdit = (consultorio: ConsultorioDto) => {
    if (!isAdmin) return;
    setSelectedConsultorio(consultorio);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Consultorios</Typography>
        {/* 3. Protección Botón Crear */}
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuevo Consultorio
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre o ubicación..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Estado</TableCell>
                {/* 4. Protección Columna Acciones */}
                {isAdmin && <TableCell align="right">Acciones</TableCell>}
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
                  {/* 5. Protección Botones Editar/Borrar */}
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(cons)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cons.id_consultorio)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} align="center">
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
            setSuccess(
              selectedConsultorio
                ? "Consultorio actualizado exitosamente."
                : "Consultorio creado exitosamente."
            );
          }}
          initialData={selectedConsultorio}
        />
      )}
    </Container>
  );
}
