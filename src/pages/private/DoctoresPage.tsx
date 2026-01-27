import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Pagination,
  Paper,
  Snackbar,
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<PaginatedDoctores<DoctorDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<DoctorDto | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDoctores({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        searchField: debouncedSearch ? "dias_disponibles" : undefined,
      });
      setData(result);
    } catch (error) {
      console.error("Error cargando doctores", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este doctor?")) return;
    try {
      await deleteDoctor(id);
      fetchData();
      setSnackbarMsg("Doctor eliminado");
      setSnackbarOpen(true);
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleCreate = () => {
    setSelected(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: DoctorDto) => {
    setSelected(row);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Doctores</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Nuevo Doctor
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por días disponibles..."
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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" sx={{ "& tbody tr:hover": { bgcolor: "action.hover" } }}>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Días disponibles</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((row) => (
                <TableRow key={row.id_doctor}>
                  <TableCell>{row.id_doctor}</TableCell>
                  <TableCell>{row.dias_disponibles}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton color="error" onClick={() => handleDelete(row.id_doctor)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
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
            setSnackbarMsg("Doctor guardado");
            setSnackbarOpen(true);
          }}
          initialData={selected}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
