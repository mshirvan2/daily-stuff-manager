"use client";

import { motion } from "framer-motion";
import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { priorityStyles } from "@/lib/theme";
import type { Task } from "@/types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd, dragging }: Props) {
  const p = priorityStyles[task.priority];
  const overdue =
    task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: dragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab overflow-hidden rounded-2xl border border-border bg-card/80 p-3.5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md active:cursor-grabbing"
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: task.color }} />
      <div className="flex items-start gap-2 pl-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge className={p.badge}>
              <span className={cn("size-1.5 rounded-full", p.dot)} />
              {p.label}
            </Badge>
            {overdue && (
              <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-500">Overdue</Badge>
            )}
          </div>
          <h4 className="mt-2 truncate font-medium leading-tight">{task.title}</h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
        <GripVertical className="size-4 shrink-0 text-muted-foreground/40" />
      </div>
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="secondary" size="icon" className="size-7" onClick={() => onEdit(task)}>
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-7 hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onDelete(task)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
