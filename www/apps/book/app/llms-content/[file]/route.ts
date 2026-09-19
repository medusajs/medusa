import { notFound } from "next/navigation"
import { after, NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import { fetchAssetResponse } from "../../../utils/fetch-asset-response"

const ALLOWED_FILES = new Set(["llms.txt", "llms-full.txt"])

type Params = {
  params: Promise<{ file: string }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { file } = await params

  if (!ALLOWED_FILES.has(file)) {
    return notFound()
  }

  const origin = new URL(req.url).origin
  const assetRes = await fetchAssetResponse(`${origin}/${file}`)

  let body: BodyInit | null = assetRes?.body ?? null

  if (!assetRes) {
    try {
      const { promises: fs } = await import("fs")
      body = await fs.readFile(
        path.join(process.cwd(), "public", file),
        "utf-8"
      )
    } catch {
      return notFound()
    }
  }

  after(async () => {
    const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })

    client.capture({
      distinctId: "anonymous",
      event: "llms_txt_requested",
      properties: {
        $current_url: `${process.env.NEXT_PUBLIC_BASE_URL || origin}/${file}`,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
        $ip:
          req.headers.get("cf-connecting-ip") ||
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          undefined,
        file,
        referrer: req.headers.get("referer") || undefined,
      },
    })

    await client.shutdown()
  })

  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
    status: 200,
  })
}
