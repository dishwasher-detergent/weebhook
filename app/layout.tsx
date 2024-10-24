import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { Dev } from "@/providers/jotai-devtools";
import { Noto_Sans_Mono as Font } from "next/font/google";

const font = Font({
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
        className={`${font.className} antialiased w-screen overflow-x-hidden min-h-dvh`}
      >
        {children}
        <Dev />
        <Toaster />
      </body>
    </html>
  );
}
