import { getCleanMd, PLAINTEXT_DOC_MESSAGE } from "docs-utils"
import { existsSync } from "fs"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import {
  addUrlToRelativeLink,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"
import type { Plugin } from "unified"

type Params = {
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug = ["/"] } = await params

  // keep this so that Vercel keeps the files in deployment
  const basePath = path.join(process.cwd(), "app")
  const filePath = path.join(basePath, ...slug, "page.mdx")

  if (!existsSync(filePath)) {
    return notFound()
  }

  const cleanMdContent = await getCleanMd_(filePath, {
    before: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            docs: {
              url: process.env.NEXT_PUBLIC_DOCS_URL,
              path: "",
            },
            cloud: {
              url: process.env.NEXT_PUBLIC_CLOUD_URL,
            },
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            ui: {
              url: process.env.NEXT_PUBLIC_UI_URL,
            },
            api: {
              url: process.env.NEXT_PUBLIC_API_URL,
            },
            "user-guide": {
              projectPath: path.resolve("..", "user-guide"),
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [localLinksRehypePlugin],
    ] as unknown as Plugin[],
    after: [
      [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
    ] as unknown as Plugin[],
  })

  const acceptHeader = req.headers.get("accept") || ""
  if (
    acceptHeader.includes("text/plain") ||
    acceptHeader.includes("text/markdown")
  ) {
    const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })

    client.capture({
      distinctId: "anonymous",
      event: "md_content_requested_agents",
      properties: {
        $current_url: req.url,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
      },
    })

    await client.shutdown()
  }

  return new NextResponse(cleanMdContent + PLAINTEXT_DOC_MESSAGE, {
    headers: {
      "Content-Type": "text/markdown",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
    status: 200,
  })
}

const getCleanMd_ = unstable_cache(
  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
    getCleanMd({ file: filePath, plugins }),
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
