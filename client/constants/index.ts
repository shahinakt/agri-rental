import type { EquipmentCategory } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const TOKEN_STORAGE_KEY = "agri_rental_token";
export const USER_STORAGE_KEY = "agri_rental_user";

export const EQUIPMENT_CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: "tractor", label: "Tractor" },
  { value: "harvester", label: "Harvester" },
  { value: "rotavator", label: "Rotavator" },
  { value: "seeder", label: "Seeder" },
  { value: "power_tiller", label: "Power Tiller" },
  { value: "cultivator", label: "Cultivator" },
  { value: "sprayer", label: "Sprayer" },
];

export const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export const PAGE_SIZE = 10;
