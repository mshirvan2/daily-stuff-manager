"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  KanbanSquare,
  StickyNote,
  Plus,
  Moon,
  Sun,
  Search,
  CornerDownLeft,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  run: () => void;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: "dashboard" | "board" | "notes") => void;
  onNewTask: () => void;
  onNewNote: () => void;
}

export function CommandMenu({ open, onClose, onNavigate, onNewTask, onNewNote }: Props) {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  const commands: Command[] = React.useMemo(
    () => [
      { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, run: () => onNavigate("dashboard") },
      { id: "board", label: "Go to Board", icon: KanbanSquare, run: () => onNavigate("board") },
      { id: "notes", label: "Go to Notes", icon: StickyNote, run: () => onNavigate("notes") },
      { id: "new-task", label: "Create new task", hint: "N", icon: Plus, run: onNewTask },
      { id: "new-note", label: "Create new note", icon: Plus, run: onNewNote },
      {
        id: "theme",
        label: "Toggle theme",
        icon: theme === "dark" ? Sun : Moon,
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ],
    [onNavigate, onNewTask, onNewNote, theme, setTheme]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  const run = (cmd: Command) => {
    cmd.run();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) run(filtered[active]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-xl p-0 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search className="size-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No results</p>
        ) : (
          filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(cmd)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                i === active ? "bg-accent text-accent-foreground" : "text-foreground"
              )}
            >
              <cmd.icon className="size-4 text-muted-foreground" />
              <span className="flex-1">{cmd.label}</span>
              {cmd.hint && (
                <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {cmd.hint}
                </kbd>
              )}
              {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
            </button>
          ))
        )}
      </div>
    </Dialog>
  );
}
