import {
    Autocomplete,
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
import { getCitasMedicas, type CitaMedicaDto } from "../../services/citas-medicas.service";

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
    const [idCita, setIdCita] = useState<number | null>(null);
    const [diagnostico, setDiagnostico] = useState("");
    const [tratamiento, setTratamiento] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [citas, setCitas] = useState<CitaMedicaDto[]>([]);

    useEffect(() => {
        if (open) {
            /* eslint-disable react-hooks/set-state-in-effect */
            setIdCita(initial?.id_cita ? Number(initial.id_cita) : null);
            setDiagnostico(initial?.diagnostico || "");
            setTratamiento(initial?.tratamiento || "");
            setObservaciones(initial?.observaciones || "");
            /* eslint-enable react-hooks/set-state-in-effect */
        }
    }, [open, initial]);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const res = await getCitasMedicas({ page: 1, limit: 100 });
                setCitas(res.items);
            } catch {
                setCitas([]);
            }
        })();
    }, [open]);

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
                    <Autocomplete
                        options={citas.map((c) => ({
                            id: c.id_cita,
                            label: `#${c.id_cita} - ${c.fecha_cita} ${c.hora_cita}`,
                        }))}
                        value={
                            idCita === null
                                ? null
                                : citas
                                      .map((c) => ({
                                          id: c.id_cita,
                                          label: `#${c.id_cita} - ${c.fecha_cita} ${c.hora_cita}`,
                                      }))
                                      .find((o) => o.id === idCita) || { id: idCita, label: `#${idCita}` }
                        }
                        onChange={(_, option) => setIdCita(option?.id ?? null)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.label}
                        openOnFocus
                        disabled={mode === "edit"}
                        renderInput={(params) => (
                            <TextField {...params} label="Id cita" required />
                        )}
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
