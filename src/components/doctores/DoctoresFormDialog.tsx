import { useEffect, useState } from "react";
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
import { Stack } from "@mui/material";
import { createDoctor, updateDoctor, type DoctorDto } from "../../services/doctores.service";
import { getUsuarios, type UsuarioDto } from "../../services/usuarios.service";
import { getEspecialidades, type EspecialidadDto } from "../../services/especialidades.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DoctorDto | null;
}

export function DoctoresFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadDto[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | "">("");
  const [idEspecialidad, setIdEspecialidad] = useState<number | "">("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFin, setHorarioFin] = useState("");
  const [diasDisponibles, setDiasDisponibles] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdUsuario(initialData?.id_usuario ?? "");
      setIdEspecialidad(initialData?.id_especialidad ?? "");
      setHorarioInicio(initialData?.horario_inicio || "");
      setHorarioFin(initialData?.horario_fin || "");
      setDiasDisponibles(initialData?.dias_disponibles || "");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [usuariosRes, especialidadesRes] = await Promise.all([
          getUsuarios({ page: 1, limit: 100 }),
          getEspecialidades({ page: 1, limit: 100 }),
        ]);
        setUsuarios(usuariosRes.items);
        setEspecialidades(especialidadesRes.items);
      } catch {
        setUsuarios([]);
        setEspecialidades([]);
      }
    })();
  }, [open]);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (idUsuario === "" || idEspecialidad === "") {
        setErrorMessage("Selecciona usuario y especialidad.");
        setLoading(false);
        return;
      }
      if (isEditMode && initialData) {
        await updateDoctor(initialData.id_doctor, {
          id_usuario: Number(idUsuario),
          id_especialidad: Number(idEspecialidad),
          horario_inicio: horarioInicio || undefined,
          horario_fin: horarioFin || undefined,
          dias_disponibles: diasDisponibles || undefined,
        });
      } else {
        await createDoctor({
          id_usuario: Number(idUsuario),
          id_especialidad: Number(idEspecialidad),
          horario_inicio: horarioInicio || undefined,
          horario_fin: horarioFin || undefined,
          dias_disponibles: diasDisponibles || undefined,
        });
      }
      onSuccess();
    } catch (err: unknown) {
      let msg: unknown = "Error al guardar el doctor";
      if (typeof err === "object" && err && "response" in err) {
        const r = (err as { response?: { data?: { message?: unknown } } }).response;
        msg = r?.data?.message ?? msg;
      }
      setErrorMessage(Array.isArray(msg) ? String(msg[0]) : typeof msg === "string" ? msg : String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? `Editar Doctor #${initialData?.id_doctor}` : "Nuevo Doctor"}
      </DialogTitle>
      <DialogContent dividers>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            fullWidth
            select
            label="Usuario"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value === "" ? "" : Number(e.target.value))}
            required
          >
            <MenuItem value="">Selecciona un usuario</MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id_usuario} value={u.id_usuario}>
                #{u.id_usuario} - {u.nombre_usuario}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Especialidad"
            value={idEspecialidad}
            onChange={(e) =>
              setIdEspecialidad(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          >
            <MenuItem value="">Selecciona una especialidad</MenuItem>
            {especialidades.map((e) => (
              <MenuItem key={e.id_especialidad} value={e.id_especialidad}>
                #{e.id_especialidad} - {e.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Horario inicio"
            type="time"
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Horario fin"
            type="time"
            value={horarioFin}
            onChange={(e) => setHorarioFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Días disponibles"
            value={diasDisponibles}
            onChange={(e) => setDiasDisponibles(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading || idUsuario === "" || idEspecialidad === ""}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}