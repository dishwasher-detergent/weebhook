import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  console.log(req.headers);

  let hostname = req.headers.get("host")!;

  console.log(hostname);

  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    hostname === `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    hostname.endsWith("vercel.app")
  ) {
    console.log("test");

    return NextResponse.rewrite(req.url);
  }

  const route = hostname.split(".")[0];

  console.log(route);

  // return NextResponse.rewrite(new URL(`/api/${route}`, req.url));
  return NextResponse.next();
}
