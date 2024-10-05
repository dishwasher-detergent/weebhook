import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signInWithEmail(formData: any) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

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

export default async function SignInPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
      <form action={signInWithEmail}>
        <input id="email" name="email" placeholder="Email" type="email" />
        <input
          id="password"
          name="password"
          placeholder="Password"
          minLength={8}
          type="password"
        />
        <button type="submit">Sign In</button>
      </form>
    </>
  );
}
