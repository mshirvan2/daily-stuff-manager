"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ListTodo, StickyNote, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardSkeleton } from "@/components/skeletons";
import { useNoteStore, useTaskStore } from "@/components/store-provider";
import { cn } from "@/lib/utils";

function Stat({
  icon: Icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      <Card className="relative overflow-hidden p-5">
        <div className={cn("absolute -right-4 -top-4 size-20 rounded-full opacity-20 blur-2xl", accent)} />
        <div className={cn("inline-flex rounded-xl p-2.5", accent, "bg-opacity-15")}>
          <Icon className="size-5" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </Card>
    </motion.div>
  );
}

export function DashboardView() {
  const { tasks, loaded: tasksLoaded } = useTaskStore();
  const { notes, loaded: notesLoaded } = useNoteStore();

  if (!tasksLoaded || !notesLoaded) return <DashboardSkeleton />;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={ListTodo} label="Total Tasks" value={total} accent="bg-indigo-500 text-indigo-500" delay={0} />
        <Stat icon={CheckCircle2} label="Completed" value={completed} accent="bg-emerald-500 text-emerald-500" delay={0.05} />
        <Stat icon={Clock} label="Pending" value={pending} accent="bg-amber-500 text-amber-500" delay={0.1} />
        <Stat icon={StickyNote} label="Notes" value={notes.length} accent="bg-fuchsia-500 text-fuchsia-500" delay={0.15} />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 p-2">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Completion Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completed} of {total || 0} tasks done
                </p>
              </div>
            </div>
            <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-3xl font-bold text-transparent tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="mt-5">
            <Progress value={progress} />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
