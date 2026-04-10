import { getCleanMd, PLAINTEXT_DOC_MESSAGE } from "docs-utils"
import { existsSync } from "fs"
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
  params: Promise<{ slug: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug = ["/"] } = await params

  // keep this so that Vercel keeps the files in deployment
  const basePath = path.join(process.cwd(), "app")
  const componentSpecsPath = path.join(process.cwd(), "specs", "components")
  const examplesPath = path.join(process.cwd(), "specs", "examples")
  const filePath = path.join(basePath, ...slug, "page.mdx")

  if (!existsSync(filePath)) {
    return notFound()
  }

  const cleanMdContent = await getCleanMd_(
    filePath,
    { examplesPath, specsPath: componentSpecsPath },
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
  async (
    filePath: string,
    parserOptions: {
      examplesPath: string
      specsPath: string
    },
    plugins?: { before?: Plugin[]; after?: Plugin[] }
  ) => {
    const iconNames = Object.keys(Icons).filter((name) => name !== "default")

    return getCleanMd({
      file: filePath,
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
