import { useEffect, useState, type FormEvent, type JSX } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
// Importamos los tipos y servicios
import {
  type CitaMedicaDto,
  createCitaMedica,
  updateCitaMedica,
} from "../../services/citas-medicas.service";

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
  initialData?: CitaMedicaDto | null;
}

export const CitasMedicasFormDialog = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isEditMode = !!initialData;

  const [idPaciente, setIdPaciente] = useState<number>(0);
  const [idDoctor, setIdDoctor] = useState<number>(0);
  const [idConsultorio, setIdConsultorio] = useState<number>(0);
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [estado, setEstado] = useState<"Pendiente" | "Confirmada" | "Cancelada">("Pendiente");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);
    if (initialData) {
      setIdPaciente(Number(initialData.id_paciente));
      setIdDoctor(Number(initialData.id_doctor));
      setIdConsultorio(Number(initialData.id_consultorio));
      setFechaCita(initialData.fecha_cita);
      setHoraCita(initialData.hora_cita);
      const nextEstado = initialData.estado;
      if (
        nextEstado === "Pendiente" ||
        nextEstado === "Confirmada" ||
        nextEstado === "Cancelada"
      ) {
        setEstado(nextEstado);
      } else {
        setEstado("Pendiente");
      }
      setMotivo(initialData.motivo || "");
    } else {
      setIdPaciente(0);
      setIdDoctor(0);
      setIdConsultorio(0);
      setFechaCita("");
      setHoraCita("");
      setEstado("Pendiente");
      setMotivo("");
    }
  }, [open, initialData]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!idPaciente || !idDoctor || !idConsultorio || !fechaCita || !horaCita) {
        setErrorMessage("Completa todos los campos obligatorios.");
        setLoading(false);
        return;
      }

      const payload: Partial<CitaMedicaDto> = {
        id_paciente: Number(idPaciente),
        id_doctor: Number(idDoctor),
        id_consultorio: Number(idConsultorio),
        fecha_cita: fechaCita,
        hora_cita: horaCita,
        estado,
        motivo: motivo || undefined,
      };

      if (isEditMode && initialData) {
        await updateCitaMedica(initialData.id_cita, payload);
      } else {
        await createCitaMedica(payload);
      }

      onSuccess();
    } catch (error) {
      const msg =
        (error as ApiError)?.response?.data?.message || "Error al guardar la cita medica";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Cita #${initialData?.id_cita}` : "Nueva Cita Medica"}
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid2 container spacing={2}>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Paciente"
                type="number"
                value={idPaciente || ""}
                onChange={(e) => setIdPaciente(Number(e.target.value))}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Doctor"
                type="number"
                value={idDoctor || ""}
                onChange={(e) => setIdDoctor(Number(e.target.value))}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <TextField
                fullWidth
                label="ID Consultorio"
                type="number"
                value={idConsultorio || ""}
                onChange={(e) => setIdConsultorio(Number(e.target.value))}
              />
            </Grid2>

            <Grid2 xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Cita"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
              />
            </Grid2>
            <Grid2 xs={12} md={6}>
              <TextField
                fullWidth
                label="Hora (HH:mm)"
                type="time"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={horaCita}
                onChange={(e) => setHoraCita(e.target.value)}
              />
            </Grid2>

            <Grid2 xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value as "Pendiente" | "Confirmada" | "Cancelada")
                }
              >
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Confirmada">Confirmada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </TextField>
            </Grid2>

            <Grid2 xs={12}>
              <TextField
                fullWidth
                label="Motivo / Observaciones"
                multiline
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
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
