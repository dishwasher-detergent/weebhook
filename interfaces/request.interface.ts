import { Models } from "node-appwrite";

export interface RequestItem extends Models.Document {
  projectId: string;
  headers: string;
  body: string;
  ipAddress: string;
}
