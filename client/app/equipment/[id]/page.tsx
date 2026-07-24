"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { BookingForm } from "@/components/booking/BookingForm";
import { getEquipment } from "@/services/equipmentService";
import { formatCurrency, categoryLabel, formatDate } from "@/lib/utils";
import type { Equipment } from "@/types";

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getEquipment(Number(params.id))
      .then(setEquipment)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-80 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !equipment) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Equipment not found</h1>
        <p className="text-gray-500 mt-2">This listing may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image src={equipment.image} alt={equipment.title} fill className="object-cover" />
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{equipment.title}</h1>
            <Badge tone={equipment.availability ? "green" : "red"}>
              {equipment.availability ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <Badge tone="gray">{categoryLabel(equipment.category)}</Badge>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {equipment.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Listed {formatDate(equipment.created_at)}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-primary-700 dark:text-primary-400">
              {formatCurrency(equipment.price_per_day)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> / day</span>
          </div>

          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {equipment.description}
          </p>

          <div className="mt-6">
            <BookingForm equipment={equipment} />
          </div>
        </div>
      </div>
    </div>
  );
}
