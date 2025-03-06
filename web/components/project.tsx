"use client";

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
import { FUNCTION_DOMAIN, HOSTNAME } from "@/lib/constants";
import {
  checkAuth,
  createProject,
  deleteProject,
  getProjects,
  leaveProject,
} from "@/lib/server/utils";
import { cn } from "@/lib/utils";

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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import Link from "next/link";

export function Project() {
  const router = useRouter();
  const { project: projectId } = useParams<{
    project: string;
  }>();

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCreateWebhook, setLoadingCreateWebhook] =
    useState<boolean>(false);
  const [loadingDeleteWebhook, setLoadingDeleteWebhook] =
    useState<boolean>(false);
  const [copy, setCopy] = useState<boolean>(false);
  const [loadingLeaveWebhook, setLoadingLeaveWebhook] =
    useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [owner, setOwner] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuthorization() {
      setLoadingAuth(true);
      setOwner(false);

      const data = await checkAuth(projectId);

      if (!data.success) {
        toast.error(data.message);
        router.push("/");
      }

      if (data.data) {
        setOwner(data.data.isOwner);
      }

      setLoadingAuth(false);
    }

    checkAuthorization();
  }, [projectId]);

  async function fetchProjects() {
    setLoading(true);

    const data = await getProjects();

    if (!data.success) {
      toast.error(data.message);
    }

    if (data?.data) {
      setProjects(data.data);
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
    const data = await createProject();

    if (!data.success) {
      toast.error(data.message);
    }

    if (data.data) {
      router.push(`/project/${data.data.$id}`);
    }

    setLoadingCreateWebhook(false);
  }

  async function deleteProj() {
    setLoadingDeleteWebhook(true);

    if (projectId) {
      const data = await deleteProject(projectId);
      await fetchProjects();

      if (!data.success) {
        toast.error(data.message);
      }

      if (data.success && data.data) {
        router.push(data.data);
      } else {
        router.push("/");
      }
    }

    setLoadingDeleteWebhook(false);
  }

  async function leave() {
    setLoadingLeaveWebhook(true);

    if (projectId) {
      const project = await leaveProject(projectId);
      await fetchProjects();

      if (project.success && project.data) {
        router.push(project.data);
      } else {
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
                  projects/{projectId ?? "not-found"}
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
                          setOpen(false);
                        }}
                        className="cursor-pointer text-xs"
                        asChild
                      >
                        <Link href={project.$id}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              projectId === project.$id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {project.$id}
                        </Link>
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
              text={`${FUNCTION_DOMAIN}/projects/${projectId}`}
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
                    onClick={deleteProj}
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
