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
import {
  createEspecialidad,
  updateEspecialidad,
  type EspecialidadDto,
} from "../../services/especialidades.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: EspecialidadDto | null;
}

export function EspecialidadesFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setNombre(initialData?.nombre || "");
      setDescripcion(initialData?.descripcion || "");
    }
  }, [open, initialData]);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateEspecialidad(initialData.id_especialidad, { nombre, descripcion });
      } else {
        await createEspecialidad({ nombre, descripcion });
      }
      onSuccess();
    } catch (err: unknown) {
      let msg: unknown = "Error al guardar la especialidad";
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
        {isEditMode ? `Editar Especialidad #${initialData?.id_especialidad}` : "Nueva Especialidad"}
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
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={2}
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
          disabled={loading || !nombre.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
