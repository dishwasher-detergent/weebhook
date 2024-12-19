"use client";

import { projectIdAtom } from "@/atoms/project";
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
  const [projectId, setprojectId] = useAtom(projectIdAtom);
  const [loadingCreateWebhook, setLoadingCreateWebhook] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function getProjects() {
      setLoading(true);
      const { database } = await createClient();
      const user = await getLoggedInUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (projectId) {
        router.push(projectId);
        return;
      }

      const data = await database.listDocuments(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)],
      );

      if (data.documents.length > 0) {
        setprojectId(data.documents[0].$id);
        router.replace(data.documents[0].$id);
      }

      setLoading(false);
    }

    getProjects();
  }, [projectId]);

  async function create() {
    setLoadingCreateWebhook(true);
    const data = await createWebhook();

    if (data) {
      setprojectId(data.$id);
      router.push(data.$id);
    }

    setLoadingCreateWebhook(false);
  }

  return (
    <main className="grid min-h-dvh w-full place-items-center p-4">
      {loading && (
        <p className="flex flex-row items-center gap-2">
          <LucideLoader2 className="size-4 animate-spin" />
          Checking for existing webhooks
        </p>
      )}
      {!loading && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold text-center">
            Looks like you don&apos;t have any webhooks created yet.
          </h1>
          <p>Lets get started!</p>
          <Button onClick={create}>
            {loadingCreateWebhook ? (
              <>
                <LucideLoader2 className="mr-2 size-4 animate-spin" />
                Creating Webhook
              </>
            ) : (
              <>
                <LucidePlus className="mr-2 size-4" />
                Create Webhook
              </>
            )}
          </Button>
        </div>
      )}
    </main>
  );
}
