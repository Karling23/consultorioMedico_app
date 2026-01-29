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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ActionIconButton } from "../../components/common/ActionIconButton";
import {
  deleteDoctoresConsultorio,
  getDoctoresConsultorios,
  type DoctoresConsultorioDto,
  type PaginatedDoctoresConsultorios,
} from "../../services/doctores-consultorios.service";
import { DoctoresConsultoriosFormDialog } from "../../components/doctores-consultorios/DoctoresConsultoriosFormDialog";
import { getDoctores, type DoctorDto } from "../../services/doctores.service";
import { getUsuarios, type UsuarioDto } from "../../services/usuarios.service";

async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<{ items: T[]; meta: { totalPages?: number } }>
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  const limit = 100;
  while (true) {
    const res = await fetchPage(page, limit);
    items.push(...res.items);
    const totalPages = res.meta.totalPages ?? 1;
    if (page >= totalPages || res.items.length < limit) break;
    page += 1;
  }
  return items;
}

function formatIdName(id: number, name?: string): string {
  return name ? `#${id} - ${name}` : `#${id}`;
}

export default function DoctoresConsultoriosPage() {
  const { user } = useAuth();
  const isAdmin = (user?.rol || "").toLowerCase() === "admin";
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedDoctoresConsultorios<DoctoresConsultorioDto> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<DoctoresConsultorioDto | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctores, setDoctores] = useState<DoctorDto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);

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
      const res = await getDoctoresConsultorios({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        searchField: debouncedSearch ? "id_doctor" : undefined,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [doctoresRes, usuariosRes] = await Promise.all([
          fetchAllPages((p, l) => getDoctores({ page: p, limit: l })),
          fetchAllPages((p, l) => getUsuarios({ page: p, limit: l })),
        ]);
        if (active) {
          setDoctores(doctoresRes);
          setUsuarios(usuariosRes);
        }
      } catch {
        if (active) {
          setDoctores([]);
          setUsuarios([]);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const usuarioById = useMemo(
    () => new Map(usuarios.map((u) => [u.id_usuario, u.nombre_usuario])),
    [usuarios]
  );

  const doctorNameById = useMemo(() => {
    const map = new Map<number, string>();
    doctores.forEach((d) => {
      const name = usuarioById.get(d.id_usuario);
      if (name) map.set(d.id_doctor, name);
    });
    return map;
  }, [doctores, usuarioById]);

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      setError("No tienes permisos para eliminar registros.");
      return;
    }
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteDoctoresConsultorio(id);
      fetchData();
      setSuccess("Registro eliminado del sistema.");
    } catch {
      setError("No se pudo eliminar el registro.");
    }
  };

  const handleCreate = () => {
    if (!isAdmin) {
      setError("No tienes permisos para crear registros.");
      return;
    }
    setSuccess(null);
    setSelected(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: DoctoresConsultorioDto) => {
    if (!isAdmin) {
      setError("No tienes permisos para editar registros.");
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
        <Typography variant="h4">Doctores-Consultorios</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={handleCreate}>
            Nuevo
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por ID de doctor..."
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
                <TableCell sx={{ fontWeight: 600 }}>ID Doctor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID Consultorio</TableCell>
                {isAdmin && (
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{formatIdName(row.id_doctor, doctorNameById.get(row.id_doctor))}</TableCell>
                  <TableCell>{row.id_consultorio}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <ActionIconButton color="primary" onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </ActionIconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <ActionIconButton color="error" onClick={() => handleDelete(row.id)}>
                          <DeleteIcon />
                        </ActionIconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} align="center">
                    Sin registros.
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
        <DoctoresConsultoriosFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => {
            setOpenDialog(false);
            fetchData();
            setSuccess(
              selected ? "Registro actualizado exitosamente." : "Registro creado exitosamente."
            );
          }}
          initialData={selected}
        />
    )}
    </>
  );
}
