import { addExtraToMd } from "docs-utils"
import { existsSync, readFileSync } from "fs"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import { getCleanMdCached } from "../../../utils/get-clean-md-cached"

type Params = {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug = ["/"] } = await params

  if (slug[0] === "/") {
    const homepageFile = readFileSync(
      path.join(process.cwd(), "public", "homepage.md"),
      "utf-8"
    )

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

  // keep this so that Vercel keeps the files in deployment
  const basePath = path.join(process.cwd(), "app")
  const filePath = path.join(basePath, ...slug, "page.mdx")
  const mdContentFilePath = path.join(basePath, ...slug, "_md-content.mdx")
  // An `_md-content.mdx` file overrides the `page.mdx` file if it exists.
  const existingPath = existsSync(mdContentFilePath)
    ? mdContentFilePath
    : existsSync(filePath)
      ? filePath
      : null

  if (!existingPath) {
    return notFound()
  }

  const cleanMdContent = await getCleanMdCached(existingPath, {
    removeExtra: existingPath === mdContentFilePath,
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
