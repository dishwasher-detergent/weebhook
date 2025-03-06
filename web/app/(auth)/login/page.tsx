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
import { LucideLoader2 } from "lucide-react";
import { toast } from "sonner";

const initialState = {
  message: "",
  success: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signInWithEmail,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/");
    }

    if (!state.success && state.message != "") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card className="bg-muted/25 w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            )}
            Login
          </Button>
        </CardFooter>
        <CardFooter>
          <p className="border-primary/50 bg-background text-muted-foreground w-full overflow-hidden rounded-md border border-dashed p-2 text-center text-sm font-bold">
            Don&apos;t have an account?
            <Button
              variant="link"
              asChild
              className="text-muted-foreground p-1 text-xs font-bold"
            >
              <Link href="/signup">Create one here</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
