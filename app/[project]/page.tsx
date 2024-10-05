import { RequestChart } from "@/components/request-chart";
import { Button } from "@/components/ui/button";
import { Request } from "@/components/ui/request";
import { Project as ProjectInterface } from "@/interfaces/project.interface";
import { RequestItem } from "@/interfaces/request.interface";
import {
  DATABASE_ID,
  HOSTNAME,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";

import { LucideClipboard } from "lucide-react";
import { Query } from "node-appwrite";

async function fetchProject(projectId: string) {
  const { database } = await createSessionClient();

  const data = await database.getDocument<ProjectInterface>(
    DATABASE_ID,
    PROJECT_COLLECTION_ID,
    projectId
  );

  return data;
}

async function fetchRequests(projectId: string) {
  const { database } = await createSessionClient();

  const data = await database.listDocuments<RequestItem>(
    DATABASE_ID,
    REQUEST_COLLECTION_ID,
    [Query.equal("projectId", projectId)]
  );

  return data;
}

const countRequestsPerHour = (items: RequestItem[]) => {
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

export default async function Project({
  params,
}: {
  params: { project: string };
}) {
  const project = await fetchProject(params.project);
  const requests = await fetchRequests(params.project);

  const chartData = countRequestsPerHour(requests.documents);

  return (
    <>
      <header className="border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4">
          <p className="font-bold text-primary text-sm">Webhook</p>
          <div className="flex flex-row gap-1 items-center">
            <h1 className="text-xl text-muted-foreground">
              https://
              <span className="font-bold text-primary">{project.$id}</span>.
              {HOSTNAME}
            </h1>
            <Button variant="ghost" size="icon">
              <LucideClipboard className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto space-y-4 p-4">
        <h2 className="font-bold text-primary">Requests Per Hour</h2>
        <RequestChart data={chartData} />
        <h2 className="font-bold text-primary">Requests</h2>
        {requests.documents.map((item) => (
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

export const revalidate = 0;
