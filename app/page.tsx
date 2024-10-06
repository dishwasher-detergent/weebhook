"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";

import { Models } from "appwrite";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const router = useRouter();
  const { database } = createClient();

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

    if (projectIdValue) {
      router.replace(projectIdValue);
    } else {
      getProjects();
    }
  }, [projectIdValue]);

  useEffect(() => {
    async function getUser() {
      const user = await getLoggedInUser();

      setUser(user);
    }

    getUser();
  }, []);

  return (
    <main>
      {user ? <Button>Create Webhook</Button> : <Button>Sign Up</Button>}
    </main>
  );
}
