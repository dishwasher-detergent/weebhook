import { atom } from "jotai";

export const projectId = atom("test");

if (process.env.NODE_ENV !== "production") {
  projectId.debugLabel = "Selected Project";
}
