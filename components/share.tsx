"use client";

import { projectId } from "@/atoms/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn, shareWebhook } from "@/lib/utils";

import { useAtom } from "jotai";
import { LucideLoader2, LucideShare2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Share() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="size-8">
            <LucideShare2 className="size-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Webhook</DialogTitle>
            <DialogDescription className="text-xs">
              Enter the email of whomever you want to share with.
            </DialogDescription>
          </DialogHeader>
          <Form setOpen={(e: boolean) => setOpen(e)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="size-8">
          <LucideShare2 className="size-3.5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Share Webhook</DrawerTitle>
          <DrawerDescription className="text-xs">
            Enter the email of whomever you want to share with.
          </DrawerDescription>
        </DrawerHeader>
        <Form className="px-4" setOpen={(e: boolean) => setOpen(e)} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
}

function Form({ className, setOpen }: FormProps) {
  const [projectIdValue, setProjectIdValue] = useAtom(projectId);

  const [isLoadingShareWebhook, setIsLoadingShareWebhook] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  async function share() {
    setIsLoadingShareWebhook(true);

    if (!projectIdValue) {
      toast.error("No webhook specified!");
      return;
    }

    if (!email) {
      toast.error("No email specified!");
      return;
    }

    await shareWebhook(projectIdValue, email);

    setIsLoadingShareWebhook(false);
    setOpen(false);
  }

  return (
    <div className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          placeholder="person@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button onClick={share}>
        {isLoadingShareWebhook ? (
          <LucideLoader2 className="animate-spin size-3.5 mr-2" />
        ) : (
          <LucideShare2 className="size-3.5 mr-2" />
        )}
        Share
      </Button>
    </div>
  );
}
