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
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, HOSTNAME, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { cn, createWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import {
  Check,
  ChevronsUpDown,
  LucideCopy,
  LucideCopyCheck,
  LucidePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function Project() {
  const router = useRouter();

  const [projectIdValue, setProjectIdValue] = useAtom(projectId);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [copy, setCopy] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProjects() {
      const { database } = createClient();

      const data = await database.listDocuments<ProjectItem>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID
      );

      setProjects(data.documents);
    }

    if (projects.length == 0) {
      fetchProjects();
    }
  }, [projects]);

  async function create() {
    const data = await createWebhook();

    if (data) {
      setProjects([...projects, data]);
      setProjectIdValue(data.$id);
      router.replace(data.$id);
    }
  }

  function onCopy() {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }

  return (
    <div>
      <p className="font-bold text-primary-foreground text-sm mb-1">Webhook</p>
      <div className="flex flex-row gap-1 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              http://
              <span className="font-bold">{projectIdValue ?? "loading"}</span>.
              {HOSTNAME}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Search project..." />
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
                        router.replace(project.$id);
                      }}
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
              <Button
                variant="ghost"
                className="justify-start rounded-none"
                onClick={create}
              >
                <LucidePlus className="size-3 mr-2" />
                Create Webhook
              </Button>
            </Command>
          </PopoverContent>
        </Popover>
        <CopyToClipboard
          text={`http://${projectIdValue}.${HOSTNAME}`}
          onCopy={onCopy}
        >
          <Button variant="outline" size="icon">
            {!copy ? (
              <LucideCopy className="size-3" />
            ) : (
              <LucideCopyCheck className="size-3 text-green-400" />
            )}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}
