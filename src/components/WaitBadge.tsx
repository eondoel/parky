import { cn, waitColor, waitLabel } from "@/lib/utils";

interface WaitBadgeProps {
  waitMinutes: number | null;
  status: string;
  size?: "sm" | "md";
}

export default function WaitBadge({ waitMinutes, status, size = "md" }: WaitBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tabular-nums",
        waitColor(status === "OPERATING" || status === "UNKNOWN" ? waitMinutes : null),
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"
      )}
    >
      {waitLabel(waitMinutes, status)}
    </span>
  );
}
