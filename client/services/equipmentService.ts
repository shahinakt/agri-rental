import { api } from "@/services/api";
import type { Equipment, EquipmentFormValues, PaginatedEquipment } from "@/types";

export interface EquipmentListParams {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export async function listEquipment(params: EquipmentListParams): Promise<PaginatedEquipment> {
  const { data } = await api.get<PaginatedEquipment>("/equipment", { params });
  return data;
}

export async function getEquipment(id: number): Promise<Equipment> {
  const { data } = await api.get<Equipment>(`/equipment/${id}`);
  return data;
}

export async function createEquipment(payload: EquipmentFormValues): Promise<Equipment> {
  const { data } = await api.post<Equipment>("/equipment", payload);
  return data;
}

export async function updateEquipment(
  id: number,
  payload: Partial<EquipmentFormValues>
): Promise<Equipment> {
  const { data } = await api.put<Equipment>(`/equipment/${id}`, payload);
  return data;
}

export async function deleteEquipment(id: number): Promise<void> {
  await api.delete(`/equipment/${id}`);
}

export async function getMyEquipment(page = 1, page_size = 10): Promise<PaginatedEquipment> {
  const { data } = await api.get<PaginatedEquipment>("/users/me/equipment", {
    params: { page, page_size },
  });
  return data;
}
