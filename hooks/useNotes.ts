"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Note } from "@/types";

export type NoteInput = Pick<Note, "title" | "content">;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/notes");
        if (active && res.ok) {
          const data = await res.json();
          setNotes(data.notes as Note[]);
        }
      } catch {
        if (active) toast.error("Failed to load notes.");
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const addNote = useCallback(async (input: NoteInput) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error();
      const { note } = await res.json();
      setNotes((prev) => [note as Note, ...prev]);
      return note as Note;
    } catch {
      toast.error("Failed to create note.");
    }
  }, []);

  const patchNote = useCallback(
    async (id: string, patch: Partial<Note>, prevSnapshot: Note[]) => {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error();
        const { note } = await res.json();
        setNotes((cur) => cur.map((n) => (n.id === id ? (note as Note) : n)));
      } catch {
        setNotes(prevSnapshot);
        toast.error("Failed to update note.");
      }
    },
    []
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<Note>) => {
      const prev = notes;
      setNotes((cur) =>
        cur.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n))
      );
      return patchNote(id, patch, prev);
    },
    [notes, patchNote]
  );

  const deleteNote = useCallback(async (id: string) => {
    const prev = notes;
    setNotes((cur) => cur.filter((n) => n.id !== id));
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setNotes(prev);
      toast.error("Failed to delete note.");
    }
  }, [notes]);

  const togglePin = useCallback(
    (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (note) updateNote(id, { pinned: !note.pinned });
    },
    [notes, updateNote]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (note) updateNote(id, { favorite: !note.favorite });
    },
    [notes, updateNote]
  );

  return { notes, loaded, addNote, updateNote, deleteNote, togglePin, toggleFavorite };
}
