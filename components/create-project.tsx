"use client";

import { LucideLoader2, LucidePlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/server/utils";

export function CreateProject() {
  const [loadingCreateProject, setLoadingCreateProject] =
    useState<boolean>(false);
  const router = useRouter();

  async function onSubmit() {
    setLoadingCreateProject(true);

    const data = await createProject();

    if (!data.success) {
      toast.error(data.message);
    }

    if (data.data) {
      router.push(`/webhook/${data.data.$id}`);
    }

    setLoadingCreateProject(false);
  }

  return (
    <Button
      onClick={onSubmit}
      className="w-full"
      variant="outline"
      size="sm"
      disabled={loadingCreateProject}
    >
      Create Project
      {loadingCreateProject ? (
        <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
      ) : (
        <LucidePlus className="mr-2 size-3.5" />
      )}
    </Button>
  );
}
