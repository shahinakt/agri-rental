import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Join AgriRent as a farmer or equipment owner
        </p>

        <RegisterForm />

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-700 dark:text-primary-400 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
