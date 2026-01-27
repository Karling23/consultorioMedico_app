import { useEffect, useState, type FormEvent, type JSX } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import {
  createConsultorio,
  updateConsultorio,
  type ConsultorioDto,
} from "../../services/consultorios.service";

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
  initialData?: ConsultorioDto | null;
}

type FieldErrors = {
  nombre?: string;
  ubicacion?: string;
  estado?: string;
};

export const ConsultoriosFormDialog = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isEditMode = !!initialData;

  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [estado, setEstado] = useState<"activo" | "inactivo">("activo");

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);
    setFieldErrors({});

    if (initialData) {
      setNombre(initialData.nombre || "");
      setUbicacion(initialData.ubicacion || "");
      const nextEstado = initialData.estado;
      if (nextEstado === "activo" || nextEstado === "inactivo") {
        setEstado(nextEstado);
      } else {
        setEstado("activo");
      }
    } else {
      setNombre("");
      setUbicacion("");
      setEstado("activo");
    }
  }, [open, initialData]);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!ubicacion.trim()) errors.ubicacion = "La ubicacion es obligatoria";
    if (!estado) errors.estado = "El estado es obligatorio";
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
        nombre: nombre.trim(),
        ubicacion: ubicacion.trim(),
        estado,
      };

      if (isEditMode && initialData) {
        await updateConsultorio(initialData.id_consultorio, payload);
      } else {
        await createConsultorio(payload);
      }
      onSuccess();
    } catch (error) {
      const msg =
        (error as ApiError)?.response?.data?.message || "Error al guardar el consultorio";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Consultorio #${initialData?.id_consultorio}` : "Nuevo Consultorio"}
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid2 container spacing={2}>
            <Grid2 xs={12}>
              <TextField
                fullWidth
                label="Nombre del Consultorio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={!!fieldErrors.nombre}
                helperText={fieldErrors.nombre}
              />
            </Grid2>

            <Grid2 xs={12}>
              <TextField
                fullWidth
                label="Ubicacion"
                multiline
                rows={2}
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                error={!!fieldErrors.ubicacion}
                helperText={fieldErrors.ubicacion}
              />
            </Grid2>

            <Grid2 xs={12}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value as "activo" | "inactivo")}
                error={!!fieldErrors.estado}
                helperText={fieldErrors.estado}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
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
