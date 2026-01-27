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
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  createPaciente,
  updatePaciente,
  type PacienteDto, 
} from "../../services/pacientes.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PacienteDto | null;
}

const schema = yup.object().shape({
  id_usuario: yup
    .number()
    .typeError("Debe ser un número (ID Usuario)")
    .required("El ID de Usuario es obligatorio")
    .positive()
    .integer(),
  cedula: yup
    .string()
    .required("La cédula es obligatoria")
    .length(10, "La cédula debe tener exactamente 10 dígitos")
    .matches(/^[0-9]+$/, "La cédula solo debe contener números"),
  fecha_nacimiento: yup
    .string()
    .required("La fecha de nacimiento es obligatoria"),
  telefono: yup
    .string()
    .required("El teléfono es obligatorio")
    .max(20, "Máximo 20 caracteres"),
  direccion: yup
    .string()
    .required("La dirección es obligatoria")
    .max(150, "Máximo 150 caracteres"),
});

type FormData = yup.InferType<typeof schema>;

export const PacientesFormDialog = ({
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
      id_usuario: undefined,
      cedula: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      if (initialData) {
        // Modo Edición
        setValue("id_usuario", initialData.id_usuario);
        setValue("cedula", initialData.cedula);
        setValue("fecha_nacimiento", initialData.fecha_nacimiento);
        setValue("telefono", initialData.telefono);
        setValue("direccion", initialData.direccion);
      } else {
        // Modo Creación
        reset({
          cedula: "",
          telefono: "",
          direccion: "",
          // id_usuario se resetea a undefined
        });
      }
    }
  }, [open, initialData, reset, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updatePaciente(initialData.id_paciente, data);
      } else {
        await createPaciente(data);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error guardando paciente:", error);
      // Mostrar mensaje del backend si existe (ej. "Cédula duplicada")
      const msg = error.response?.data?.message || "Error al guardar el paciente";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Paciente #${initialData.id_paciente}` : "Nuevo Paciente"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* ID Usuario (Temporal hasta tener módulo de usuarios) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Usuario (Login)"
                type="number"
                error={!!errors.id_usuario}
                helperText={errors.id_usuario?.message}
                {...register("id_usuario")}
              />
            </Grid>

            {/* Cédula */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula"
                inputProps={{ maxLength: 10 }}
                error={!!errors.cedula}
                helperText={errors.cedula?.message}
                {...register("cedula")}
              />
            </Grid>

            {/* Fecha Nacimiento */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_nacimiento}
                helperText={errors.fecha_nacimiento?.message}
                {...register("fecha_nacimiento")}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
                {...register("telefono")}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
                {...register("direccion")}
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