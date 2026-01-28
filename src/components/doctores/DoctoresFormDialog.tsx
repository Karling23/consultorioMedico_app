import { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { createDoctor, updateDoctor, type DoctorDto } from "../../services/doctores.service";
import { getUsuarios, type UsuarioDto } from "../../services/usuarios.service";
import { getEspecialidades, type EspecialidadDto } from "../../services/especialidades.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DoctorDto | null;
}

type Option = { id: number; label: string };

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
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [idEspecialidad, setIdEspecialidad] = useState<number | null>(null);
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFin, setHorarioFin] = useState("");
  const [diasDisponibles, setDiasDisponibles] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdUsuario(initialData?.id_usuario ?? null);
      setIdEspecialidad(initialData?.id_especialidad ?? null);
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

  const usuarioOptions: Option[] = usuarios.map((u) => ({
    id: u.id_usuario,
    label: `#${u.id_usuario} - ${u.nombre_usuario}`,
  }));
  const especialidadOptions: Option[] = especialidades.map((e) => ({
    id: e.id_especialidad,
    label: `#${e.id_especialidad} - ${e.nombre}`,
  }));

  const selectedUsuario =
    idUsuario === null
      ? null
      : usuarioOptions.find((o) => o.id === idUsuario) || { id: idUsuario, label: `#${idUsuario}` };
  const selectedEspecialidad =
    idEspecialidad === null
      ? null
      : especialidadOptions.find((o) => o.id === idEspecialidad) ||
        { id: idEspecialidad, label: `#${idEspecialidad}` };

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (idUsuario === null || idEspecialidad === null) {
        setErrorMessage("Selecciona usuario y especialidad.");
        setLoading(false);
        return;
      }
      if (isEditMode && initialData) {
        await updateDoctor(initialData.id_doctor, {
          id_usuario: idUsuario,
          id_especialidad: idEspecialidad,
          horario_inicio: horarioInicio || undefined,
          horario_fin: horarioFin || undefined,
          dias_disponibles: diasDisponibles || undefined,
        });
      } else {
        await createDoctor({
          id_usuario: idUsuario,
          id_especialidad: idEspecialidad,
          horario_inicio: horarioInicio || undefined,
          horario_fin: horarioFin || undefined,
          dias_disponibles: diasDisponibles || "",
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
          <Autocomplete
            options={usuarioOptions}
            value={selectedUsuario}
            onChange={(_, option) => setIdUsuario(option?.id ?? null)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            openOnFocus
            renderInput={(params) => <TextField {...params} label="Usuario" required />}
          />

          <Autocomplete
            options={especialidadOptions}
            value={selectedEspecialidad}
            onChange={(_, option) => setIdEspecialidad(option?.id ?? null)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            openOnFocus
            renderInput={(params) => <TextField {...params} label="Especialidad" required />}
          />

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
            label="D?as disponibles"
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
          disabled={loading || idUsuario === null || idEspecialidad === null}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
