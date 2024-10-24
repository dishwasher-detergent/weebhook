"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { createWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [projectIdValue, setProjectIdValue] = useAtom(projectId);
  const [isLoadingCreateWebhook, setIsLoadingCreateWebhook] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { database } = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getProjects() {
      setIsLoading(true);
      const user = await getLoggedInUser();

      if (!user) {
        router.push("/login");
      }

      const data = await database.listDocuments(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)]
      );

      if (data.documents.length > 0) {
        setProjectIdValue(data.documents[0].$id);
        router.replace(data.documents[0].$id);
      }

      setIsLoading(false);
    }

    if (!projectIdValue) {
      getProjects();
    } else {
      router.replace(projectIdValue);
    }
  }, [projectIdValue]);

  async function create() {
    setIsLoadingCreateWebhook(true);
    const data = await createWebhook();

    if (data) {
      setProjectIdValue(data.$id);
      router.push(data.$id);
    }

    setIsLoadingCreateWebhook(false);
  }

  return (
    <main className="grid place-items-center w-full min-h-dvh">
      {isLoading && (
        <p className="flex flex-row gap-2 items-center">
          <LucideLoader2 className="animate-spin size-4" />
          Checking for existing webhooks
        </p>
      )}
      {!isLoading && (
        <Button onClick={create}>
          {isLoadingCreateWebhook ? (
            <>
              <LucideLoader2 className="animate-spin size-4 mr-2" />
              Creating Webhook
            </>
          ) : (
            <>
              <LucidePlus className="size-4 mr-2" />
              Create Webhook
            </>
          )}
        </Button>
      )}
    </main>
  );
}
