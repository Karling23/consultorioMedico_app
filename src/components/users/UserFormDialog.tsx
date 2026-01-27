import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useState, type JSX, type FormEvent } from "react";
import type { UsuarioDto } from "../../services/usuarios.service";

type Props = {
    open: boolean;
    mode: "create" | "edit";
    initial?: UsuarioDto | null;
    onClose: () => void;
    onSubmit: (payload: {
        nombre_usuario: string;
        password?: string;
        rol?: string;
    }) => void;
};

export default function UserFormDialog({
    open,
    mode,
    initial,
    onClose,
    onSubmit,
}: Props): JSX.Element {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");

    useEffect(() => {
        if (open) {
            /* eslint-disable react-hooks/set-state-in-effect */
            setNombreUsuario(initial?.nombre_usuario || "");
            setRol(initial?.rol || "");
            setPassword("");
            /* eslint-enable react-hooks/set-state-in-effect */
        }
    }, [open, initial]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            nombre_usuario: nombreUsuario.trim(),
            password: password.trim() || undefined,
            rol: rol.trim() || undefined,
        });
    };

    const isCreate = mode === "create";

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isCreate ? "Nuevo usuario" : "Editar usuario"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        label="Usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                        autoFocus
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={isCreate}
                        helperText={isCreate ? undefined : "Deja en blanco para mantener la contraseña actual"}
                    />

                    <TextField
                        label="Rol"
                        select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required={isCreate}
                    >
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="usuario">usuario</MenuItem>
                        <MenuItem value="paciente">paciente</MenuItem>
                    </TextField>

                    <DialogActions sx={{ px: 0 }}>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!nombreUsuario.trim() || (isCreate && !password.trim())}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
