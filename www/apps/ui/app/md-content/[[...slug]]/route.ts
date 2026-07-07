import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { addUrlToRelativeLink } from "remark-rehype-plugins"
import type { Plugin } from "unified"
import * as Icons from "@medusajs/icons"
import * as HookValues from "@/specs/hook-values"
import { colors as allColors } from "@/config/colors"
import { PostHog } from "posthog-node"

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

  const specsR2Base = process.env.UI_SPECS_R2_BASE_URL

  const cleanMdContent = await getCleanMd_(
    fileContent,
    {
      examplesPath: specsR2Base
        ? `${specsR2Base}/specs/examples`
        : path.join(process.cwd(), "specs", "examples"),
      specsPath: specsR2Base
        ? `${specsR2Base}/specs/components`
        : path.join(process.cwd(), "specs", "components"),
    },
    {
      after: [
        [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
      ] as unknown as Plugin[],
    }
  )

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
  async (
    content: string,
    parserOptions: {
      examplesPath: string
      specsPath: string
    },
    plugins?: { before?: Plugin[]; after?: Plugin[] }
  ) => {
    const iconNames = Object.keys(Icons).filter((name) => name !== "default")

    return getCleanMd({
      file: content,
      type: "content",
      plugins,
      parserOptions: {
        ComponentExample: {
          examplesBasePath: parserOptions.examplesPath,
        },
        ComponentReference: {
          specsPath: parserOptions.specsPath,
        },
        IconSearch: {
          iconNames,
        },
        HookValues: {
          hooksData: HookValues,
        },
        Colors: {
          colors: allColors,
        },
      },
    })
  },
  ["clean-md"],
  {
    revalidate: 3600,
  }
)
