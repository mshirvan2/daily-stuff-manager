"use client";

import * as React from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "./note-card";
import { NoteDialog } from "./note-dialog";
import { NotesSkeleton } from "@/components/skeletons";
import { useNoteStore } from "@/components/store-provider";
import { useConfirm } from "@/components/confirm-provider";
import type { Note } from "@/types";

export function NotesView() {
  const { notes, loaded, deleteNote, togglePin, toggleFavorite } = useNoteStore();
  const confirm = useConfirm();

  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Note | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter(
        (n) =>
          !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  }, [notes, query]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (note: Note) => {
    setEditing(note);
    setDialogOpen(true);
  };
  const remove = async (note: Note) => {
    const ok = await confirm({
      title: "Delete note?",
      description: `"${note.title}" will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) {
      deleteNote(note.id);
      toast.success("Note deleted");
    }
  };

  if (!loaded) return <NotesSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
            className="pl-9"
          />
        </div>
        <Button onClick={openNew}>
          <Plus /> New note
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 p-4">
            <StickyNote className="size-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{query ? "No matching notes" : "No notes yet"}</h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {query ? "Try a different search." : "Capture ideas, todos, and everything in between."}
          </p>
          {!query && (
            <Button className="mt-4" onClick={openNew}>
              <Plus /> Create your first note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={remove}
                onPin={togglePin}
                onFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <NoteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} note={editing} />
    </div>
  );
}
