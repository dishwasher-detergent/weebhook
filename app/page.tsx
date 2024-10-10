"use client";

import { projectId } from "@/atoms/project";
import { NoRequests } from "@/components/no-requests";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { createWebhook } from "@/lib/utils";

import { Models } from "appwrite";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const router = useRouter();
  const { database } = createClient();

  useEffect(() => {
    async function checkLoginStatusAndProjects() {
      setIsLoading(true);

      const userData = await getLoggedInUser();
      setUser(userData);

      if (userData) {
        const data = await database.listDocuments(
          DATABASE_ID,
          PROJECT_COLLECTION_ID,
          [Query.orderDesc("$createdAt"), Query.limit(1)]
        );

        if (data.documents.length > 0) {
          setProjectId(data.documents[0].$id);
        }
      }

      setIsLoading(false);
    }

    checkLoginStatusAndProjects();
  }, []);

  useEffect(() => {
    if (user && projectIdValue) {
      router.replace(projectIdValue);
    }
  }, [user, projectIdValue]);

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
          <p className="font-bold text-primary text-sm">Webhook</p>
          {isLoading ? (
            <Skeleton className="h-9 w-36" />
          ) : user ? (
            <Button onClick={create}>Create Webhook</Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login To Create A Webhook</Link>
            </Button>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto space-y-4 p-4 px-8">
        <h2 className="font-bold text-primary">Requests Per Hour</h2>
        <NoRequests />
        <h2 className="font-bold text-primary">Requests</h2>
        <NoRequests />
      </main>
    </>
  );
}
