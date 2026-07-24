"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { EquipmentFilters, type EquipmentFilterValues } from "@/components/equipment/EquipmentFilters";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { Pagination } from "@/components/ui/Pagination";
import { listEquipment } from "@/services/equipmentService";
import { PAGE_SIZE } from "@/constants";
import type { Equipment } from "@/types";

export default function BrowseEquipment() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const filters: EquipmentFilterValues = {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    location: searchParams.get("location") ?? "",
    sort: searchParams.get("sort") ?? "",
  };
  const page = Number(searchParams.get("page") ?? "1");

  const updateUrl = useCallback(
    (next: EquipmentFilterValues, nextPage: number) => {
      const params = new URLSearchParams();
      if (next.search) params.set("search", next.search);
      if (next.category) params.set("category", next.category);
      if (next.location) params.set("location", next.location);
      if (next.sort) params.set("sort", next.sort);
      if (nextPage > 1) params.set("page", String(nextPage));
      router.push(`/?${params.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setIsLoading(true);
      listEquipment({
        search: filters.search || undefined,
        category: filters.category || undefined,
        location: filters.location || undefined,
        sort: filters.sort || undefined,
        page,
        page_size: PAGE_SIZE,
      })
        .then((data) => {
          setEquipment(data.items);
          setTotalPages(data.total_pages);
        })
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category, filters.location, filters.sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Find Equipment to Rent
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Browse tractors, harvesters, and more from equipment owners near you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-1">
        <EquipmentFilters values={filters} onChange={(next) => updateUrl(next, 1)} />
</div>

        <div className="lg:col-span-3">
          <EquipmentGrid equipment={equipment} isLoading={isLoading} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => updateUrl(filters, nextPage)}
          />
        </div>
      </div>
    </div>
  );
}
