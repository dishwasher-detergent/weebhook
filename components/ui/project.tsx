"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import { Project as ProjectItem } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, HOSTNAME, PROJECT_COLLECTION_ID } from "@/lib/constants";

import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown, LucideClipboard } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function Project() {
  const [projectIdValue, setProjectIdValue] = useAtom(projectId);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { database } = await createClient();
      const user = await getLoggedInUser();

      console.log(user);

      const data = await database.listDocuments<ProjectItem>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID
      );

      console.log(data);

      setProjects(data.documents);
    }

    fetchProjects();
  }, []);

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
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          projectIdValue === project.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {project.$id}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon">
          <LucideClipboard className="size-4" />
        </Button>
      </div>
    </div>
  );
}
