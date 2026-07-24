import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800", className)}
    />
  );
}

export function EquipmentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
