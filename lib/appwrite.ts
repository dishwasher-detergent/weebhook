import { API_KEY, DATABASE_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Storage,
} from "node-appwrite";

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const database = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
const avatars = new Avatars(client);

export const authService = {
  async signOut() {
    await account.deleteSession("current");
  },
  async getAccount() {
    return await account.get<any>();
  },
  async getSession() {
    return await account.getSession("current");
  },
  getAccountPicture(name: string) {
    return avatars.getInitials(name, 256, 256).toString();
  },
  async getPrefs() {
    return await account.getPrefs();
  },
  async updatePrefs(prefs: Object) {
    return await account.updatePrefs(prefs);
  },
};

export const databaseService = {
  async get<T extends Models.Document>(collectionId: string, id: string) {
    const response = await database.getDocument<T>(
      DATABASE_ID,
      collectionId,
      id
    );

    return response;
  },
  async list<T extends Models.Document>(
    collectionId: string,
    queries: string[] = []
  ) {
    const response = await database.listDocuments<T>(
      DATABASE_ID,
      collectionId,
      queries
    );

    return response;
  },
  async create<T extends Models.Document>(
    collectionId: string,
    data: Omit<T, keyof Models.Document>,
    id: string = ID.unique(),
    permissions: string[] = []
  ) {
    const response = await database.createDocument<T>(
      DATABASE_ID,
      collectionId,
      id,
      data,
      permissions
    );

    return response;
  },
  async update<T extends Models.Document>(
    collectionId: string,
    data: Omit<T, keyof Models.Document>,
    id: string
  ) {
    const response = await database.updateDocument<T>(
      DATABASE_ID,
      collectionId,
      id,
      data
    );

    return response;
  },
  async delete(collectionId: string, id: string) {
    const response = await database.deleteDocument(
      DATABASE_ID,
      collectionId,
      id
    );

    return response;
  },
};

export const storageService = {
  async get(bucketId: string, id: string) {
    const response = await storage.getFile(bucketId, id);

    return response;
  },
  async list(bucketId: string) {
    const response = await storage.listFiles(bucketId);

    return response;
  },
  async upload(bucketId: string, file: File, id: string = ID.unique()) {
    const response = await storage.createFile(bucketId, id, file);

    return response;
  },
  async delete(bucketId: string, id: string) {
    const response = await storage.deleteFile(bucketId, id);

    return response;
  },
};
