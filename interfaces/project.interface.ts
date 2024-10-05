import { Models } from "node-appwrite";

export interface Project extends Models.Document {
  shared: boolean;
  description: string;
}
