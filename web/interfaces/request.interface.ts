import { Models } from "appwrite";

export interface Request extends Models.Document {
  projectId: string;
  headers: string;
  body: string;
  type: "get" | "post" | "put" | "patch" | "delete";
}
