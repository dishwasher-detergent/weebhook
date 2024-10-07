"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { createWebhook } from "@/lib/utils";

import { Models } from "appwrite";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { database } = createClient();

  useEffect(() => {
    async function checkLoginStatus() {
      const loggedIn = await getLoggedInUser(); // Replace with your actual auth check
      setIsLoggedIn(loggedIn);
    }

    checkLoginStatus();
  }, []);

  useEffect(() => {
    async function getProjects() {
      const data = await database.listDocuments(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)]
      );

      if (data.documents.length > 0) {
        setProjectId(data.documents[0].$id);
      }
    }

    if (isLoggedIn) {
      if (projectIdValue) {
        router.replace(projectIdValue);
      } else {
        getProjects();
      }
    }
  }, [isLoggedIn, projectIdValue]);

  async function create() {
    const data = await createWebhook();

    if (data) {
      setProjectId(data.$id);
      router.replace(data.$id);
    }
  }

  if (!isLoggedIn) {
    return <div>Please log in to view your projects.</div>;
  }

  return (
    <div>
      <Button onClick={create}>Create Webhook</Button>
    </div>
  );
};
