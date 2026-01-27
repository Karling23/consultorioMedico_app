import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useState, type JSX, type FormEvent } from "react";
import type { HistorialClinicoDto } from "../../services/historial-clinico.service";

type Props = {
    open: boolean;
    mode: "create" | "edit";
    initial?: HistorialClinicoDto | null;
    onClose: () => void;
    onSubmit: (payload: {
        id_cita: number;
        diagnostico: string;
        tratamiento: string;
        observaciones: string;
    }) => void;
};

export default function HistorialClinicoFormDialog({
    open,
    mode,
    initial,
    onClose,
    onSubmit,
}: Props): JSX.Element {
    const [idCita, setIdCita] = useState<number>(0);
    const [diagnostico, setDiagnostico] = useState("");
    const [tratamiento, setTratamiento] = useState("");
    const [observaciones, setObservaciones] = useState("");

    useEffect(() => {
        if (open) {
            /* eslint-disable react-hooks/set-state-in-effect */
            setIdCita(Number(initial?.id_cita ?? 0));
            setDiagnostico(initial?.diagnostico || "");
            setTratamiento(initial?.tratamiento || "");
            setObservaciones(initial?.observaciones || "");
            /* eslint-enable react-hooks/set-state-in-effect */
        }
    }, [open, initial]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            id_cita: Number(idCita),
            diagnostico: diagnostico.trim(),
            tratamiento: tratamiento.trim(),
            observaciones: observaciones.trim(),
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {mode === "create" ? "Nuevo historial clinico" : "Editar historial clinico"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        label="Id cita"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={idCita}
                        onChange={(e) => setIdCita(Number(e.target.value))}
                        required
                        disabled={mode === "edit"}
                    />

                    <TextField
                        label="Diagnostico"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                        required
                    />

                    <TextField
                        label="Tratamiento"
                        value={tratamiento}
                        onChange={(e) => setTratamiento(e.target.value)}
                        required
                        multiline
                        rows={2}
                    />

                    <TextField
                        label="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        required
                        multiline
                        rows={3}
                    />

                    <DialogActions sx={{ px: 0 }}>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!idCita || !diagnostico.trim() || !tratamiento.trim()}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
