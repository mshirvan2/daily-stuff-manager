"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type { Status, Task } from "@/types";

interface Props {
  status: Status;
  label: string;
  tasks: Task[];
  isOver: boolean;
  onAdd: (status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDrop: (status: Status) => void;
  onDragOverColumn: (status: Status) => void;
  onDragLeaveColumn: () => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  draggingId: string | null;
}

const accent: Record<Status, string> = {
  todo: "from-slate-500/20 to-transparent",
  "in-progress": "from-indigo-500/20 to-transparent",
  done: "from-emerald-500/20 to-transparent",
};

const dot: Record<Status, string> = {
  todo: "bg-slate-400",
  "in-progress": "bg-indigo-500",
  done: "bg-emerald-500",
};

export function KanbanColumn({
  status,
  label,
  tasks,
  isOver,
  onAdd,
  onEdit,
  onDelete,
  onDrop,
  onDragOverColumn,
  onDragLeaveColumn,
  onDragStart,
  onDragEnd,
  draggingId,
}: Props) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOverColumn(status);
      }}
      onDragLeave={onDragLeaveColumn}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(status);
      }}
      className={cn(
        "flex min-h-[60vh] flex-col rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-sm transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-between rounded-xl bg-gradient-to-r px-3 py-2",
          accent[status]
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", dot[status])} />
          <h3 className="font-semibold">{label}</h3>
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={() => onAdd(status)}>
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              dragging={draggingId === task.id}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-10 text-center text-muted-foreground"
          >
            <Inbox className="mb-2 size-7 opacity-50" />
            <p className="text-sm">No tasks yet</p>
            <button
              onClick={() => onAdd(status)}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              Add one
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
