import type { Priority } from "@/types";

export const priorityStyles: Record<Priority, { label: string; badge: string; dot: string }> = {
  low: {
    label: "Low",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  medium: {
    label: "Medium",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  high: {
    label: "High",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
};
