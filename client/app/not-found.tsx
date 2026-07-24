import Link from "next/link";
import { Tractor } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="h-20 w-20 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
        <Tractor className="h-10 w-10 text-primary-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        This field is empty — the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button className="mt-6">Back to Home</Button>
      </Link>
    </div>
  );
}
