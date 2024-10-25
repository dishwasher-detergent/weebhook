import { atomWithStorage } from "jotai/utils";

export const projectIdAtom = atomWithStorage<string | null>(
  "PROJECT_ID",
  null,
  undefined,
  {
    getOnInit: true,
  }
);

if (process.env.NODE_ENV !== "production") {
  projectIdAtom.debugLabel = "Selected Project";
}
