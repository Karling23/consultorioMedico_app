import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState, type JSX } from "react";
import { type MedicamentoDto } from "../../services/medicamentos.service";


type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: MedicamentoDto | null;
  onClose: () => void;
  onSubmit: (payload: {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
  }) => void;
};

export default function MedicamentoFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props): JSX.Element {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setNombre(initial?.nombre || "");
      setDescripcion(initial?.descripcion || "");
      setPrecio(typeof initial?.precio === "number" ? initial.precio : Number(initial?.precio ?? 0));
      setStock(typeof initial?.stock === "number" ? initial.stock : Number(initial?.stock ?? 0));
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      precio,
      stock,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Nuevo medicamento" : "Editar medicamento"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoFocus
          />

          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
          />

          <TextField
            label="Precio"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            required
          />

          <TextField
            label="Stock"
            type="number"
            inputProps={{ min: 0 }}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!nombre.trim() || precio <= 0 || stock < 0}
            >
              Guardar
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
