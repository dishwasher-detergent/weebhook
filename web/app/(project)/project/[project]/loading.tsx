import { RequestsChartLoading } from "@/components/request-chart-loading";
import { RequestLoading } from "@/components/request-loading";

export default async function Loading() {
  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        <RequestsChartLoading />
        <RequestLoading />
      </main>
    </>
  );
}
