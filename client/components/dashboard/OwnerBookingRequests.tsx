"use client";

import { toast } from "sonner";

import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/services/api";
import { updateBookingStatus } from "@/services/bookingService";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, Equipment } from "@/types";

interface OwnerBookingRequestsProps {
  bookings: Booking[];
  equipmentMap: Record<number, Equipment>;
  onUpdated: (booking: Booking) => void;
}

export function OwnerBookingRequests({ bookings, equipmentMap, onUpdated }: OwnerBookingRequestsProps) {
  async function handleUpdate(id: number, status: "approved" | "rejected") {
    try {
      const updated = await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      onUpdated(updated);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        No booking requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const equipment = equipmentMap[booking.equipment_id];
        return (
          <div
            key={booking.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
          >
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {equipment?.title ?? `Equipment #${booking.equipment_id}`}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {formatDate(booking.start_date)} — {formatDate(booking.end_date)} ·{" "}
                {formatCurrency(booking.total_price)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {booking.status === "pending" ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => handleUpdate(booking.id, "rejected")}>
                    Reject
                  </Button>
                  <Button size="sm" onClick={() => handleUpdate(booking.id, "approved")}>
                    Approve
                  </Button>
                </>
              ) : (
                <BookingStatusBadge status={booking.status} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
