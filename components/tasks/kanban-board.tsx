"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { KanbanColumn } from "./kanban-column";
import { TaskDialog } from "./task-dialog";
import { useTaskStore } from "@/components/store-provider";
import { useConfirm } from "@/components/confirm-provider";
import { KanbanSkeleton } from "@/components/skeletons";
import { STATUSES, type Priority, type Status, type Task } from "@/types";
import { priorityStyles } from "@/lib/theme";

export function KanbanBoard() {
  const { tasks, loaded, deleteTask, moveTask } = useTaskStore();
  const confirm = useConfirm();

  const [query, setQuery] = React.useState("");
  const [priority, setPriority] = React.useState<Priority | "all">("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = React.useState<Status>("todo");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [overColumn, setOverColumn] = React.useState<Status | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchQ =
        !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchP = priority === "all" || t.priority === priority;
      return matchQ && matchP;
    });
  }, [tasks, query, priority]);

  const openNew = (status: Status) => {
    setEditing(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  const remove = async (task: Task) => {
    const ok = await confirm({
      title: "Delete task?",
      description: `"${task.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) {
      deleteTask(task.id);
      toast.success("Task deleted");
    }
  };

  const handleDrop = (status: Status) => {
    if (draggingId) {
      const task = tasks.find((t) => t.id === draggingId);
      if (task && task.status !== status) {
        moveTask(draggingId, status);
        toast.success(`Moved to ${STATUSES.find((s) => s.id === status)?.label}`);
      }
    }
    setDraggingId(null);
    setOverColumn(null);
  };

  if (!loaded) return <KanbanSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="pl-9"
            />
          </div>
          <div className="relative sm:w-44">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority | "all")}
              className="pl-9"
            >
              <option value="all">All priorities</option>
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <option key={p} value={p}>
                  {priorityStyles[p].label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Button onClick={() => openNew("todo")}>
          <Plus /> New task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {STATUSES.map((s) => (
          <KanbanColumn
            key={s.id}
            status={s.id}
            label={s.label}
            tasks={filtered.filter((t) => t.status === s.id)}
            isOver={overColumn === s.id}
            onAdd={openNew}
            onEdit={openEdit}
            onDelete={remove}
            onDrop={handleDrop}
            onDragOverColumn={setOverColumn}
            onDragLeaveColumn={() => setOverColumn(null)}
            onDragStart={setDraggingId}
            onDragEnd={() => {
              setDraggingId(null);
              setOverColumn(null);
            }}
            draggingId={draggingId}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={editing}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
