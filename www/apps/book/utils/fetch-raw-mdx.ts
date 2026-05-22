import { workerCompatibleFetch } from "docs-utils"
import path from "path"

type FetchRawMdxResult = {
  content: string
  isOverride: boolean
}

async function tryFetch(
  origin: string,
  slug: string[],
  filename: string,
  isCloud: boolean
): Promise<string | null> {
  return workerCompatibleFetch<string | null>({
    url: `${origin}/raw-mdx/${[...slug, filename].join("/")}`,
    responseTransformer: async (res) => {
      return res.ok ? await res.text() : null
    },
    fallbackAction: async () => {
      try {
        const { promises: fs } = await import("fs")
        return await fs.readFile(
          path.join(process.cwd(), "app", ...slug, filename),
          "utf-8"
        )
      } catch {
        return null
      }
    },
    useRemote: isCloud,
  })
}

export async function fetchRawMdx(
  origin: string,
  slug: string[]
): Promise<FetchRawMdxResult | null> {
  const isCloud = !!process.env.MC_ENV

  const overrideContent = await tryFetch(
    origin,
    slug,
    "_md-content.mdx",
    isCloud
  )
  if (overrideContent) {
    return { content: overrideContent, isOverride: true }
  }

  const pageContent = await tryFetch(origin, slug, "page.mdx", isCloud)
  return pageContent ? { content: pageContent, isOverride: false } : null
}
