import { api } from "./api";

export type EspecialidadDto = {
  id_especialidad: number;
  nombre: string;
  descripcion?: string;
};

export type PaginatedEspecialidades<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type EspecialidadesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
};

export async function getEspecialidades(
  params?: EspecialidadesQueryParams
): Promise<PaginatedEspecialidades<EspecialidadDto>> {
  const { data } = await api.get("/especialidades", { params });
  return data;
}

export async function getEspecialidadById(id: number): Promise<EspecialidadDto> {
  const { data } = await api.get(`/especialidades/${id}`);
  return data;
}

export async function createEspecialidad(payload: {
  nombre: string;
  descripcion?: string;
}): Promise<EspecialidadDto> {
  const { data } = await api.post("/especialidades", payload);
  return data;
}

export async function updateEspecialidad(
  id: number,
  payload: { nombre?: string; descripcion?: string }
): Promise<EspecialidadDto> {
  const { data } = await api.patch(`/especialidades/${id}`, payload);
  return data;
}

export async function deleteEspecialidad(id: number): Promise<void> {
  await api.delete(`/especialidades/${id}`);
}
