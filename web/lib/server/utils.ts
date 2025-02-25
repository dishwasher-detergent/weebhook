"use server";

import { generate } from "random-words";
import { Permission, Query, Role } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { Project } from "@/interfaces/project.interface";
import { Result } from "@/interfaces/result.interface";
import { Request } from "@/interfaces/request.interface";
import {
  COOKIE_KEY,
  DATABASE_ID,
  HOSTNAME,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";

export const getProject = cache(
  async (projectId: string): Promise<Result<any>> => {
    const user = await getLoggedInUser();

    if (!user) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    const { database } = await createSessionClient();

    try {
      const proj = await database.getDocument<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        projectId,
      );

      if (!proj) throw new Error("Missing project.");

      const requests = await database.listDocuments<Request>(
        DATABASE_ID,
        REQUEST_COLLECTION_ID,
        [Query.equal("projectId", projectId), Query.orderDesc("$createdAt")],
      );

      proj.requests = requests.documents;

      return {
        success: true,
        message: "Project retrieved successfully.",
        data: proj,
      };
    } catch (error) {
      return {
        success: false,
        message: "An unexpected error occurred. Could not get project.",
      };
    }
  },
);

export const getProjects = cache(async (): Promise<Result<Project[]>> => {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const org = await database.listDocuments<Project>(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
    );

    return {
      success: true,
      message: "Projects retrieved successfully.",
      data: org.documents,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not get projects.",
    };
  }
});

export async function createProject(): Promise<Result<Project>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();
  const maxCheckCount = 5;
  let id = generate({
    exactly: 10,
    wordsPerString: 3,
    separator: "-",
  }) as string[];

  const joinedTeams = await team.list();

  if (joinedTeams.total >= 2) {
    return {
      success: false,
      message: "You've reached the maximum project limit.",
    };
  }

  let doesProjectExist = true;
  let checks = 0;
  let projectId;

  try {
    do {
      checks++;
      const checkedProjects = await database.listDocuments<Project>(
        DATABASE_ID,
        PROJECT_COLLECTION_ID,
        [Query.equal("$id", id)],
      );

      if (checkedProjects.total < 10) {
        doesProjectExist = false;
        projectId = id.filter(
          (x) => !checkedProjects.documents.map((y) => y.$id).includes(x),
        )[0];
      } else {
        id = generate({
          exactly: 10,
          wordsPerString: 3,
          separator: "-",
        }) as string[];
      }
    } while (doesProjectExist == true || checks == maxCheckCount);
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Could not create project.",
    };
  }

  if (checks == maxCheckCount) {
    return {
      success: false,
      message: "Could not find valid project name.",
    };
  }

  if (!projectId) {
    return {
      success: false,
      message: "Could not generate valid project name.",
    };
  }

  try {
    const teamData = await team.create(projectId, projectId);

    const data = await database.createDocument<Project>(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
      projectId,
      {
        shared: false,
        description: null,
      },
      [
        Permission.read(Role.team(teamData.$id)),
        Permission.write(Role.team(teamData.$id)),
        Permission.read(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ],
    );

    return {
      success: true,
      message: `${data.$id} has been created!`,
      data: data,
    };
  } catch {
    return {
      success: false,
      message: `Failed to create ${projectId}!`,
    };
  }
}

export async function deleteProject(
  projectId: string,
): Promise<Result<string>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  let response;
  const queries = [Query.limit(50), Query.equal("projectId", projectId)];

  do {
    response = await database.listDocuments<Request>(
      DATABASE_ID,
      REQUEST_COLLECTION_ID,
      queries,
    );

    await Promise.all(
      response.documents.map((document) =>
        database.deleteDocument(
          DATABASE_ID,
          REQUEST_COLLECTION_ID,
          document.$id,
        ),
      ),
    );
  } while (response.documents.length > 0);

  await team.delete(projectId);
  await database.deleteDocument(DATABASE_ID, PROJECT_COLLECTION_ID, projectId);

  const data = await database.listDocuments<Project>(
    DATABASE_ID,
    PROJECT_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  if (data.documents.length > 0) {
    return {
      success: true,
      message: `${projectId} has been deleted!`,
      data: data.documents[0].$id,
    };
  }

  return {
    success: true,
    message: `${projectId} has been deleted!`,
  };
}

export async function leaveProject(projectId: string): Promise<Result<string>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  const memberships = await team.listMemberships(projectId, [
    Query.equal("userId", user.$id),
  ]);

  const membership = memberships.memberships[0];

  if (!membership) {
    return {
      success: false,
      message: `An error occured while leaving ${projectId}, please try again.`,
    };
  }

  if (membership.roles.includes("owner")) {
    return {
      success: false,
      message: "The owner cannot leave their own project, delete it instead.",
    };
  }

  await team.deleteMembership(projectId, membership.$id);

  const data = await database.listDocuments<Project>(
    DATABASE_ID,
    PROJECT_COLLECTION_ID,
    [Query.orderDesc("$createdAt"), Query.limit(1)],
  );

  if (data.documents.length > 0) {
    return {
      success: true,
      message: `You've left ${projectId}!`,
      data: data.documents[0].$id,
    };
  }

  return {
    success: true,
    message: `You've left ${projectId}!`,
  };
}

export async function shareProject(
  projectId: string,
  email: string,
): Promise<Result<null>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await team.createMembership(
      projectId,
      [],
      email,
      undefined,
      undefined,
      `${location.protocol}//${HOSTNAME}/${projectId}/accept`,
      undefined,
    );
  } catch {
    return {
      success: false,
      message: `Failed to invite ${email} to ${projectId}`,
    };
  }

  return {
    success: true,
    message: `${email} has been invited to ${projectId}`,
  };
}

export async function checkAuth(projectId: string): Promise<Result<any>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  const memberships = await team.listMemberships(projectId, [
    Query.equal("userId", user.$id),
  ]);

  return {
    success: true,
    message: "Project permissions retrieved successfully.",
    data: {
      isOwner: memberships.memberships[0].roles.includes("owner"),
      isMember: memberships.memberships.length > 0,
    },
  };
}

export async function logOut() {
  const { account } = await createSessionClient();

  account.deleteSession("current");
  (await cookies()).delete(COOKIE_KEY);

  redirect("/login");
}
