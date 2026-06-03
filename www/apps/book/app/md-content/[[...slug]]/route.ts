import { addExtraToMd, workerCompatibleFetch } from "docs-utils"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import { getCleanMdCached } from "../../../utils/get-clean-md-cached"
import { fetchRawMdx } from "../../../utils/fetch-raw-mdx"

type Params = {
  params: Promise<{ slug?: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin

  if (slug.length === 0) {
    const homepageContent = await workerCompatibleFetch<string | null>({
      url: `${origin}/homepage.md`,
      responseTransformer: async (res) => {
        return res.ok ? res.text() : null
      },
      fallbackAction: async () => {
        try {
          const { promises: fs } = await import("fs")
          return await fs.readFile(
            path.join(process.cwd(), "public", "homepage.md"),
            "utf-8"
          )
        } catch {
          return null
        }
      },
    })

    if (!homepageContent) {
      return notFound()
    }

    return new NextResponse(
      addExtraToMd(homepageContent, {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
      }),
      {
        headers: {
          "content-type": "text/markdown",
          "cache-control": "public, max-age=3600, must-revalidate",
        },
        status: 200,
      }
    )
  }

  const result = await fetchRawMdx(origin, slug)
  if (!result) {
    return notFound()
  }

  const { content, isOverride } = result

  const cleanMdContent = await getCleanMdCached(content, {
    removeExtra: isOverride,
  })

  const acceptHeader = req.headers.get("accept") || ""
  if (
    acceptHeader.includes("text/plain") ||
    acceptHeader.includes("text/markdown")
  ) {
    const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })

    const urlObj = new URL(req.url)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}${urlObj.pathname}`

    client.capture({
      distinctId: "anonymous",
      event: "md_content_requested_agents",
      properties: {
        $current_url: url,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
      },
    })

    await client.shutdown()
  }

  return new NextResponse(cleanMdContent, {
    headers: {
      "content-type": "text/markdown",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
    status: 200,
  })
}
