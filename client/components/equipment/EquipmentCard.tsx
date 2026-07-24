import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { formatCurrency, categoryLabel } from "@/lib/utils";
import type { Equipment } from "@/types";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <Link
      href={`/equipment/${equipment.id}`}
      className="group rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={equipment.image}
          alt={equipment.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge tone={equipment.availability ? "green" : "red"}>
            {equipment.availability ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {equipment.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Badge tone="gray">{categoryLabel(equipment.category)}</Badge>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {equipment.location}
          </span>
        </div>

        <div className="pt-1 flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
            {formatCurrency(equipment.price_per_day)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">/ day</span>
        </div>
      </div>
    </Link>
  );
}
