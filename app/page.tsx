import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { createWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

async function getProjects() {
  const data = await database.listDocuments(
    DATABASE_ID,
    PROJECT_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)]
  );

  if (data.documents.length > 0) {
    redirect(data.documents[0].$id);
  }
}

async function create() {
  const data = await createWebhook();

  if (data) {
    setProjectId(data.$id);
    router.replace(data.$id);
  }
}

export default async function Home() {
  const [projectIdValue, setProjectId] = useAtom(projectId);
  const user = await getLoggedInUser();

  if(!user) {
    redirect('login');
  }

  if(projectIdValue) {
    redirect(projectIdValue);
  }

  await getProjects();

  return (
    <>
      <header className="w-full border-b sticky top-0 bg-background/50 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto p-4 px-8">
          <p className="font-bold text-primary-foreground text-sm">Webhook</p>
          <Button onClick={create}>Create Webhook</Button>
        </div>
      </header>
    </>
  );
}
