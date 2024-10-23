import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Dev } from "@/providers/jotai-devtools";
import { IBMPlexMono } from "next/font/google";
import { redirect } from "next/navigation";

const font = IBMPlexMono({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased w-screen overflow-x-hidden min-h-dvh dark`}
      >
        {children}
        <Dev />
        <Toaster />
      </body>
    </html>
  );
}
