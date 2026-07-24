"use client";

import { Search } from "lucide-react";

import { Input, Select } from "@/components/ui/Input";
import { EQUIPMENT_CATEGORIES, SORT_OPTIONS } from "@/constants";

export interface EquipmentFilterValues {
  search: string;
  category: string;
  location: string;
  sort: string;
}

interface EquipmentFiltersProps {
  values: EquipmentFilterValues;
  onChange: (values: EquipmentFilterValues) => void;
}

export function EquipmentFilters({ values, onChange }: EquipmentFiltersProps) {
  function update<K extends keyof EquipmentFilterValues>(key: K, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <aside className="space-y-5 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 h-fit sticky top-20">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search equipment..."
            className="pl-9"
            value={values.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Select
          label="Category"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          label="Location"
          placeholder="e.g. Nashik"
          value={values.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </div>

      <div>
        <Select label="Sort By" value={values.sort} onChange={(e) => update("sort", e.target.value)}>
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <button
        onClick={() => onChange({ search: "", category: "", location: "", sort: "" })}
        className="text-sm text-primary-700 dark:text-primary-400 hover:underline"
      >
        Clear filters
      </button>
    </aside>
  );
}
