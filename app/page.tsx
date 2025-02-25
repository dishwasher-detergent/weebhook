import { CreateProject } from "@/components/create-project";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { getProjects } from "@/lib/server/utils";

import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  if (user.prefs.lastVisitedOrg) {
    redirect(`/project/${user.prefs.lastVisitedOrg}`);
  } else {
    const projects = await getProjects();

    if (projects.data && projects.data.length > 0) {
      redirect(`/project/${projects.data[0].$id}`);
    }
  }

  return (
    <main className="mx-auto grid h-full min-h-dvh max-w-6xl place-items-center space-y-4 p-4 px-4 md:px-8">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-bold">
          Looks like you don&apos;t have any webhooks created yet.
        </h1>
        <p>Lets get started!</p>
        <div>
          <CreateProject />
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
