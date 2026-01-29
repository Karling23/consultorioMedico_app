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

type Option = { id: string; label: string };

export function RecetasFormDialog({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [idHistorial, setIdHistorial] = useState<string | null>(null);
  const [fechaEmision, setFechaEmision] = useState("");
  const [historialItems, setHistorialItems] = useState<HistorialClinicoDto[]>([]);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIdHistorial(initialData?.id_historial ?? null);
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

  const historialOptions: Option[] = historialItems.map((h) => ({
    id: String(h.id),
    label: `#${h.id} - ${h.diagnostico}`,
  }));

  const selectedHistorial =
    idHistorial === null
      ? null
      : historialOptions.find((o) => o.id === idHistorial) ||
        { id: idHistorial, label: `#${idHistorial}` };

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (idHistorial === null) {
        setErrorMessage("Selecciona un historial cl?nico.");
        setLoading(false);
        return;
      }
      if (isEditMode && initialData) {
        await updateReceta(initialData.id_receta, {
          id_historial: idHistorial,
          fecha_emision: fechaEmision || undefined,
        });
      } else {
        await createReceta({
          id_historial: idHistorial,
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
          <Autocomplete
            options={historialOptions}
            value={selectedHistorial}
            onChange={(_, option) => setIdHistorial(option?.id ?? null)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            openOnFocus
            renderInput={(params) => (
              <TextField {...params} label="Historial cl?nico" required />
            )}
          />

          <TextField
            fullWidth
            label="Fecha de emisi?n"
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
          disabled={loading || idHistorial === null}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
