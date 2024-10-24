"use client";

import { projectId } from "@/atoms/project";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Query } from "node-appwrite";
import { useEffect } from "react";

export default function Home() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const { database } = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getProjects() {
      const data = await database.listDocuments(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(1)]
      );

      if (data.documents.length > 0) {
        setProjectId(data.documents[0].$id);
        router.replace(data.documents[0].$id);
      }
    }

    if (!projectIdValue) {
      getProjects();
    } else {
      router.replace(projectIdValue);
    }
  }, [projectIdValue]);

  return <></>;
}
