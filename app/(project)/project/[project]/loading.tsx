import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Loading() {
  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        <Badge
          variant="outline"
          className="inline-flex flex-row gap-2 px-2 py-1"
        >
          Listening for requests
          <div className="size-2 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/25" />
        </Badge>
        <Skeleton className="h-52 w-full" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full" />
          ))}
        </div>
      </main>
    </>
  );
}
