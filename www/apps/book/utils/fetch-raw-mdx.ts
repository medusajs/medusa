import { workerCompatibleFetch } from "docs-utils"
import path from "path"

export async function fetchRawMdx(
  origin: string,
  slug: string[]
): Promise<{ content: string; isOverride: boolean } | null> {
  const isCloudflare = !!process.env.CLOUDFLARE_ENV

  // An `_md-content.mdx` file overrides `page.mdx` if it exists.
  const overrideContent = await workerCompatibleFetch<string | null>({
    url: `${origin}/raw-mdx/${[...slug, "_md-content.mdx"].join("/")}`,
    responseTransformer: async (res) => {
      return res.ok ? res.text() : null
    },
    fallbackAction: async () => {
      try {
        const { promises: fs } = await import("fs")
        return await fs.readFile(
          path.join(process.cwd(), "app", ...slug, "_md-content.mdx"),
          "utf-8"
        )
      } catch {
        return null
      }
    },
    useRemote: isCloudflare,
  })

  if (overrideContent) {
    return { content: overrideContent, isOverride: true }
  }

  const pageContent = await workerCompatibleFetch<string | null>({
    url: `${origin}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
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
    useRemote: isCloudflare,
  })

  return pageContent ? { content: pageContent, isOverride: false } : null
}
