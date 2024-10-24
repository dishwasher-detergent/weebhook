"use client";

import { projectId } from "@/atoms/project";
import { NoRequests } from "@/components/no-requests";
import { Request } from "@/components/request";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/interfaces/project.interface";
import { Request as RequestItem } from "@/interfaces/request.interface";
import { createClient } from "@/lib/client/appwrite";
import {
  DATABASE_ID,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from "@/lib/constants";

import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function ProjectPage() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { database, client } = createClient();
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
      setLoading(false);
    }

    if (projectIdValue && requests.length == 0) {
      fetchRequests(projectIdValue);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${REQUEST_COLLECTION_ID}.documents`,
      (response) => {
        const req = response.payload as RequestItem;
        if (req.projectId == projectIdValue) {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            setRequests((prev) => [req, ...prev]);
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            setRequests((prev) => prev.filter((x) => x.$id !== req.$id));
          }
        }
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    async function validateProject() {
      try {
        await database.getDocument<Project>(
          DATABASE_ID,
          PROJECT_COLLECTION_ID,
          pathname.slice(1)
        );

        setProjectId(pathname.slice(1));
      } catch {
        setProjectId(null);
        router.push("not-found");
      }
    }

    if (pathname != projectIdValue) {
      validateProject();
    }
  }, []);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 px-4 md:px-8">
        <h2 className="font-bold text-foreground mb-2">Requests</h2>
        <div className="flex flex-col gap-4">
          {!isLoading ? (
            <>
              {requests.map((item) => (
                <Request
                  key={item.$id}
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
        </div>
      </main>
    </>
  );
}
