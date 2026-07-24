export type UserRole = "owner" | "farmer";

export type EquipmentCategory =
  | "tractor"
  | "harvester"
  | "rotavator"
  | "seeder"
  | "power_tiller"
  | "cultivator"
  | "sprayer";

export type BookingStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Equipment {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  category: EquipmentCategory;
  location: string;
  price_per_day: number;
  availability: boolean;
  image: string;
  created_at: string;
}

export interface PaginatedEquipment {
  items: Equipment[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Booking {
  id: number;
  equipment_id: number;
  farmer_id: number;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
}

export interface EquipmentFormValues {
  title: string;
  description: string;
  category: EquipmentCategory;
  location: string;
  price_per_day: number;
  image: string;
  availability: boolean;
}
