import { api } from "./api";

export type HistorialClinicoDto = {
    id: string;
    id_cita: number;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
    createdAt?: string;
    updatedAt?: string;
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

type RawHistorialClinico = {
    _id?: string;
    id?: string;
    id_cita?: number | string;
    diagnostico?: string;
    tratamiento?: string;
    observaciones?: string;
    createdAt?: string;
    updatedAt?: string;
};

export async function getHistorialClinico(params?: {
    page?: number;
    limit?: number;
    search?: string;
    searchField?: string;
    sort?: string;
    order?: "ASC" | "DESC";
}): Promise<PaginatedResult<HistorialClinicoDto>> {
    const { data } = await api.get("/historial-clinico", { params });
    const payload = data?.data ?? data;
    const items = Array.isArray(payload?.items)
        ? (payload.items as RawHistorialClinico[])
        : [];
    const meta = payload?.meta ?? {};

    return {
        items: items.map((h) => ({
            id: h._id ?? h.id,
            id_cita: Number(h.id_cita),
            diagnostico: h.diagnostico,
            tratamiento: h.tratamiento,
            observaciones: h.observaciones,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt,
        })),
        meta,
    };
}

export async function createHistorialClinico(payload: {
    id_cita: number;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
}): Promise<HistorialClinicoDto> {
    const { data } = await api.post("/historial-clinico", payload);
    return {
        id: data._id ?? data.id,
        id_cita: Number(data.id_cita),
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
        observaciones: data.observaciones,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}

export async function updateHistorialClinico(
    id: string,
    payload: {
        diagnostico?: string;
        tratamiento?: string;
        observaciones?: string;
    }
): Promise<HistorialClinicoDto> {
    const { data } = await api.put(`/historial-clinico/${id}`, payload);
    return {
        id: data._id ?? data.id,
        id_cita: Number(data.id_cita),
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
        observaciones: data.observaciones,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}

export async function deleteHistorialClinico(id: string): Promise<void> {
    await api.delete(`/historial-clinico/${id}`);
}
