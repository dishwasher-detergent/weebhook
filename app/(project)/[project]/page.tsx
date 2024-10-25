"use client";

import { projectIdAtom } from "@/atoms/project";
import { NoRequests } from "@/components/no-requests";
import { Request } from "@/components/request";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequests } from "@/hooks/useRequests";
import { Project } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectPage() {
  const [projectId, setProjectId] = useAtom(projectIdAtom);
  const { loading, requests } = useRequests();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function validateProject() {
      try {
        const { database } = await createClient();
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

    if (pathname != projectId) {
      validateProject();
    }
  }, []);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 px-4 md:px-8">
        <h2 className="font-bold text-foreground mb-2 inline-flex items-center gap-2">
          Requests
          <div className="ring-emerald-500/25 bg-emerald-500 ring-4 size-2 rounded-full animate-pulse" />
        </h2>
        <div className="flex flex-col gap-4">
          {!loading ? (
            <>
              {requests.map((item) => (
                <Request
                  key={item.$id}
                  timestamp={item.$createdAt}
                  body={item.body}
                  headers={item.headers}
                  type={item.type}
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
