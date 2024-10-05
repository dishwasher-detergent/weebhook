"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, HOSTNAME, PROJECT_COLLECTION_ID } from "@/lib/constants";
import { generate } from "random-words";

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
import { cn } from "@/lib/utils";

import { Permission, Role } from "appwrite";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown, LucideCopy, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function Project() {
  const router = useRouter();

  const [projectIdValue, setProjectIdValue] = useAtom(projectId);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { database } = createClient();

      const data = await database.listDocuments<ProjectItem>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID
      );

      setProjects(data.documents);
    }

    fetchProjects();
  }, []);

  async function createWebhook() {
    const { database, team } = createClient();
    const user = await getLoggedInUser();
    const id = generate({ exactly: 1, wordsPerString: 3, separator: "-" });

    if (!user) {
      return;
    }

    const teamData = await team.create(id[0], id[0]);

    const data = await database.createDocument<ProjectItem>(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
      id[0],
      {
        shared: false,
        description: null,
      },
      [
        Permission.read(Role.team(teamData.$id)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ]
    );

    setProjects([...projects, data]);
  }

  return (
    <div>
      <p className="font-bold text-primary text-sm">Webhook</p>
      <div className="flex flex-row gap-1 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {projectIdValue ? (
                <>
                  http://
                  <span className="font-bold">
                    {
                      projects.find((project) => project.$id === projectIdValue)
                        ?.$id
                    }
                  </span>
                  .{HOSTNAME}
                </>
              ) : (
                "Select project..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
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
                        setProjectIdValue(
                          currentValue === projectIdValue ? "" : currentValue
                        );
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
                onClick={createWebhook}
              >
                <LucidePlus className="size-3 mr-2" />
                Create Webhook
              </Button>
            </Command>
          </PopoverContent>
        </Popover>
        <CopyToClipboard text={`http://${projectIdValue}.${HOSTNAME}`}>
          <Button variant="ghost" size="icon">
            <LucideCopy className="size-3" />
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
}
