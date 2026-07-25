"use client";

import { motion } from "framer-motion";
import { Pin, Star, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatTime } from "@/lib/utils";
import type { Note } from "@/types";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onPin: (id: string) => void;
  onFavorite: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onPin, onFavorite }: Props) {
  return (
    <motion.div layout layoutId={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
      <Card className="group flex h-full flex-col p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h4 className="min-w-0 flex-1 truncate font-semibold">{note.title}</h4>
          <div className="flex shrink-0 gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onPin(note.id)}
              aria-label="Pin note"
            >
              <Pin
                className={cn(
                  "size-4 transition-colors",
                  note.pinned ? "fill-indigo-500 text-indigo-500" : "text-muted-foreground"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onFavorite(note.id)}
              aria-label="Favorite note"
            >
              <Star
                className={cn(
                  "size-4 transition-colors",
                  note.favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
        </div>

        <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground line-clamp-6">
          {note.content || "No content"}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-[11px] text-muted-foreground">Updated {formatTime(note.updatedAt)}</span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="secondary" size="icon" className="size-7" onClick={() => onEdit(note)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-7 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(note)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
