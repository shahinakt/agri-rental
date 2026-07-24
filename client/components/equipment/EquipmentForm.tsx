"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EQUIPMENT_CATEGORIES } from "@/constants";
import type { Equipment, EquipmentFormValues } from "@/types";

const equipmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "tractor",
    "harvester",
    "rotavator",
    "seeder",
    "power_tiller",
    "cultivator",
    "sprayer",
  ]),
  location: z.string().min(2, "Location is required"),
  price_per_day: z.coerce.number().positive("Price must be greater than 0"),
  image: z.string().url("Must be a valid image URL"),
  availability: z.boolean(),
});

interface EquipmentFormProps {
  defaultValues?: Equipment;
  onSubmit: (values: EquipmentFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

const PLACEHOLDER_IMAGE = "/equipment/tractor.png";

export function EquipmentForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Equipment",
}: EquipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          category: defaultValues.category,
          location: defaultValues.location,
          price_per_day: defaultValues.price_per_day,
          image: defaultValues.image,
          availability: defaultValues.availability,
        }
      : {
          title: "",
          description: "",
          category: "tractor",
          location: "",
          price_per_day: 0,
          image: PLACEHOLDER_IMAGE,
          availability: true,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Title" placeholder="e.g. Mahindra 575 DI Tractor" error={errors.title?.message} {...register("title")} />

      <Textarea
        label="Description"
        placeholder="Describe the equipment condition, features, etc."
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" error={errors.category?.message} {...register("category")}>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>

        <Input label="Location" placeholder="e.g. Nashik" error={errors.location?.message} {...register("location")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price per day (₹)"
          type="number"
          step="0.01"
          error={errors.price_per_day?.message}
          {...register("price_per_day")}
        />

        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" className="h-4 w-4 rounded accent-primary-600" {...register("availability")} />
            Available for rent
          </label>
        </div>
      </div>

      <Input
        label="Image URL"
        placeholder="https://..."
        error={errors.image?.message}
        {...register("image")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
