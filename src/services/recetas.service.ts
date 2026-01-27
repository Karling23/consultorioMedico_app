import { api } from "./api";

export type RecetaDto = {
  id_receta: number;
  id_historial: number;
  fecha_emision?: string;
};

export type PaginatedRecetas<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type RecetasQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
};

export async function getRecetas(
  params?: RecetasQueryParams
): Promise<PaginatedRecetas<RecetaDto>> {
  const { data } = await api.get("/recetas", { params });
  return data;
}

export async function getRecetaById(id: number): Promise<RecetaDto> {
  const { data } = await api.get(`/recetas/${id}`);
  return data;
}

export async function createReceta(payload: {
  id_historial: number;
  fecha_emision?: string;
}): Promise<RecetaDto> {
  const { data } = await api.post("/recetas", payload);
  return data;
}

export async function updateReceta(
  id: number,
  payload: {
    id_historial?: number;
    fecha_emision?: string;
  }
): Promise<RecetaDto> {
  const { data } = await api.patch(`/recetas/${id}`, payload);
  return data;
}

export async function deleteReceta(id: number): Promise<void> {
  await api.delete(`/recetas/${id}`);
}
