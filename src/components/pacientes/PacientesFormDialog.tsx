import { useEffect, useState, type FormEvent, type JSX } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import {
  createPaciente,
  updatePaciente,
  type PacienteDto,
} from "../../services/pacientes.service";
import { getUsuarios, type UsuarioDto } from "../../services/usuarios.service";

type ApiError = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PacienteDto | null;
}

type FieldErrors = {
  id_usuario?: string;
  cedula?: string;
  fecha_nacimiento?: string;
  telefono?: string;
  direccion?: string;
};

export const PacientesFormDialog = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isEditMode = !!initialData;

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);
    setFieldErrors({});

    if (initialData) {
      setIdUsuario(Number(initialData.id_usuario));
      setCedula(initialData.cedula || "");
      setFechaNacimiento(initialData.fecha_nacimiento || "");
      setTelefono(initialData.telefono || "");
      setDireccion(initialData.direccion || "");
    } else {
      setIdUsuario(null);
      setCedula("");
      setFechaNacimiento("");
      setTelefono("");
      setDireccion("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await getUsuarios({ page: 1, limit: 100 });
        setUsuarios(res.items);
      } catch {
        setUsuarios([]);
      }
    })();
  }, [open]);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!idUsuario) errors.id_usuario = "El ID de Usuario es obligatorio";
    if (!cedula.trim()) errors.cedula = "La cédula es obligatoria";
    else if (!/^[0-9]{10}$/.test(cedula.trim())) {
      errors.cedula = "La cédula debe tener 10 dígitos";
    }
    if (!fechaNacimiento) errors.fecha_nacimiento = "La fecha es obligatoria";
    if (!telefono.trim()) errors.telefono = "El teléfono es obligatorio";
    if (!direccion.trim()) errors.direccion = "La dirección es obligatoria";
    return errors;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        id_usuario: Number(idUsuario),
        cedula: cedula.trim(),
        fecha_nacimiento: fechaNacimiento,
        telefono: telefono.trim(),
        direccion: direccion.trim(),
      };

      if (isEditMode && initialData) {
        await updatePaciente(initialData.id_paciente, payload);
      } else {
        await createPaciente(payload);
      }
      onSuccess();
    } catch (error) {
      const msg =
        (error as ApiError)?.response?.data?.message || "Error al guardar el paciente";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Paciente #${initialData?.id_paciente}` : "Nuevo Paciente"}
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={usuarios.map((u) => ({
                  id: u.id_usuario,
                  label: `#${u.id_usuario} - ${u.nombre_usuario}`,
                }))}
                value={
                  idUsuario === null
                    ? null
                    : usuarios
                        .map((u) => ({ id: u.id_usuario, label: `#${u.id_usuario} - ${u.nombre_usuario}` }))
                        .find((o) => o.id === idUsuario) || { id: idUsuario, label: `#${idUsuario}` }
                }
                onChange={(_, option) => setIdUsuario(option?.id ?? null)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.label}
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ID Usuario (Login)"
                    error={!!fieldErrors.id_usuario}
                    helperText={fieldErrors.id_usuario}
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Cédula"
                inputProps={{ maxLength: 10 }}
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                error={!!fieldErrors.cedula}
                helperText={fieldErrors.cedula}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                error={!!fieldErrors.fecha_nacimiento}
                helperText={fieldErrors.fecha_nacimiento}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                error={!!fieldErrors.telefono}
                helperText={fieldErrors.telefono}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                error={!!fieldErrors.direccion}
                helperText={fieldErrors.direccion}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
