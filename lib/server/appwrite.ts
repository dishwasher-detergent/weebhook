// src/lib/server/appwrite.js
"use server";
import { API_KEY, COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { cookies } from "next/headers";
import {
  Account,
  Client,
  Databases,
  Storage,
  Teams,
  Users,
} from "node-appwrite";

export async function createSessionClient() {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const session = cookies().get(COOKIE_KEY);
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get client() {
      return client;
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
    get teams() {
      return new Teams(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
