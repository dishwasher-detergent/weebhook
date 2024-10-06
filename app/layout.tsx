import "./globals.css";

import { Dev } from "@/providers/jotai-devtools";
import { Karla } from "next/font/google";

const font = Karla({
  subsets: ["latin"],
});

export default function RootLayout({
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
      </body>
    </html>
  );
}
