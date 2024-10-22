import { getLoggedInUser } from "@/lib/server/appwrite";

import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (user) {
    redirect("/account");
  }

  return (
    <main className="grid place-items-center w-full min-h-dvh">{children}</main>
  );
}
