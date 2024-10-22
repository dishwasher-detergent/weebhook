"use server"

import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    const { account } = await createAdminClient();
  
    await account.create(ID.unique(), email, password);
    const session = await account.createEmailPasswordSession(email, password);
  
    cookies().set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: false,
      sameSite: "strict",
      secure: true,
    });
  
    redirect("/");
  }