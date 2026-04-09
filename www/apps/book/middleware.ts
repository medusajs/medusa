import { NextRequest, NextResponse } from "next/server"

const EXCLUDED_PREFIXES = [
  "/resources",
  "/api",
  "/ui",
  "/user-guide",
  "/cloud",
  "/md-content",
  "/_next",
  "/favicon",
]

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? ""

  if (
    accept.includes("text/markdown") ||
    accept.includes("text/plain")
  ) {
    const { pathname } = req.nextUrl
    const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    )

    if (!isExcluded) {
      const url = req.nextUrl.clone()
      url.pathname = `/md-content${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
