import { NextRequest, NextResponse } from "next/server"
import { PostHog } from "posthog-node"
import {
  AB_AI_FLAG,
  AB_AI_COOKIE,
  AB_DISTINCT_ID_COOKIE,
  AB_TEST_PAGES,
} from "./ab-tests"

const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // Don't batch in middleware — we need the result immediately
  flushAt: 1,
  flushInterval: 0,
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block direct access to variant pages
  if (pathname.includes("/variants/")) {
    const url = request.nextUrl.clone()
    // Strip the /variants/ai part to redirect to the original page
    url.pathname = pathname.replace(/\/variants\/[^/]+/, "")
    return NextResponse.redirect(url)
  }

  // Check if this path has an A/B test
  if (!(pathname in AB_TEST_PAGES)) {
    return NextResponse.next()
  }

  // Get or create a distinct ID for this user
  let distinctId = request.cookies.get(AB_DISTINCT_ID_COOKIE)?.value
  const isNewUser = !distinctId

  if (!distinctId) {
    distinctId = crypto.randomUUID()
  }

  // Check if we already have a cached variant decision
  let variant = request.cookies.get(AB_AI_COOKIE)?.value

  if (!variant) {
    try {
      // Evaluate the PostHog feature flag
      const flagValue = await posthogClient.getFeatureFlag(
        AB_AI_FLAG,
        distinctId
      )
      variant = typeof flagValue === "string" ? flagValue : "control"
    } catch {
      variant = "control"
    }
  }

  const response =
    variant === "ai"
      ? NextResponse.rewrite(new URL(AB_TEST_PAGES[pathname], request.url))
      : NextResponse.next()

  // Set cookies if needed
  if (isNewUser) {
    response.cookies.set(AB_DISTINCT_ID_COOKIE, distinctId, {
      maxAge: 60 * 60 * 24 * 90, // 90 days
      httpOnly: false, // readable by client-side PostHog bootstrap
      sameSite: "lax",
    })
  }

  if (!request.cookies.get(AB_AI_COOKIE)?.value) {
    response.cookies.set(AB_AI_COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 90, // 90 days
      httpOnly: false, // readable by client-side PostHog bootstrap
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: [
    // Match A/B tested pages and variant paths
    "/learn",
    "/learn/installation",
    "/learn/:path*/variants/:variant*",
  ],
}
