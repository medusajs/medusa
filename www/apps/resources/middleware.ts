import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? ""

  if (accept.includes("text/markdown") || accept.includes("text/plain")) {
    const { pathname } = req.nextUrl
    const url = req.nextUrl.clone()
    url.pathname = `/md-content${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|md-content).*)",
}
