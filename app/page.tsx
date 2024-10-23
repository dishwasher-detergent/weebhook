"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { createWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasProjects, setHasProjects] = useState<boolean>(true);
  const router = useRouter();
  const { database } = createClient();

  useEffect(() => {
    async function getProjects() {
      try {
        setIsLoading(true);
        const data = await database.listDocuments(
          DATABASE_ID,
          PROJECT_COLLECTION_ID,
          [Query.orderDesc("$createdAt"), Query.limit(1)]
        );

        if (data.documents.length > 0) {
          setProjectId(data.documents[0].$id);
        }
      } finally {
        setHasProjects(false);
        setIsLoading(false);
      }
    }

    if (!projectIdValue) {
      getProjects();
    }
  }, [projectIdValue]);

  useEffect(() => {
    if (projectIdValue) {
      router.replace(projectIdValue);
    }
  }, [projectIdValue]);

  async function create() {
    const data = await createWebhook();

    if (data) {
      setProjectId(data.$id);
      router.replace(data.$id);
    }
  }

  return (
    <>
      <header className="w-full border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4 px-8">
          <p className="font-bold text-primary-foreground text-sm">Webhook</p>
          {isLoading && hasProjects ? (
            <Skeleton className="h-9 w-36" />
          ) : (
            <Button onClick={create}>Create Webhook</Button>
          )}
        </div>
      </header>
    </>
  );
}
