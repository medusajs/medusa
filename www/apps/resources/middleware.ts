import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? ""

  if (accept.includes("text/markdown") || accept.includes("text/plain")) {
    const { pathname } = req.nextUrl
    const url = req.nextUrl.clone()
    const cleanPathname =
      pathname !== "/" && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname
    url.pathname = `/md-content${cleanPathname === "/" ? "" : cleanPathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|md-content).*)",
}
