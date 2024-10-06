"use client";

import { projectId } from "@/atoms/project";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const projectIdValue = useAtomValue(projectId);
  const router = useRouter();

  useEffect(() => {
    if (projectIdValue) {
      router.replace(projectIdValue);
    }
  }, [projectIdValue]);
}
