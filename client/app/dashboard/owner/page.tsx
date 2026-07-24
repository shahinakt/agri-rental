"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { EquipmentForm } from "@/components/equipment/EquipmentForm";
import { OwnerEquipmentList } from "@/components/dashboard/OwnerEquipmentList";
import { OwnerBookingRequests } from "@/components/dashboard/OwnerBookingRequests";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";
import { createEquipment, getMyEquipment, updateEquipment } from "@/services/equipmentService";
import { listBookings } from "@/services/bookingService";
import type { Booking, Equipment, EquipmentFormValues } from "@/types";

type Tab = "equipment" | "requests";

export default function OwnerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("equipment");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "owner")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "owner") return;

    Promise.all([getMyEquipment(1, 100), listBookings()])
      .then(([equipmentRes, bookingsRes]) => {
        setEquipment(equipmentRes.items);
        setBookings(bookingsRes);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const equipmentMap = Object.fromEntries(equipment.map((e) => [e.id, e]));

  async function handleFormSubmit(values: EquipmentFormValues) {
    setIsSubmitting(true);
    try {
      if (editingEquipment) {
        const updated = await updateEquipment(editingEquipment.id, values);
        setEquipment((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        toast.success("Equipment updated");
      } else {
        const created = await createEquipment(values);
        setEquipment((prev) => [created, ...prev]);
        toast.success("Equipment listed successfully");
      }
      setIsFormOpen(false);
      setEditingEquipment(undefined);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Owner Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your equipment and bookings</p>
        </div>
        {tab === "equipment" && (
          <Button
            onClick={() => {
              setEditingEquipment(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        )}
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800">
        {(["equipment", "requests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t
                ? "border-primary-600 text-primary-700 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            {t === "equipment" ? "My Equipment" : "Booking Requests"}
          </button>
        ))}
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {editingEquipment ? "Edit Equipment" : "New Equipment"}
            </h3>
            <button onClick={() => setIsFormOpen(false)} aria-label="Close">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <EquipmentForm
            defaultValues={editingEquipment}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            submitLabel={editingEquipment ? "Update Equipment" : "List Equipment"}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : tab === "equipment" ? (
        <OwnerEquipmentList
          equipment={equipment}
          onEdit={(item) => {
            setEditingEquipment(item);
            setIsFormOpen(true);
          }}
          onDeleted={(id) => setEquipment((prev) => prev.filter((e) => e.id !== id))}
        />
      ) : (
        <OwnerBookingRequests
          bookings={bookings}
          equipmentMap={equipmentMap}
          onUpdated={(updated) =>
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
          }
        />
      )}
    </div>
  );
}
