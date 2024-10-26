"use client";

import { projectIdAtom } from "@/atoms/project";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, HOSTNAME, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { cn, createWebhook, deleteWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import {
  Check,
  ChevronsUpDown,
  LucideCopy,
  LucideCopyCheck,
  LucideLoader2,
  LucidePlus,
  LucideTrash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function Project() {
  const router = useRouter();

  const [projectId, setprojectId] = useAtom(projectIdAtom);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreateWebhook, setLoadingCreateWebhook] =
    useState<boolean>(false);
  const [loadingDeleteWebhook, setLoadingDeleteWebhook] =
    useState<boolean>(false);
  const [copy, setCopy] = useState<boolean>(false);

  async function fetchProjects() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<ProjectItem>(
      DATABASE_ID,
      PROJECT_COLLECTION_ID
    );

    if (data.documents.length > 0) {
      setProjects(data.documents);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (projects.length == 0) {
      fetchProjects();
    }
  }, [projects]);

  async function create() {
    setLoadingCreateWebhook(true);
    const data = await createWebhook();

    if (data) {
      setProjects((prev) => [...prev, data]);
      setprojectId(data.$id);
      router.push(data.$id);
    }

    setLoadingCreateWebhook(false);
  }

  async function deleteWH() {
    setLoadingDeleteWebhook(true);

    if (projectId) {
      const project = await deleteWebhook(projectId);
      await fetchProjects();

      if (project) {
        setprojectId(project);
        router.push(project);
      } else {
        setprojectId(null);
        router.push("/");
      }
    }

    setLoadingDeleteWebhook(false);
  }

  function onCopy() {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }

  return (
    <div>
      <p className="font-bold text-foreground text-sm mb-1">Endpoint</p>
      {projects.length == 0 && !loading ? (
        <Button onClick={create} size="sm">
          {loadingCreateWebhook ? (
            <>
              <LucideLoader2 className="animate-spin size-4 mr-2" />
              Creating Webhook
            </>
          ) : (
            <>
              <LucidePlus className="size-4 mr-2" />
              Create Webhook
            </>
          )}
        </Button>
      ) : null}
      {loading && <Skeleton className="h-8" />}
      {projects.length > 0 && !loading && (
        <div className="flex flex-col md:flex-row gap-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between text-muted-foreground font-normal truncate w-full md:w-auto"
              >
                <span className="truncate">
                  {location.protocol}&#47;&#47;
                  <span className="font-bold text-foreground">
                    {projectId ?? "not-found"}
                  </span>
                  .{HOSTNAME}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput
                  className="text-xs h-8"
                  placeholder="Search project..."
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((project) => (
                      <CommandItem
                        key={project.$id}
                        value={project.$id}
                        onSelect={(currentValue) => {
                          setprojectId(currentValue);
                          setOpen(false);
                          router.push(project.$id);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            projectId === project.$id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {project.$id}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-row gap-1 justify-end md:justify-start">
            <Button
              onClick={create}
              variant="outline"
              size="icon"
              className="flex-none size-8"
            >
              {loadingCreateWebhook ? (
                <LucideLoader2 className="animate-spin size-3.5" />
              ) : (
                <LucidePlus className="size-3.5" />
              )}
            </Button>
            <CopyToClipboard
              text={`${location.protocol}//${projectId}.${HOSTNAME}`}
              onCopy={onCopy}
            >
              <Button
                variant={copy ? "success" : "outline"}
                size="icon"
                className="flex-none size-8"
              >
                {!copy ? (
                  <LucideCopy className="size-3.5" />
                ) : (
                  <LucideCopyCheck className="size-3.5" />
                )}
              </Button>
            </CopyToClipboard>
            <Share />

            <Button
              onClick={deleteWH}
              variant="destructive"
              size="icon"
              className="flex-none size-8"
            >
              {loadingDeleteWebhook ? (
                <LucideLoader2 className="animate-spin size-3.5" />
              ) : (
                <LucideTrash className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
