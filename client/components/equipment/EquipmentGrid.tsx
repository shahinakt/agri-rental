import { Tractor } from "lucide-react";

import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCardSkeleton } from "@/components/ui/Skeleton";
import type { Equipment } from "@/types";

interface EquipmentGridProps {
  equipment: Equipment[];
  isLoading: boolean;
}

export function EquipmentGrid({ equipment, isLoading }: EquipmentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <EquipmentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <Tractor className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          No Equipment Found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
}
