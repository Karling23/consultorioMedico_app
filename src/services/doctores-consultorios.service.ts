import { api } from "./api";

export type DoctoresConsultorioDto = {
  id: number;
  id_doctor: number;
  id_consultorio: number;
};

export type PaginatedDoctoresConsultorios<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type DoctoresConsultoriosQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
};

export async function getDoctoresConsultorios(
  params?: DoctoresConsultoriosQueryParams
): Promise<PaginatedDoctoresConsultorios<DoctoresConsultorioDto>> {
  const { data } = await api.get("/doctoresConsultorios", { params });
  return data;
}

export async function getDoctoresConsultorioById(id: number): Promise<DoctoresConsultorioDto> {
  const { data } = await api.get(`/doctoresConsultorios/${id}`);
  return data;
}

export async function createDoctoresConsultorio(payload: {
  id_doctor: number;
  id_consultorio: number;
}): Promise<DoctoresConsultorioDto> {
  const { data } = await api.post("/doctoresConsultorios", payload);
  return data;
}

export async function updateDoctoresConsultorio(
  id: number,
  payload: { id_doctor?: number; id_consultorio?: number }
): Promise<DoctoresConsultorioDto> {
  const { data } = await api.patch(`/doctoresConsultorios/${id}`, payload);
  return data;
}

export async function deleteDoctoresConsultorio(id: number): Promise<void> {
  await api.delete(`/doctoresConsultorios/${id}`);
}
