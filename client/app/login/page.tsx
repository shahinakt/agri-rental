import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Log in to continue to AgriRent
        </p>

        <LoginForm />

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-700 dark:text-primary-400 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
