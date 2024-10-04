import { databaseService } from "@/lib/appwrite";
import { PROJECT_COLLECTION_ID, REQUEST_COLLECTION_ID } from "@/lib/constants";

export async function POST(
  request: Request,
  { params }: { params: { project: string } }
) {
  const projectId = params.project;
  const res = await request.json();
  const headers: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    await databaseService.get(PROJECT_COLLECTION_ID, projectId);
  } catch (error) {
    return Response.json(
      { error: `Project ID '${projectId}' was not found.` },
      { status: 404 }
    );
  }

  try {
    const data = await databaseService.create(REQUEST_COLLECTION_ID, {
      projectId: projectId,
      headers: JSON.stringify(headers),
      body: JSON.stringify(res),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
