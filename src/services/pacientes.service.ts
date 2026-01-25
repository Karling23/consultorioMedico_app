import { api } from "./api";

// Definimos la interfaz del Paciente
export type PacienteDto = {
  id_paciente: number;
  id_usuario: number;
  cedula: string;
  fecha_nacimiento: string;
  telefono: string;
  direccion: string;
};

// Tipos para la paginación
export type PaginatedPacientes<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type PacientesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// --- API Methods ---

export async function getPacientes(params?: PacientesQueryParams): Promise<PaginatedPacientes<PacienteDto>> {
  // Asumo que la ruta en tu backend es /pacientes
  const { data } = await api.get("/pacientes", { params });
  return data;
}

export async function createPaciente(payload: Partial<PacienteDto>) {
  const { data } = await api.post("/pacientes", payload);
  return data;
}

export async function updatePaciente(id: number, payload: Partial<PacienteDto>) {
  const { data } = await api.patch(`/pacientes/${id}`, payload);
  return data;
}

export async function deletePaciente(id: number) {
  const { data } = await api.delete(`/pacientes/${id}`);
  return data;
}