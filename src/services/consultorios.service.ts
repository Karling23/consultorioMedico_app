import { api } from "./api";

// Definición de Tipos
export type ConsultorioDto = {
  id_consultorio: number;
  nombre: string;
  ubicacion: string;
  estado: "activo" | "inactivo" | string;
};

export type PaginatedConsultorios<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type ConsultoriosQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// --- Métodos API ---

export async function getConsultorios(params?: ConsultoriosQueryParams): Promise<PaginatedConsultorios<ConsultorioDto>> {
  // Asumo que la ruta en backend es /consultorios
  const { data } = await api.get("/consultorios", { params });
  return data;
}

export async function createConsultorio(payload: Partial<ConsultorioDto>) {
  const { data } = await api.post("/consultorios", payload);
  return data;
}

export async function updateConsultorio(id: number, payload: Partial<ConsultorioDto>) {
  const { data } = await api.put(`/consultorios/${id}`, payload);
  return data;
}

export async function deleteConsultorio(id: number) {
  const { data } = await api.delete(`/consultorios/${id}`);
  return data;
}
