"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/services/api";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["owner", "farmer"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "farmer" },
  });

  async function onSubmit(values: RegisterValues) {
    setIsSubmitting(true);
    try {
      await registerUser(values.name, values.email, values.password, values.role);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" placeholder="John Farmer" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
      <Select label="I am a" error={errors.role?.message} {...register("role")}>
        <option value="farmer">Farmer (renting equipment)</option>
        <option value="owner">Equipment Owner (listing equipment)</option>
      </Select>
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
