import { NextRequest } from "next/server"
import { PostHog } from "posthog-node"

type Body = {
  agent?: string
  path?: string
  feedback?: string
  [key: string]: unknown
}

export async function POST(req: NextRequest) {
  const { agent, path, feedback, ...rest } = (await req.json()) as Body

  if (!agent || !path || !feedback) {
    return new Response("Missing required fields", { status: 400 })
  }
  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })

  const urlObj = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`
  )

  client.capture({
    distinctId: "anonymous",
    event: "agent_feedback_submitted",
    properties: {
      $current_url: urlObj.toString(),
      $raw_user_agent: req.headers.get("user-agent") || undefined,
      agent,
      feedback,
      other: JSON.stringify(rest),
    },
  })

  await client.shutdown()

  return new Response("Feedback submitted successfully", { status: 200 })
}
