"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/bookingService";
import { getErrorMessage } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import type { Equipment } from "@/types";

const bookingSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be on or after start date",
    path: ["end_date"],
  });

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm({ equipment }: { equipment: Equipment }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema) });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const estimatedTotal = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return null;
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days * equipment.price_per_day;
  }, [startDate, endDate, equipment.price_per_day]);

  async function onSubmit(values: BookingValues) {
    if (!isAuthenticated) {
      toast.info("Please log in to book equipment");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({ equipment_id: equipment.id, ...values });
      toast.success("Booking request sent! The owner will review it shortly.");
      router.push("/dashboard/farmer");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user?.role === "owner") {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Book this equipment</h3>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Date" type="date" min={today} error={errors.start_date?.message} {...register("start_date")} />
        <Input label="End Date" type="date" min={today} error={errors.end_date?.message} {...register("end_date")} />
      </div>

      {estimatedTotal !== null && (
        <div className="flex items-center justify-between rounded-xl bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Total</span>
          <span className="font-semibold text-primary-700 dark:text-primary-400">
            {formatCurrency(estimatedTotal)}
          </span>
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} disabled={!equipment.availability} className="w-full">
        {equipment.availability ? "Request Booking" : "Currently Unavailable"}
      </Button>
    </form>
  );
}
