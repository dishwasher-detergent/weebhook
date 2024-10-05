"use client";

import { projectId } from "@/atoms/project";
import { RequestChart } from "@/components/request-chart";
import { Project } from "@/components/ui/project";
import { Request } from "@/components/ui/request";
import { Request as RequestItem } from "@/interfaces/request.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, REQUEST_COLLECTION_ID } from "@/lib/constants";

import { useAtomValue } from "jotai";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

interface RequestsPerHour {
  hour: string;
  requests: number;
}

const countRequestsPerHour = (items: RequestItem[]): RequestsPerHour[] => {
  const counts: { [hour: string]: number } = {};

  items.forEach((item) => {
    const date = new Date(item.$createdAt);
    const hourKey = date.toISOString().slice(0, 13); // Get 'YYYY-MM-DDTHH'

    counts[hourKey] = (counts[hourKey] || 0) + 1;
  });

  return Object.keys(counts).map((hour) => ({
    hour: hour,
    requests: counts[hour],
  }));
};

export default function ProjectPage() {
  const projectIdValue = useAtomValue(projectId);
  const [chartData, setChartData] = useState<RequestsPerHour[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    async function fetchRequests(projectId: string) {
      const { database } = await createClient();

      const data = await database.listDocuments<RequestItem>(
        DATABASE_ID,
        REQUEST_COLLECTION_ID,
        [Query.equal("projectId", projectId)]
      );

      setRequests(data.documents);
      setChartData(countRequestsPerHour(data.documents));
    }

    if (projectIdValue) {
      fetchRequests(projectIdValue);
    }
  }, [projectIdValue]);

  return (
    <>
      <header className="border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4">
          <Project />
        </div>
      </header>
      <main className="max-w-4xl mx-auto space-y-4 p-4">
        <h2 className="font-bold text-primary">Requests Per Hour</h2>
        <RequestChart data={chartData} />
        <h2 className="font-bold text-primary">Requests</h2>
        {requests.map((item) => (
          <Request
            key={item.$id}
            method="post"
            timestamp={item.$createdAt}
            body={item.body}
            headers={item.headers}
          />
        ))}
      </main>
    </>
  );
}
