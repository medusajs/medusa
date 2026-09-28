import { workerCompatibleFetch } from "docs-utils"
import path from "path"
import { fetchFromAssetsBinding } from "./fetch-from-assets-binding"

async function fetchRawMdxFile(
  origin: string,
  basePath: string,
  slug: string[],
  fileName: string
): Promise<string | null> {
  const isCloudflare = !!process.env.CLOUDFLARE_ENV
  const url = `${origin}${basePath}/raw-mdx/${[...slug, fileName].join("/")}`

  return (
    (await fetchFromAssetsBinding(url)) ??
    (await workerCompatibleFetch<string | null>({
      url,
      responseTransformer: async (res) => {
        return res.ok ? res.text() : null
      },
      fallbackAction: async () => {
        try {
          const { promises: fs } = await import("fs")
          return await fs.readFile(
            path.join(process.cwd(), "app", ...slug, fileName),
            "utf-8"
          )
        } catch {
          return null
        }
      },
      useRemote: isCloudflare,
    }))
  )
}

export async function fetchRawMdx(
  origin: string,
  basePath: string,
  slug: string[]
): Promise<{ content: string; isOverride: boolean } | null> {
  // An `_md-content.mdx` file overrides `page.mdx` if it exists.
  const overrideContent = await fetchRawMdxFile(
    origin,
    basePath,
    slug,
    "_md-content.mdx"
  )

  if (overrideContent) {
    return { content: overrideContent, isOverride: true }
  }

  const pageContent = await fetchRawMdxFile(origin, basePath, slug, "page.mdx")

  return pageContent ? { content: pageContent, isOverride: false } : null
}
