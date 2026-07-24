import { cn } from "@/lib/utils";

type BadgeTone = "green" | "yellow" | "red" | "gray";

const toneStyles: Record<BadgeTone, string> = {
  green: "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300",
  yellow: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}
