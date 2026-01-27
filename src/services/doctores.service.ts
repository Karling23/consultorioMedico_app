import { api } from "./api";

export type DoctorDto = {
  id_doctor: number;
  dias_disponibles: string;
};

export type PaginatedDoctores<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type DoctoresQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: "ASC" | "DESC";
};

export async function getDoctores(
  params?: DoctoresQueryParams
): Promise<PaginatedDoctores<DoctorDto>> {
  const { data } = await api.get("/doctores", { params });
  return data;
}

export async function getDoctorById(id: number): Promise<DoctorDto> {
  const { data } = await api.get(`/doctores/${id}`);
  return data;
}

export async function createDoctor(payload: {
  dias_disponibles: string;
}): Promise<DoctorDto> {
  const { data } = await api.post("/doctores", payload);
  return data;
}

export async function updateDoctor(
  id: number,
  payload: { dias_disponibles?: string }
): Promise<DoctorDto> {
  const { data } = await api.patch(`/doctores/${id}`, payload);
  return data;
}

export async function deleteDoctor(id: number): Promise<void> {
  await api.delete(`/doctores/${id}`);
}
