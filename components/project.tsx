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
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, HOSTNAME, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { cn, createWebhook, deleteWebhook, leaveWebhook } from "@/lib/utils";

import { Query } from "appwrite";
import { useAtom } from "jotai";
import {
  Check,
  ChevronsUpDown,
  LucideCopy,
  LucideCopyCheck,
  LucideDoorOpen,
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
  const [owner, setOwner] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [loadingLeaveWebhook, setLoadingLeaveWebhook] =
    useState<boolean>(false);

  async function fetchProjects() {
    setLoading(true);
    const { database } = await createClient();

    const data = await database.listDocuments<ProjectItem>(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
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

  useEffect(() => {
    async function checkAuthorization() {
      setLoadingAuth(true);
      setOwner(false);
      const { team } = await createClient();
      const user = await getLoggedInUser();

      if (user && projectId) {
        const memberships = await team.listMemberships(projectId, [
          Query.equal("userId", user.$id),
        ]);

        if (memberships.memberships[0].roles.includes("owner")) {
          setOwner(true);
        }
      }
      setLoadingAuth(false);
    }

    checkAuthorization();
  }, [projectId]);

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

  async function leave() {
    setLoadingLeaveWebhook(true);

    if (projectId) {
      const project = await leaveWebhook(projectId);
      await fetchProjects();

      if (project) {
        setprojectId(project);
        router.push(project);
      } else {
        setprojectId(null);
        router.push("/");
      }
    }

    setLoadingLeaveWebhook(false);
  }

  function onCopy() {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }

  return (
    <div>
      <p className="mb-1 text-sm font-bold text-foreground">Endpoint</p>
      {projects.length == 0 && !loading ? (
        <Button onClick={create} size="sm">
          {loadingCreateWebhook ? (
            <>
              <LucideLoader2 className="mr-2 size-4 animate-spin" />
              Creating Webhook
            </>
          ) : (
            <>
              <LucidePlus className="mr-2 size-4" />
              Create Webhook
            </>
          )}
        </Button>
      ) : null}
      {loading && <Skeleton className="h-8" />}
      {projects.length > 0 && !loading && (
        <div className="flex flex-col gap-1 md:flex-row">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between truncate font-normal text-muted-foreground md:w-auto"
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
                  className="h-8 text-xs"
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
                              : "opacity-0",
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
          <div className="flex flex-row justify-end gap-1 md:justify-start">
            <Button
              onClick={create}
              variant="outline"
              size="icon"
              className="size-8 flex-none"
            >
              {loadingCreateWebhook ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
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
                className="size-8 flex-none"
              >
                {!copy ? (
                  <LucideCopy className="size-3.5" />
                ) : (
                  <LucideCopyCheck className="size-3.5" />
                )}
              </Button>
            </CopyToClipboard>
            {!loadingAuth && (
              <>
                {owner && <Share />}
                {owner && (
                  <Button
                    onClick={deleteWH}
                    variant="destructive"
                    size="icon"
                    className="size-8 flex-none"
                  >
                    {loadingDeleteWebhook ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideTrash className="size-3.5" />
                    )}
                  </Button>
                )}
                {!owner && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-8 flex-none"
                    onClick={leave}
                  >
                    {loadingLeaveWebhook ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideDoorOpen className="size-3.5" />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
