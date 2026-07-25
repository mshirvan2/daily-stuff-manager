export type Status = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  color: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export const STATUSES: { id: Status; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export const PRIORITIES: Priority[] = ["low", "medium", "high"];

export const COLORS = [
  "#6366f1",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];
