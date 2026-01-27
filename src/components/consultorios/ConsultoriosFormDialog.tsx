import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createConsultorio,
  updateConsultorio,
  type ConsultorioDto,
} from "../../services/consultorios.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ConsultorioDto | null;
}

// Esquema de validación basado en CreateConsultorioDto
const schema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  ubicacion: yup
    .string()
    .required("La ubicación es obligatoria") // Aunque el backend dice nullable, el DTO dice String. Mejor que sea obligatorio o string vacío.
    .max(100, "Máximo 100 caracteres"),
  estado: yup
    .string()
    .oneOf(["activo", "inactivo"], "El estado debe ser activo o inactivo")
    .required("El estado es obligatorio"),
});

type FormData = yup.inferType<typeof schema>;

export const ConsultoriosFormDialog = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      ubicacion: "",
      estado: "activo",
    },
  });

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      if (initialData) {
        // Modo Edición
        setValue("nombre", initialData.nombre);
        setValue("ubicacion", initialData.ubicacion);
        setValue("estado", initialData.estado as any);
      } else {
        // Modo Creación
        reset({
          nombre: "",
          ubicacion: "",
          estado: "activo",
        });
      }
    }
  }, [open, initialData, reset, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateConsultorio(initialData.id_consultorio, data);
      } else {
        await createConsultorio(data);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error guardando consultorio:", error);
      const msg = error.response?.data?.message || "Error al guardar el consultorio";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Consultorio #${initialData.id_consultorio}` : "Nuevo Consultorio"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Consultorio"
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                {...register("nombre")}
              />
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                multiline
                rows={2}
                error={!!errors.ubicacion}
                helperText={errors.ubicacion?.message}
                {...register("ubicacion")}
              />
            </Grid>

            {/* Estado */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Estado"
                defaultValue="activo"
                error={!!errors.estado}
                helperText={errors.estado?.message}
                {...register("estado")}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </TextField>
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