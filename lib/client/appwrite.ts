"use client";

import { COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";

import { Account, Client, Databases, Storage, Teams } from "appwrite";
import { getCookie } from "cookies-next";

export function createClient() {
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
    get team() {
      return new Teams(client);
    },
    get client() {
      return client;
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = createClient();
    return await account.get();
  } catch {
    return null;
  }
}
