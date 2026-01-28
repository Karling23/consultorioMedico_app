import { useEffect, useState, type FormEvent, type JSX } from "react";
import {
  Alert,
  Autocomplete,
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
// Importamos los tipos y servicios
import {
  type CitaMedicaDto,
  createCitaMedica,
  updateCitaMedica,
} from "../../services/citas-medicas.service";
import { getPacientes, type PacienteDto } from "../../services/pacientes.service";
import { getDoctores, type DoctorDto } from "../../services/doctores.service";
import { getConsultorios, type ConsultorioDto } from "../../services/consultorios.service";

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

  const [idPaciente, setIdPaciente] = useState<number | null>(null);
  const [idDoctor, setIdDoctor] = useState<number | null>(null);
  const [idConsultorio, setIdConsultorio] = useState<number | null>(null);
  const [fechaCita, setFechaCita] = useState("");
  const [horaCita, setHoraCita] = useState("");
  const [estado, setEstado] = useState<"Pendiente" | "Confirmada" | "Cancelada">("Pendiente");
  const [motivo, setMotivo] = useState("");
  const [pacientes, setPacientes] = useState<PacienteDto[]>([]);
  const [doctores, setDoctores] = useState<DoctorDto[]>([]);
  const [consultorios, setConsultorios] = useState<ConsultorioDto[]>([]);

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
      setIdPaciente(null);
      setIdDoctor(null);
      setIdConsultorio(null);
      setFechaCita("");
      setHoraCita("");
      setEstado("Pendiente");
      setMotivo("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [pacientesRes, doctoresRes, consultoriosRes] = await Promise.all([
          getPacientes({ page: 1, limit: 100 }),
          getDoctores({ page: 1, limit: 100 }),
          getConsultorios({ page: 1, limit: 100 }),
        ]);
        setPacientes(pacientesRes.items);
        setDoctores(doctoresRes.items);
        setConsultorios(consultoriosRes.items);
      } catch {
        setPacientes([]);
        setDoctores([]);
        setConsultorios([]);
      }
    })();
  }, [open]);

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
        id_paciente: idPaciente,
        id_doctor: idDoctor,
        id_consultorio: idConsultorio,
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

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={pacientes.map((p) => ({
                  id: p.id_paciente,
                  label: `#${p.id_paciente} - ${p.cedula}`,
                }))}
                value={
                  idPaciente === null
                    ? null
                    : pacientes
                        .map((p) => ({ id: p.id_paciente, label: `#${p.id_paciente} - ${p.cedula}` }))
                        .find((o) => o.id === idPaciente) || { id: idPaciente, label: `#${idPaciente}` }
                }
                onChange={(_, option) => setIdPaciente(option?.id ?? null)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.label}
                openOnFocus
                renderInput={(params) => (
                  <TextField {...params} label="Paciente" required />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={doctores.map((d) => ({
                  id: d.id_doctor,
                  label: `#${d.id_doctor} - Usuario ${d.id_usuario}`,
                }))}
                value={
                  idDoctor === null
                    ? null
                    : doctores
                        .map((d) => ({ id: d.id_doctor, label: `#${d.id_doctor} - Usuario ${d.id_usuario}` }))
                        .find((o) => o.id === idDoctor) || { id: idDoctor, label: `#${idDoctor}` }
                }
                onChange={(_, option) => setIdDoctor(option?.id ?? null)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.label}
                openOnFocus
                renderInput={(params) => (
                  <TextField {...params} label="Doctor" required />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={consultorios.map((c) => ({
                  id: c.id_consultorio,
                  label: `#${c.id_consultorio} - ${c.nombre}`,
                }))}
                value={
                  idConsultorio === null
                    ? null
                    : consultorios
                        .map((c) => ({ id: c.id_consultorio, label: `#${c.id_consultorio} - ${c.nombre}` }))
                        .find((o) => o.id === idConsultorio) || { id: idConsultorio, label: `#${idConsultorio}` }
                }
                onChange={(_, option) => setIdConsultorio(option?.id ?? null)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.label}
                openOnFocus
                renderInput={(params) => (
                  <TextField {...params} label="Consultorio" required />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Fecha de Cita"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hora (HH:mm)"
                type="time"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={horaCita}
                onChange={(e) => setHoraCita(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Motivo / Observaciones"
                multiline
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
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
