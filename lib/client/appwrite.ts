"use client";

import { COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";

import { Account, Client, Databases, Storage } from "appwrite";
import { getCookie } from "cookies-next";

export async function createClient() {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const cookie = getCookie(COOKIE_KEY);

  if (cookie) {
    client.setSession(cookie);
  }

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

export async function getLoggedInUser() {
  try {
    const { account } = await createClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
