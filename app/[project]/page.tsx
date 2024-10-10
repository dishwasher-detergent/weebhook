"use client";

import { projectId } from "@/atoms/project";
import { NoRequests } from "@/components/no-requests";
import { Project } from "@/components/project";
import { Request } from "@/components/request";
import { RequestChart } from "@/components/request-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Request as RequestItem } from "@/interfaces/request.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, REQUEST_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export interface RequestsPerHour {
  hour: string;
  requests: number;
}

const countRequestsPerHour = (items: RequestItem[]): RequestsPerHour[] => {
  const counts: { [hour: string]: number } = {};

  items.forEach((item) => {
    const date = new Date(item.$createdAt);
    const hourKey = date.toISOString().slice(0, 13);

    counts[hourKey] = (counts[hourKey] || 0) + 1;
  });

  return Object.keys(counts).map((hour) => ({
    hour: hour,
    requests: counts[hour],
  }));
};

export default function ProjectPage() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const [chartData, setChartData] = useState<RequestsPerHour[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { database } = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchRequests(projectId: string) {
      setLoading(true);

      const data = await database.listDocuments<RequestItem>(
        DATABASE_ID,
        REQUEST_COLLECTION_ID,
        [Query.equal("projectId", projectId), Query.orderDesc("$createdAt")]
      );

      setRequests(data.documents);
      setChartData(countRequestsPerHour(data.documents));
      setLoading(false);
    }

    if (projectIdValue) {
      fetchRequests(projectIdValue);
    }
  }, [projectIdValue]);

  // useEffect(() => {
  //   const unsubscribe = client.subscribe(
  //     `databases.*.collections.*`,
  //     (response) => {
  //       console.log("response", response);
  //     }
  //   );

  //   return unsubscribe;
  // }, [projectIdValue]);

  useEffect(() => {
    if (projectIdValue) {
      router.replace(projectIdValue);
    }
  }, [projectIdValue]);

  useEffect(() => {
    if (pathname) {
      setProjectId(pathname.slice(1));
    }
  }, [pathname]);

  return (
    <>
      <header className="w-full border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4 px-8">
          <Project />
        </div>
      </header>
      <main className="max-w-4xl mx-auto space-y-4 p-4 px-8">
        <h2 className="font-bold text-primary">Requests Per Hour</h2>
        {!isLoading ? (
          <>
            {chartData.length > 0 && <RequestChart data={chartData} />}
            {chartData.length === 0 && <NoRequests />}
          </>
        ) : (
          <Skeleton className="w-full h-48" />
        )}
        <h2 className="font-bold text-primary">Requests</h2>
        {!isLoading ? (
          <>
            {requests.map((item) => (
              <Request
                key={item.$id}
                method="post"
                timestamp={item.$createdAt}
                body={item.body}
                headers={item.headers}
              />
            ))}
            {requests.length === 0 && <NoRequests />}
          </>
        ) : (
          <Skeleton className="w-full h-48" />
        )}
      </main>
    </>
  );
}
