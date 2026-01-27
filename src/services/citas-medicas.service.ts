import { api } from "./api";

export type CitaMedicaDto = {
    id_cita: number;
    id_paciente: number;
    id_doctor: number;
    id_consultorio: number;
    fecha_cita: string; 
    hora_cita: string; 
    estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | string;
    motivo?: string;
    fecha_creacion?: string;
};


export type PaginatedCitasMedicas<T> = {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
};

export type CitasMedicasQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
};


export async function getCitasMedicas(params?: CitasMedicasQueryParams): Promise<PaginatedCitasMedicas<CitaMedicaDto>> {
    const { data } = await api.get("/citas-medicas", { params });
    return data;
}

export async function createCitaMedica(payload: Partial<CitaMedicaDto>) {
    const { data } = await api.post("/citas-medicas", payload);
    return data;
}

export async function updateCitaMedica(id: number, payload: Partial<CitaMedicaDto>) {
    const { data } = await api.patch(`/citas-medicas/${id}`, payload);
    return data;
}

export async function deleteCitaMedica(id: number) {
    const { data } = await api.delete(`/citas-medicas/${id}`);
    return data;
}