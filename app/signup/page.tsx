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
import { ID } from "node-appwrite";
import { toast } from "sonner";

async function signUpWithEmail(formData: FormData) {
  "use server";

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

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <Card className="w-full max-w-sm bg-muted">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Enter your email below to create to your account.
        </CardDescription>
      </CardHeader>
      <form action={async (formData: any) => {
          try {
            signUpWithEmail(formData)
          } catch (err) {
            const error = err as Error;
            toast.error(error.message)
          }
        }}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Create Account
          </Button>
        </CardFooter>
        <CardFooter>
          <p className="bg-background p-4 rounded-xl border border-dashed text-muted-foreground font-bold text-sm overflow-hidden w-full">
            Already have an account?
            <Button
              variant="link"
              asChild
              className="text-muted-foreground font-bold p-1"
            >
              <Link href="/login">Login here</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
