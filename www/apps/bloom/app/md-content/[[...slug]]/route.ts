import { getCleanMd } from "docs-utils"
import { existsSync } from "fs"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { posthog } from "posthog-js"
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
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "always",
        defaults: "2025-05-24",
      })
    }

    posthog.capture(
      "md_content_requested_agents",
      {
        $current_url: req.url,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
      },
      {
        send_instantly: true,
      }
    )
  }

  return new NextResponse(cleanMdContent, {
    headers: {
      "Content-Type": "text/markdown",
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
