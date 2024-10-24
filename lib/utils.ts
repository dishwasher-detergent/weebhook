import { Project } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import { DATABASE_ID, PROJECT_COLLECTION_ID } from "@/lib/constants";

import { Permission, Role } from "appwrite";
import { clsx, type ClassValue } from "clsx";
import { generate } from "random-words";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createWebhook() {
  const { database, team } = createClient();
  const user = await getLoggedInUser();
  const id = generate({ exactly: 1, wordsPerString: 3, separator: "-" });

  if (!user) {
    return;
  }

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    toast.error("You've reached the maximum webhook limit.");
    return null;
  }

  const teamData = await team.create(id[0], id[0]);

  const data = await database.createDocument<Project>(
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

  return data;
}
