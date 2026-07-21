import { addExtraToMd, docPageToMarkdown, getCleanMd } from "docs-utils"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import {
  addUrlToRelativeLink,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"
import type { Plugin } from "unified"
import { filesMap } from "../../../generated/files-map.mjs"
import { slugChanges } from "../../../generated/slug-changes.mjs"
import { PostHog } from "posthog-node"
import { fetchMdxContent } from "../../../utils/fetch-mdx-content"
import { getSidebarForPath } from "../../../utils/get-sidebar-for-path"

type Params = {
  params: Promise<{ slug?: string[] }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  const filePathFromMap = await getFileFromMaps(`/${slug.join("/")}`)

  if (!filePathFromMap) {
    return notFound()
  }

  const fileContent = await fetchMdxContent(
    `${origin}${basePath}`,
    filePathFromMap
  )
  if (!fileContent) {
    return notFound()
  }

  // Reference pages are the JSON doc-model (page.json) — convert the DocPage to
  // Markdown directly rather than running the MDX cleaner over it.
  // the app directory that holds the source MDX pages, used to resolve
  // relative `page.mdx` links against the current page's path
  const appDir = filePathFromMap.replace(/\/app\/.*$/, "/app")

  const cleanMdContent = filePathFromMap.endsWith("page.json")
    ? await docPageToMarkdown_(fileContent)
    : await getCleanMd_(fileContent, `/${slug.join("/")}`, {
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
                "user-guide": {
                  url: process.env.NEXT_PUBLIC_USER_GUIDE_URL,
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
          // in "content" mode there is no vfile path, so pass the current
          // page's file path explicitly to resolve relative `page.mdx` links
          [
            localLinksRehypePlugin,
            { filePath: filePathFromMap, basePath: appDir },
          ],
        ] as unknown as Plugin[],
        after: [
          // links in the doc are app-relative (without the base path), so
          // prepend both the base URL and the base path to make them absolute
          [
            addUrlToRelativeLink,
            { url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}${basePath}` },
          ],
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
  async (
    content: string,
    currentPath: string,
    plugins?: { before?: Plugin[]; after?: Plugin[] }
  ) => {
    // `ChildDocs` renders the child items of the current sidebar, so resolve
    // the sidebar for this path and pass it (along with the path and base path)
    // to the parser that reproduces the component's output as Markdown.
    const sidebar = await getSidebarForPath(currentPath)
    return getCleanMd({
      file: content,
      type: "content",
      plugins,
      parserOptions: {
        ChildDocs: {
          sidebar,
          activePath: currentPath,
        },
      },
    })
  },
  ["clean-md"],
  {
    revalidate: 3600,
  }
)

/** Converts a reference DocPage JSON string to Markdown. */
const docPageToMarkdown_ = unstable_cache(
  async (content: string): Promise<string> => {
    try {
      return docPageToMarkdown(JSON.parse(content), {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      })
    } catch {
      return ""
    }
  },
  ["doc-page-md"],
  {
    revalidate: 3600,
  }
)

const getFileFromMaps = unstable_cache(
  async (path: string) => {
    return (
      slugChanges.find((slugChange) => slugChange.newSlug === path)?.filePath ||
      filesMap.find((file) => file.pathname === path)?.filePath
    )
  },
  ["file-map"],
  {
    revalidate: 3600,
  }
)
