import Requests from "@/components/requests";
import { Badge } from "@/components/ui/badge";
import { getProject } from "@/lib/server/utils";

import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: projectId } = await params;
  const proj = await getProject(projectId);

  if (!proj.success) {
    redirect("/");
  }

  return (
    <>
      <main className="mx-auto max-w-4xl space-y-4 p-4 px-4 md:px-8">
        <Badge
          variant="outline"
          className="inline-flex flex-row gap-2 px-2 py-1"
        >
          Listening for requests
          <div className="size-2 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/25" />
        </Badge>
        <Requests requests={proj.data.requests} />
      </main>
    </>
  );
}
