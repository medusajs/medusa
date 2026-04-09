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

  if (accept.includes("text/markdown") || accept.includes("text/plain")) {
    const { pathname } = req.nextUrl
    const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    )

    if (!isExcluded) {
      const url = req.nextUrl.clone()
      // Strip trailing slash (except for root) to avoid Next.js redirect dropping the Accept header
      const cleanPathname =
        pathname !== "/" && pathname.endsWith("/")
          ? pathname.slice(0, -1)
          : pathname
      url.pathname = `/md-content${cleanPathname === "/" ? "" : cleanPathname}`
      return NextResponse.rewrite(url)
    }
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
