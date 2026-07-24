"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FarmerBookingList } from "@/components/dashboard/FarmerBookingList";
import { useAuth } from "@/context/AuthContext";
import { listBookings } from "@/services/bookingService";
import { getEquipment } from "@/services/equipmentService";
import type { Booking, Equipment } from "@/types";

export default function FarmerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [equipmentMap, setEquipmentMap] = useState<Record<number, Equipment>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "farmer")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "farmer") return;

    listBookings()
      .then(async (bookingsRes) => {
        setBookings(bookingsRes);
        const uniqueEquipmentIds = Array.from(new Set(bookingsRes.map((b) => b.equipment_id)));
        const equipmentList = await Promise.all(uniqueEquipmentIds.map((id) => getEquipment(id)));
        setEquipmentMap(Object.fromEntries(equipmentList.map((e) => [e.id, e])));
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track the status of your equipment rentals</p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : (
        <FarmerBookingList bookings={bookings} equipmentMap={equipmentMap} />
      )}
    </div>
  );
}
