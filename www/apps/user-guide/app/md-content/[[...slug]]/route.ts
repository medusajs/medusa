import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
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
  params: Promise<{ slug?: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  const fileContent = await workerCompatibleFetch<string | null>({
    url: `${origin}${basePath}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
    responseTransformer: async (res) => {
      return res.ok ? res.text() : null
    },
    fallbackAction: async () => {
      try {
        const { promises: fs } = await import("fs")
        return await fs.readFile(
          path.join(process.cwd(), "app", ...slug, "page.mdx"),
          "utf-8"
        )
      } catch {
        return null
      }
    },
    useRemote: !!process.env.CLOUDFLARE_ENV,
  })

  if (!fileContent) {
    return notFound()
  }

  const cleanMdContent = await getCleanMd_(fileContent, {
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
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
            },
            ui: {
              url: process.env.NEXT_PUBLIC_UI_URL,
            },
            api: {
              url: process.env.NEXT_PUBLIC_API_URL,
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production" ||
            !!process.env.CLOUDFLARE_ENV,
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

    const urlObj = new URL(req.url)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}${urlObj.pathname}`

    client.capture({
      distinctId: "anonymous",
      event: "md_content_requested_agents",
      properties: {
        $current_url: url,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
        $ip:
          req.headers.get("cf-connecting-ip") ||
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          undefined,
      },
    })

    await client.shutdown()
  }

  return new NextResponse(
    addExtraToMd(cleanMdContent, {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    }),
    {
      headers: {
        "Content-Type": "text/markdown",
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
      status: 200,
    }
  )
}

const getCleanMd_ = unstable_cache(
  async (content: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
    getCleanMd({ file: content, type: "content", plugins }),
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
