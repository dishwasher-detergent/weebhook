import { Project } from "@/interfaces/project.interface";
import { createClient, getLoggedInUser } from "@/lib/client/appwrite";
import {
  DATABASE_ID,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from "@/lib/constants";

import { Permission, Query, Role } from "appwrite";
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
  const maxCheckCount = 5;
  let id = generate({ exactly: 10, wordsPerString: 3, separator: "-" });

  if (!user) {
    return;
  }

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    toast.error("You've reached the maximum webhook limit.");
    return null;
  }

  let doesProjectExist = true;
  let checks = 0;

  do {
    checks++;
    const checkedProjects = await database.listDocuments(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
      [Query.equal("$id", id)]
    );

    if (checkedProjects.total == 0) {
      doesProjectExist = false;
    } else {
      id = generate({ exactly: 10, wordsPerString: 3, separator: "-" });
    }
  } while (doesProjectExist == true || checks == maxCheckCount);

  if (checks == maxCheckCount) {
    toast.error("Could not find valid project name.");

    return;
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
      Permission.write(Role.team(teamData.$id)),
      Permission.read(Role.user(user?.$id)),
      Permission.write(Role.user(user?.$id)),
    ]
  );

  toast.success(`${data.$id} has been created!`);

  return data;
}

export async function deleteWebhook(projectId: string) {
  const { database, team } = createClient();
  const user = await getLoggedInUser();

  if (!user) {
    return;
  }

  let response;
  const queries = [Query.limit(50), Query.equal("projectId", projectId)];

  do {
    response = await database.listDocuments(
      DATABASE_ID,
      REQUEST_COLLECTION_ID,
      queries
    );

    await Promise.all(
      response.documents.map((document) =>
        database.deleteDocument(
          DATABASE_ID,
          REQUEST_COLLECTION_ID,
          document.$id
        )
      )
    );
  } while (response.documents.length > 0);

  await team.delete(projectId);
  await database.deleteDocument(DATABASE_ID, PROJECT_COLLECTION_ID, projectId);

  const data = await database.listDocuments(
    DATABASE_ID,
    PROJECT_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)]
  );

  toast.error(`${projectId} has been deleted!`);

  if (data.documents.length > 0) {
    return data.documents[0].$id;
  }

  return null;
}
