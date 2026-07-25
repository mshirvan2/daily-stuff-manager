"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Command,
  KanbanSquare,
  LayoutDashboard,
  StickyNote,
  Sparkles,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { NotesView } from "@/components/notes/notes-view";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { NoteDialog } from "@/components/notes/note-dialog";
import { StoreProvider } from "@/components/store-provider";
import { AuthScreen } from "@/components/auth-screen";
import { useAuth } from "@/components/auth-provider";

type Tab = "dashboard" | "board" | "notes";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "board", label: "Board", icon: KanbanSquare },
  { id: "notes", label: "Notes", icon: StickyNote },
];

export function AppShell() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <StoreProvider>
      <Workspace />
    </StoreProvider>
  );
}

function Workspace() {
  const { user, logout } = useAuth();
  const [tab, setTab] = React.useState<Tab>("dashboard");
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [taskOpen, setTaskOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
        return;
      }
      if (typing) return;
      if (e.key === "1") setTab("dashboard");
      if (e.key === "2") setTab("board");
      if (e.key === "3") setTab("notes");
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setTaskOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onLogout = async () => {
    try {
      await logout();
      toast.success("Signed out.");
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -right-32 top-40 size-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="font-semibold tracking-tight">Daily Stuff</h1>
              <p className="text-[11px] text-muted-foreground">Tasks & Notes</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-2xl border border-border/60 bg-card/50 p-1 backdrop-blur-sm md:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors",
                  tab === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30"
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                )}
                <t.icon className="relative size-4" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCmdOpen(true)}
              className="hidden gap-2 text-muted-foreground sm:flex"
            >
              <Command className="size-3.5" />
              <span className="text-xs">Command</span>
              <kbd className="rounded border border-border px-1 text-[10px]">⌘K</kbd>
            </Button>
            <ThemeToggle />
            <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/50 py-1 pl-3 pr-1 backdrop-blur-sm sm:flex">
              <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[11px] font-semibold text-white">
                {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate text-xs text-muted-foreground">
                {user?.name || user?.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                title="Sign out"
                className="size-7"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Sign out"
              className="sm:hidden"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        <nav className="container flex items-center gap-1 pb-2 md:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-colors",
                tab === t.id
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                  : "text-muted-foreground"
              )}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container py-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "dashboard" && <DashboardView />}
            {tab === "board" && <KanbanBoard />}
            {tab === "notes" && <NotesView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <CommandMenu
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={setTab}
        onNewTask={() => setTaskOpen(true)}
        onNewNote={() => setNoteOpen(true)}
      />
      <TaskDialog open={taskOpen} onClose={() => setTaskOpen(false)} />
      <NoteDialog open={noteOpen} onClose={() => setNoteOpen(false)} />
    </div>
  );
}
