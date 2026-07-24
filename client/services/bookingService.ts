import { api } from "@/services/api";
import type { Booking, BookingStatus } from "@/types";

export interface CreateBookingPayload {
  equipment_id: number;
  start_date: string;
  end_date: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await api.post<Booking>("/booking", payload);
  return data;
}

export async function listBookings(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/bookings");
  return data;
}

export async function updateBookingStatus(
  id: number,
  status: BookingStatus
): Promise<Booking> {
  const { data } = await api.patch<Booking>(`/booking/${id}`, { status });
  return data;
}
