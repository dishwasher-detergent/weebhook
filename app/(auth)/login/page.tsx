"use client";

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
import { signInWithEmail } from "./action";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  message: "",
  success: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signInWithEmail, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state]);

  return (
    <Card className="w-full max-w-sm bg-muted/25">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {state.message != "" ? (
            <p className="text-destructive-foreground p-4 rounded-xl border border-destructive border-dashed font-bold text-sm overflow-hidden w-full">
              {state.message}
            </p>
          ) : null}
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </CardFooter>
        <CardFooter>
          <p className="bg-background p-2 rounded-xl border border-dashed text-muted-foreground font-bold text-sm overflow-hidden w-full text-center text-xs">
            Don&apos;t have an account?
            <Button
              variant="link"
              asChild
              className="text-muted-foreground font-bold p-1 text-xs"
            >
              <Link href="/signup">Create one here</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
