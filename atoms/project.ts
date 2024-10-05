import { atomWithStorage } from "jotai/utils";

export const projectId = atomWithStorage<string | null>("PROJECT_ID", null);

if (process.env.NODE_ENV !== "production") {
  projectId.debugLabel = "Selected Project";
}
