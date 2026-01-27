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
  TextField,
} from "@mui/material";
import {
  createReceta,
  updateReceta,
  type RecetaDto,
} from "../../services/recetas.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: RecetaDto | null;
}

export function RecetasFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setDescripcion("");
    }
  }, [open, initialData]);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isEditMode && initialData) {
        await updateReceta(initialData.id_receta, { descripcion });
      } else {
        await createReceta({ descripcion });
      }
      onSuccess();
    } catch (err: unknown) {
      let msg: unknown = "Error al guardar la receta";
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
        {isEditMode ? `Editar Receta #${initialData?.id_receta}` : "Nueva Receta"}
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
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
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
          disabled={loading || !descripcion.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
