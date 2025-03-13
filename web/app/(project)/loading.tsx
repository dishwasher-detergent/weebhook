import { RequestsChartLoading } from "@/components/request-chart-loading";
import { RequestLoading } from "@/components/request-loading";
import { Badge } from "@/components/ui/badge";

export default async function Loading() {
  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        <Badge
          variant="outline"
          className="inline-flex flex-row gap-2 px-2 py-1"
        >
          Fetching Requests
          <div className="size-2 animate-pulse rounded-full bg-amber-500 ring-4 ring-amber-500/25" />
        </Badge>
        <RequestsChartLoading />
        <RequestLoading />
      </main>
    </>
  );
}
