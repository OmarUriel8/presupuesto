import { Skeleton } from "@/components/ui/skeleton";

export default function Loading(): React.JSX.Element {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando contenido">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-end gap-3">
          <div className="grid gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-[170px]" />
          </div>
          <Skeleton className="mb-2 h-4 w-32" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Skeleton className="h-96 xl:col-span-3" />
        <Skeleton className="h-96 xl:col-span-2" />
      </div>

      <Skeleton className="h-96" />
    </div>
  );
}
