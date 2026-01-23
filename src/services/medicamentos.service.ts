import { api } from "./api";

export type MedicamentoDto = {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedMedicamentos<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type MedicamentoQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
};

export async function getMedicamentos(
  params?: MedicamentoQueryParams
): Promise<PaginatedMedicamentos<MedicamentoDto>> {
  const { data } = await api.get("/medicamentos", { params });

  return {
    items: data.items.map((m: any) => ({
      id: m._id,
      nombre: m.nombre,
      descripcion: m.descripcion,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })),
    meta: data.meta,
  };
}

export async function getMedicamentoById(
  id: string
): Promise<MedicamentoDto> {
  const { data } = await api.get(`/medicamentos/${id}`);

  return {
    id: data._id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function createMedicamento(payload: {
  nombre: string;
  descripcion?: string;
}): Promise<MedicamentoDto> {
  const { data } = await api.post("/medicamentos", payload);

  return {
    id: data._id,
    nombre: data.nombre,
    descripcion: data.descripcion,
  };
}

export async function updateMedicamento(
  id: string,
  payload: {
    nombre?: string;
    descripcion?: string;
  }
): Promise<MedicamentoDto> {
  const { data } = await api.patch(`/medicamentos/${id}`, payload);

  return {
    id: data._id,
    nombre: data.nombre,
    descripcion: data.descripcion,
  };
}

export async function deleteMedicamento(
  id: string
): Promise<void> {
  await api.delete(`/medicamentos/${id}`);
}

