import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import * as React from "react";

export function RequestsChartLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-dashed p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-2">
          <CardTitle>Webhook Requests</CardTitle>
          <CardDescription className="text-xs">
            Showing total requests by the hour
          </CardDescription>
        </div>
        <div className="relative z-30 flex flex-none flex-col justify-center gap-1 border-t border-dashed bg-muted/50 px-6 py-2 text-left even:border-l sm:border-l sm:border-t-0">
          <span className="text-xs text-muted-foreground">Requests</span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            <Skeleton className="h-12 w-full" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-36 w-full" />
      </CardContent>
    </Card>
  );
}
