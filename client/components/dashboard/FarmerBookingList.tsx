import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, Equipment } from "@/types";

interface FarmerBookingListProps {
  bookings: Booking[];
  equipmentMap: Record<number, Equipment>;
}

export function FarmerBookingList({ bookings, equipmentMap }: FarmerBookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        You haven&apos;t made any bookings yet.
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
                {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="font-semibold text-primary-700 dark:text-primary-400">
                {formatCurrency(booking.total_price)}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
