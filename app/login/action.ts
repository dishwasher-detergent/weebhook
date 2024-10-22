"use server"

import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {  
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    const { account } = await createAdminClient();
  
    const session = await account.createEmailPasswordSession(email, password);
  
    cookies().set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: false,
      sameSite: "strict",
      secure: true,
    });
  
    redirect("/");
  }