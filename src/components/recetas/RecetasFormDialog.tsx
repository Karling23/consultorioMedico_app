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
  Stack,
  TextField,
} from "@mui/material";
import {
  createReceta,
  updateReceta,
  type RecetaDto,
} from "../../services/recetas.service";
import {
  getHistorialClinico,
  type HistorialClinicoDto,
} from "../../services/historial-clinico.service";

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
  const [idHistorial, setIdHistorial] = useState<number | "">("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [historialItems, setHistorialItems] = useState<HistorialClinicoDto[]>([]);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdHistorial(initialData?.id_historial ?? "");
      setFechaEmision(initialData?.fecha_emision || "");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await getHistorialClinico({ page: 1, limit: 100 });
        setHistorialItems(res.items);
      } catch {
        setHistorialItems([]);
      }
    })();
  }, [open]);

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (idHistorial === "") {
        setErrorMessage("Selecciona un historial clínico.");
        setLoading(false);
        return;
      }
      if (isEditMode && initialData) {
        await updateReceta(initialData.id_receta, {
          id_historial: Number(idHistorial),
          fecha_emision: fechaEmision || undefined,
        });
      } else {
        await createReceta({
          id_historial: Number(idHistorial),
          fecha_emision: fechaEmision || undefined,
        });
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
            select
            label="Historial clínico"
            value={idHistorial}
            onChange={(e) => setIdHistorial(e.target.value === "" ? "" : Number(e.target.value))}
            required
          >
            <MenuItem value="">Selecciona un historial</MenuItem>
            {historialItems.map((h) => (
              <MenuItem key={h.id} value={Number(h.id)}>
                #{h.id} - {h.diagnostico}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Fecha de emisión"
            type="date"
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
          disabled={loading || idHistorial === ""}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}