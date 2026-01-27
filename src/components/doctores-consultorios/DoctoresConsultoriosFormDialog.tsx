import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  createDoctoresConsultorio,
  updateDoctoresConsultorio,
  type DoctoresConsultorioDto,
} from "../../services/doctores-consultorios.service";
import { getDoctores, type DoctorDto } from "../../services/doctores.service";
import {
  getConsultorios,
  type ConsultorioDto,
  type PaginatedConsultorios,
} from "../../services/consultorios.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DoctoresConsultorioDto | null;
}

export function DoctoresConsultoriosFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [idDoctor, setIdDoctor] = useState<number | "">("");
  const [idConsultorio, setIdConsultorio] = useState<number | "">("");
  const isEditMode = !!initialData;
  const [doctores, setDoctores] = useState<DoctorDto[]>([]);
  const [consultorios, setConsultorios] = useState<ConsultorioDto[]>([]);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdDoctor(initialData?.id_doctor ?? "");
      setIdConsultorio(initialData?.id_consultorio ?? "");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [doctoresRes, consultoriosRes] = await Promise.all([
          getDoctores({ page: 1, limit: 100 }),
          getConsultorios({ page: 1, limit: 100 }),
        ]);
        setDoctores(doctoresRes.items);
        setConsultorios(
          (consultoriosRes as PaginatedConsultorios<ConsultorioDto>).items ?? []
        );
      } catch {
        setDoctores([]);
        setConsultorios([]);
      }
    })();
  }, [open]);

  const onSubmit = async () => {
    if (idDoctor === "" || idConsultorio === "") {
      setErrorMessage("Debe completar ambos IDs.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateDoctoresConsultorio(initialData.id, {
          id_doctor: Number(idDoctor),
          id_consultorio: Number(idConsultorio),
        });
      } else {
        await createDoctoresConsultorio({
          id_doctor: Number(idDoctor),
          id_consultorio: Number(idConsultorio),
        });
      }
      onSuccess();
    } catch (err: unknown) {
      let msg: unknown = "Error al guardar";
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
        {isEditMode ? `Editar Registro #${initialData?.id}` : "Nuevo Registro"}
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
            label="Doctor"
            value={idDoctor}
            onChange={(e) => setIdDoctor(e.target.value === "" ? "" : Number(e.target.value))}
            required
          >
            <MenuItem value="">Selecciona un doctor</MenuItem>
            {doctores.map((d) => (
              <MenuItem key={d.id_doctor} value={d.id_doctor}>
                #{d.id_doctor} - {d.dias_disponibles}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Consultorio"
            value={idConsultorio}
            onChange={(e) => setIdConsultorio(e.target.value === "" ? "" : Number(e.target.value))}
            required
          >
            <MenuItem value="">Selecciona un consultorio</MenuItem>
            {consultorios.map((c) => (
              <MenuItem key={c.id_consultorio} value={c.id_consultorio}>
                #{c.id_consultorio} - {c.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading || idDoctor === "" || idConsultorio === ""}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
