import {
  DATABASE_ID,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

import { ID, Permission, Role } from "node-appwrite";

export async function POST(
  request: Request,
  { params }: { params: { project: string } }
) {
  const { database } = await createAdminClient();
  const projectId = params.project;
  const res = await request.json();
  const headers: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let project;

  try {
    project = await database.getDocument(
      DATABASE_ID,
      PROJECT_COLLECTION_ID,
      projectId
    );
  } catch {
    return Response.json(
      { error: `Project ID '${projectId}' was not found.` },
      { status: 404 }
    );
  }

  try {
    const data = await database.createDocument(
      DATABASE_ID,
      REQUEST_COLLECTION_ID,
      ID.unique(),
      {
        projectId: projectId,
        headers: JSON.stringify(headers),
        body: JSON.stringify(res),
      },
      [Permission.read(Role.any())]
    );

    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
