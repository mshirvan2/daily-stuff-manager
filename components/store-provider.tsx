"use client";

import * as React from "react";
import { useTasks } from "@/hooks/useTasks";
import { useNotes } from "@/hooks/useNotes";

const TasksContext = React.createContext<ReturnType<typeof useTasks> | null>(null);
const NotesContext = React.createContext<ReturnType<typeof useNotes> | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const tasks = useTasks();
  const notes = useNotes();
  return (
    <TasksContext.Provider value={tasks}>
      <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTaskStore() {
  const ctx = React.useContext(TasksContext);
  if (!ctx) throw new Error("useTaskStore must be used within StoreProvider");
  return ctx;
}

export function useNoteStore() {
  const ctx = React.useContext(NotesContext);
  if (!ctx) throw new Error("useNoteStore must be used within StoreProvider");
  return ctx;
}
