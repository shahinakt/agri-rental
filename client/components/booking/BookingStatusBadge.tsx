import { Badge } from "@/components/ui/Badge";
import type { BookingStatus } from "@/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; tone: "green" | "yellow" | "red" }> = {
  pending: { label: "Pending", tone: "yellow" },
  approved: { label: "Approved", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
