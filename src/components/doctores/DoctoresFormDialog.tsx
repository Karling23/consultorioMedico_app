import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/material";
import { createDoctor, updateDoctor, type DoctorDto } from "../../services/doctores.service";

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
  const [diasDisponibles, setDiasDisponibles] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setDiasDisponibles(initialData?.dias_disponibles || "");
    }
  }, [open, initialData]);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateDoctor(initialData.id_doctor, { dias_disponibles: diasDisponibles });
      } else {
        await createDoctor({ dias_disponibles: diasDisponibles });
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
            label="Días disponibles"
            value={diasDisponibles}
            onChange={(e) => setDiasDisponibles(e.target.value)}
            required
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
          disabled={loading || !diasDisponibles.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
