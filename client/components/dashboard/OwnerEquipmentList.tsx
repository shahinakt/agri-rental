"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/services/api";
import { deleteEquipment } from "@/services/equipmentService";
import { formatCurrency, categoryLabel } from "@/lib/utils";
import type { Equipment } from "@/types";

interface OwnerEquipmentListProps {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDeleted: (id: number) => void;
}

export function OwnerEquipmentList({ equipment, onEdit, onDeleted }: OwnerEquipmentListProps) {
  async function handleDelete(id: number) {
    if (!confirm("Delete this equipment listing? This cannot be undone.")) return;

    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted");
      onDeleted(id);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        You haven&apos;t listed any equipment yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {equipment.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900"
        >
          <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge tone="gray">{categoryLabel(item.category)}</Badge>
              <Badge tone={item.availability ? "green" : "red"}>
                {item.availability ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="font-semibold text-primary-700 dark:text-primary-400">
              {formatCurrency(item.price_per_day)}
            </div>
            <div className="text-xs text-gray-500">/ day</div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => onEdit(item)} aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)} aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
