import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient, getLoggedInUser } from "@/lib/server/appwrite";

import { cookies } from "next/headers";
import Link from "next/link";
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

export default async function LoginPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form action={signInWithEmail}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              name="password"
              placeholder="Password"
              minLength={8}
            />
          </div>
          <p className="font-semibold text-sm">
            Don't have an account? <Link href="/signup">Create one here</Link>.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
