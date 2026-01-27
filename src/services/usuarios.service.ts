import { api } from "./api";

export type UsuarioDto = {
    id_usuario: number;
    nombre_usuario: string;
    rol: string;
    fecha_creacion?: string;
    profile?: string | null;
};

export type PaginatedResult<T> = {
    items: T[];
    meta: {
        totalItems?: number;
        itemCount?: number;
        itemsPerPage?: number;
        totalPages?: number;
        currentPage?: number;
    };
};

type RawUsuario = {
    id_usuario?: number;
    nombre_usuario?: string;
    rol?: string;
    fecha_creacion?: string;
    profile?: string | null;
};

export async function getUsuarios(params?: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<PaginatedResult<UsuarioDto>> {
    const { data } = await api.get("/usuarios", { params });

    const payload = data?.data ?? data;
    const items = Array.isArray(payload?.items) ? (payload.items as RawUsuario[]) : [];
    const meta = payload?.meta ?? {};

    return {
        items: items.map((u) => ({
            id_usuario: u.id_usuario,
            nombre_usuario: u.nombre_usuario,
            rol: u.rol,
            fecha_creacion: u.fecha_creacion,
            profile: u.profile ?? null,
        })),
        meta,
    };
}

export async function createUsuario(payload: {
    nombre_usuario: string;
    password: string;
    rol?: string;
}): Promise<UsuarioDto> {
    const { data } = await api.post("/usuarios", payload);
    const u = data?.data ?? data;
    return {
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        rol: u.rol,
        fecha_creacion: u.fecha_creacion,
        profile: u.profile ?? null,
    };
}

export async function updateUsuario(
    id: number,
    payload: {
        nombre_usuario?: string;
        password?: string;
        rol?: string;
    }
): Promise<UsuarioDto> {
    const { data } = await api.put(`/usuarios/${id}`, payload);
    const u = data?.data ?? data;
    return {
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        rol: u.rol,
        fecha_creacion: u.fecha_creacion,
        profile: u.profile ?? null,
    };
}

export async function deleteUsuario(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
}
