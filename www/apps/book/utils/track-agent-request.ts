import { getAgentName } from "docs-utils"
import { after, NextRequest } from "next/server"
import { PostHog } from "posthog-node"

/**
 * Captures a PostHog event for a request made by an agent, with the agent's
 * name, after the response is sent.
 */
export const trackAgentRequest = (
  req: NextRequest,
  event: string,
  properties: Record<string, unknown> = {}
) => {
  const userAgent = req.headers.get("user-agent")
  const { pathname } = new URL(req.url)

  after(async () => {
    const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })

    client.capture({
      distinctId: "anonymous",
      event,
      properties: {
        $current_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}${pathname}`,
        $raw_user_agent: userAgent || undefined,
        $ip:
          req.headers.get("cf-connecting-ip") ||
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          undefined,
        agent: getAgentName(userAgent),
        referrer: req.headers.get("referer") || undefined,
        ...properties,
      },
    })

    await client.shutdown()
  })
}
