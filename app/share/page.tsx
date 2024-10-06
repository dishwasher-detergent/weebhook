"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SharePage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Shared</CardTitle>
        <CardDescription>You've had a webhook shared with you.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" type="submit">
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
