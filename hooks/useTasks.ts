"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Status, Task } from "@/types";

export type TaskInput = Omit<Task, "id" | "createdAt">;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/tasks");
        if (active && res.ok) {
          const data = await res.json();
          setTasks(data.tasks as Task[]);
        }
      } catch {
        if (active) toast.error("Failed to load tasks.");
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const addTask = useCallback(async (input: TaskInput) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const { task } = await res.json();
      setTasks((prev) => [task as Task, ...prev]);
      return task as Task;
    } catch {
      toast.error("Failed to create task.");
    }
  }, []);

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const prev = tasks;
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prev);
      toast.error("Failed to update task.");
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const prev = tasks;
    setTasks((cur) => cur.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prev);
      toast.error("Failed to delete task.");
    }
  }, [tasks]);

  const moveTask = useCallback(
    (id: string, status: Status) => updateTask(id, { status }),
    [updateTask]
  );

  return { tasks, loaded, addTask, updateTask, deleteTask, moveTask };
}
