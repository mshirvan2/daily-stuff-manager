"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/components/store-provider";
import { COLORS, PRIORITIES, STATUSES, type Priority, type Status, type Task } from "@/types";
import { priorityStyles } from "@/lib/theme";

interface Props {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStatus?: Status;
}

export function TaskDialog({ open, onClose, task, defaultStatus = "todo" }: Props) {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<Status>(defaultStatus);
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [dueDate, setDueDate] = React.useState("");
  const [color, setColor] = React.useState(COLORS[0]);

  React.useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ?? "");
      setColor(task.color);
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setPriority("medium");
      setDueDate("");
      setColor(COLORS[0]);
    }
  }, [open, task, defaultStatus]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      color,
    };
    if (task) {
      updateTask(task.id, payload);
      toast.success("Task updated");
    } else {
      addTask(payload);
      toast.success("Task created");
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "New task"}
      description={task ? "Update the details of your task." : "Add a new task to your board."}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more detail…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {priorityStyles[p].label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due">Due date</Label>
          <Input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Color label</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={cn(
                  "size-7 rounded-full transition-transform hover:scale-110",
                  color === c && "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                )}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
