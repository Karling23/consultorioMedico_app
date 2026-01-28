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
  const [idDoctor, setIdDoctor] = useState<number | null>(null);
  const [idConsultorio, setIdConsultorio] = useState<number | null>(null);
  const isEditMode = !!initialData;
  const [doctores, setDoctores] = useState<DoctorDto[]>([]);
  const [consultorios, setConsultorios] = useState<ConsultorioDto[]>([]);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdDoctor(initialData?.id_doctor ?? null);
      setIdConsultorio(initialData?.id_consultorio ?? null);
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
    if (idDoctor === null || idConsultorio === null) {
      setErrorMessage("Debe completar ambos IDs.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateDoctoresConsultorio(initialData.id, {
          id_doctor: idDoctor,
          id_consultorio: idConsultorio,
        });
      } else {
        await createDoctoresConsultorio({
          id_doctor: idDoctor,
          id_consultorio: idConsultorio,
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading || idDoctor === null || idConsultorio === null}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
