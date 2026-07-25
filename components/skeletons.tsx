import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border bg-card/40 p-3">
          <Skeleton className="h-9 w-full" />
          {Array.from({ length: 3 }).map((__, j) => (
            <Skeleton key={j} className="h-24 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function NotesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-3 w-full" />
      </Card>
    </div>
  );
}
