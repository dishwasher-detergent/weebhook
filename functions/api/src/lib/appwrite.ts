import { Client, Databases, ID, Models } from 'node-appwrite';

export const ENDPOINT = process.env.APPWRITE_FUNCTION_API_ENDPOINT as string;
export const PROJECT_ID = process.env.APPWRITE_FUNCTION_PROJECT_ID as string;
export const API_KEY = process.env.API_KEY as string;
export const DATABASE_ID = process.env.DATABASE_ID as string;

// Collections
export const REQUEST_COLLECTION_ID = process.env
  .REQUEST_COLLECTION_ID as string;
export const USER_COLLECTION_ID = process.env.USER_COLLECTION_ID as string;
export const PROJECT_COLLECTION_ID = process.env
  .PROJECT_COLLECTION_ID as string;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const database = new Databases(client);

export const database_service = {
  /**
   * Retrieves information from the database based on the provided document ID and collection ID.
   *
   * @template {T} - The type of the document to retrieve.
   * @param {string} collectionId - The ID of the collection where the document is stored.
   * @param {string} id - The ID of the document to retrieve.
   * @returns A promise that resolves to the retrieved document.
   */
  async get<T extends Models.Document>(collectionId: string, id: string) {
    const response = await database.getDocument<T>(
      DATABASE_ID,
      collectionId,
      id
    );

    return response;
  },

  /**
   * Retrieves a list of documents from a specific collection.
   *
   * @template {T} - The type of the documents to retrieve.
   * @param {string} collectionId - The ID of the collection to retrieve documents from.
   * @returns A promise that resolves to an array of documents of type T.
   */
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

  /**
   * Creates a new document in the specified collection with the provided data.
   * @template {T} - The type of the document created.
   * @param collectionId - The ID of the collection where the document will be created.
   * @param data
   * @returns A promise that resolves to the created document.
   */
  async create<T extends Models.Document>(
    collectionId: string,
    data: any,
    permissions: string[] = []
  ) {
    const response = await database.createDocument<T>(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data,
      permissions
    );

    return response;
  },
};
