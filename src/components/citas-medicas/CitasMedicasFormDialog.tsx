import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Importamos los tipos y servicios
import {
  type CitaMedicaDto,
  createCitaMedica,
  updateCitaMedica,
} from "../../services/citas-medicas.service";

// 1. Definición de las Props que recibe el componente
interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CitaMedicaDto | null; // Si existe, es edición. Si es null, es creación.
}

// 2. Esquema de validación con Yup (Basado en los DTOs del backend)
const schema = yup.object().shape({
  id_paciente: yup
    .number()
    .typeError("Debe ser un número")
    .required("El ID del paciente es obligatorio")
    .positive()
    .integer(),
  id_doctor: yup
    .number()
    .typeError("Debe ser un número")
    .required("El ID del doctor es obligatorio")
    .positive()
    .integer(),
  id_consultorio: yup
    .number()
    .typeError("Debe ser un número")
    .required("El ID del consultorio es obligatorio")
    .positive()
    .integer(),
  // La fecha debe ser un string YYYY-MM-DD
  fecha_cita: yup.string().required("La fecha es obligatoria"),
  // La hora debe validar el regex del backend HH:mm
  hora_cita: yup
    .string()
    .required("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
  estado: yup
    .string()
    .oneOf(["Pendiente", "Confirmada", "Cancelada"])
    .required("El estado es obligatorio"),
  motivo: yup.string().nullable(), // Puede ser opcional
});

// Tipo inferido a partir del esquema yup para el formulario
type FormData = yup.inferType<typeof schema>;

export const CitasMedicasFormDialog = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditMode = !!initialData;

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      estado: "Pendiente", // Valor por defecto para nuevas citas
      id_paciente: undefined,
      id_doctor: undefined,
      id_consultorio: undefined,
      motivo: "",
    },
  });

  // Efecto para cargar datos si es modo edición o limpiar si es creación
  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      if (initialData) {
        // Modo Edición: Rellenar formulario
        setValue("id_paciente", initialData.id_paciente);
        setValue("id_doctor", initialData.id_doctor);
        setValue("id_consultorio", initialData.id_consultorio);
        // Asegurarse que las fechas/horas vengan en formato correcto del backend
        setValue("fecha_cita", initialData.fecha_cita); 
        setValue("hora_cita", initialData.hora_cita);
        setValue("estado", initialData.estado as any);
        setValue("motivo", initialData.motivo || "");
      } else {
        // Modo Creación: Limpiar formulario
        reset({
          estado: "Pendiente",
          motivo: "",
          // Los campos numéricos se resetean a undefined o vacíos
        });
      }
    }
  }, [open, initialData, reset, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isEditMode && initialData) {
        // Actualizar
        await updateCitaMedica(initialData.id_cita, data);
      } else {
        // Crear
        await createCitaMedica(data);
      }
      onSuccess(); // Cerrar modal y recargar tabla
    } catch (error: any) {
      console.error("Error al guardar cita:", error);
      // Intentamos mostrar el mensaje del backend si existe
      const msg =
        error.response?.data?.message || "Error al guardar la cita médica";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Cita #${initialData.id_cita}` : "Nueva Cita Médica"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* NOTA: Estos 3 campos numéricos son temporales hasta que
                tengas los servicios de Pacientes/Doctores para usar un Select */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Paciente"
                type="number"
                error={!!errors.id_paciente}
                helperText={errors.id_paciente?.message}
                {...register("id_paciente")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Doctor"
                type="number"
                error={!!errors.id_doctor}
                helperText={errors.id_doctor?.message}
                {...register("id_doctor")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Consultorio"
                type="number"
                error={!!errors.id_consultorio}
                helperText={errors.id_consultorio?.message}
                {...register("id_consultorio")}
              />
            </Grid>

            {/* Campos de Fecha y Hora */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Cita"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_cita}
                helperText={errors.fecha_cita?.message}
                {...register("fecha_cita")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hora (HH:mm)"
                type="time"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // Pasos de 5 minutos opcional
                error={!!errors.hora_cita}
                helperText={errors.hora_cita?.message}
                {...register("hora_cita")}
              />
            </Grid>

            {/* Selector de Estado */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                defaultValue="Pendiente"
                error={!!errors.estado}
                helperText={errors.estado?.message}
                {...register("estado")}
              >
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Confirmada">Confirmada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </TextField>
            </Grid>

            {/* Campo Motivo */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo / Observaciones"
                multiline
                rows={3}
                error={!!errors.motivo}
                helperText={errors.motivo?.message}
                {...register("motivo")}
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