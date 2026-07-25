"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNoteStore } from "@/components/store-provider";
import type { Note } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
}

export function NoteDialog({ open, onClose, note }: Props) {
  const { addNote, updateNote } = useNoteStore();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [open, note]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      toast.error("Note is empty");
      return;
    }
    const payload = { title: title.trim() || "Untitled", content: content.trim() };
    if (note) {
      updateNote(note.id, payload);
      toast.success("Note updated");
    } else {
      addNote(payload);
      toast.success("Note created");
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={note ? "Edit note" : "New note"}
      description={note ? "Update your note." : "Capture a thought."}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="note-title">Title</Label>
          <Input
            id="note-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note-content">Content</Label>
          <Textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            className="min-h-[180px]"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{note ? "Save changes" : "Create note"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
