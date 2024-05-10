import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (
    process.env.NEXT_PUBLIC_VERSIONING !== "true" &&
    request.url.includes("/v2")
  ) {
    const url = new URL(request.url)
    return NextResponse.redirect(
      new URL(url.pathname.replace("/v2", ""), request.url)
    )
  }
}

export const config = {
  matcher: "/api/:path*",
}
