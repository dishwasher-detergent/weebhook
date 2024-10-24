"use client";

import { projectId } from "@/atoms/project";
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

  const [projectIdValue, setProjectIdValue] = useAtom(projectId);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoadingCreateWebhook, setIsLoadingCreateWebhook] =
    useState<boolean>(false);
  const [isLoadingDeleteWebhook, setIsLoadingDeleteWebhook] =
    useState<boolean>(false);
  const [copy, setCopy] = useState<boolean>(false);

  async function fetchProjects() {
    setLoading(true);
    const { database } = createClient();

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
    setIsLoadingCreateWebhook(true);
    const data = await createWebhook();

    if (data) {
      setProjects((prev) => [...prev, data]);
      setProjectIdValue(data.$id);
      router.push(data.$id);
    }

    setIsLoadingCreateWebhook(false);
  }

  async function deleteWH() {
    setIsLoadingDeleteWebhook(true);

    if (projectIdValue) {
      const project = await deleteWebhook(projectIdValue);

      if (project) {
        setProjectIdValue(project);
        router.push(project);
      } else {
        setProjectIdValue(null);
        router.push("/");
      }
    }

    setIsLoadingDeleteWebhook(false);
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
      {projects.length == 0 && !isLoading ? (
        <Button onClick={create} size="sm">
          {isLoadingCreateWebhook ? (
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
      {isLoading && <Skeleton className="h-8" />}
      {projects.length > 0 && !isLoading && (
        <div className="flex flex-row gap-1 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between text-muted-foreground font-normal truncate"
              >
                <span className="truncate">
                  {location.protocol}&#47;&#47;
                  <span className="font-bold text-foreground">
                    {projectIdValue ?? "not-found"}
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
                          setProjectIdValue(currentValue);
                          setOpen(false);
                          router.push(project.$id);
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            projectIdValue === project.$id
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
          <CopyToClipboard
            text={`${location.protocol}//${projectIdValue}.${HOSTNAME}`}
            onCopy={onCopy}
          >
            <Button variant="outline" size="icon" className="flex-none size-8">
              {!copy ? (
                <LucideCopy className="size-3.5" />
              ) : (
                <LucideCopyCheck className="size-3.5 text-green-400" />
              )}
            </Button>
          </CopyToClipboard>
          <Button
            onClick={create}
            variant="outline"
            size="icon"
            className="flex-none size-8"
          >
            {isLoadingCreateWebhook ? (
              <LucideLoader2 className="animate-spin size-3.5" />
            ) : (
              <LucidePlus className="size-3.5" />
            )}
          </Button>
          <Button
            onClick={deleteWH}
            variant="destructive"
            size="icon"
            className="flex-none size-8"
          >
            {isLoadingDeleteWebhook ? (
              <LucideLoader2 className="animate-spin size-3.5" />
            ) : (
              <LucideTrash className="size-3.5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
