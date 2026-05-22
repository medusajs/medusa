import { addExtraToMd, workerCompatibleFetch } from "docs-utils"
import { readFileSync } from "fs"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import { fetchRawMdx } from "../../../utils/fetch-raw-mdx"
import { getCleanMdCached } from "../../../utils/get-clean-md-cached"

type Params = {
  params: Promise<{ slug?: string[] }>
}

const EXTERNAL_PREFIXES = ["resources", "api", "ui", "user-guide", "cloud"]

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin

  if (slug.length > 0 && EXTERNAL_PREFIXES.includes(slug[0])) {
    return notFound()
  }

  if (slug.length === 0) {
    const homepageFile = await workerCompatibleFetch({
      url: `${origin}/homepage.md`,
      useRemote: !!process.env.MC_ENV,
      responseTransformer: async (res) => res.text(),
      fallbackAction: async () =>
        readFileSync(
          path.join(process.cwd(), "public", "homepage.md"),
          "utf-8"
        ),
    })

    return new NextResponse(
      addExtraToMd(homepageFile, {
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

  const rawMdx = await fetchRawMdx(origin, slug)

  if (!rawMdx) {
    return notFound()
  }

  const cleanMdContent = await getCleanMdCached(slug.join("/"), {
    content: rawMdx.content,
    removeExtra: rawMdx.isOverride,
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
