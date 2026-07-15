import { unstable_cache } from "next/cache"
import path from "path"
import { workerCompatibleFetch } from "docs-utils"
import { loadReferenceFromBinding } from "../../../../utils/load-reference-from-binding"

type GetRouteProps = {
  params: Promise<{
    slug: string[]
  }>
}

export async function GET(request: Request, { params }: GetRouteProps) {
  const { slug } = await params
  const docPage = await loadReferencesFile(slug)

  if (!docPage) {
    return new Response(
      JSON.stringify({
        error: {
          name: "NotFound",
          message: "Reference file not found",
        },
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return new Response(docPage, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // References only change on releases, so let browsers reuse the
      // payload briefly and CDNs cache it for an hour, serving stale
      // while revalidating in the background afterwards.
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

/**
 * Reads a reference doc-model file (`page.json`) from R2 — via the bucket
 * binding, the public bucket URL, or the local filesystem in dev.
 */
async function loadReferenceSource(filePath: string): Promise<string | null> {
  const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
  const monoRepoPath = path.resolve("..", "..", "..")
  const relPath = filePath.replace(/^.*\/references\//, "")
  const localPath = path.join(monoRepoPath, filePath)

  return (
    (await loadReferenceFromBinding(`resources/references/${relPath}`)) ??
    (await workerCompatibleFetch<string | null>({
      url: `${r2Base}/references/${relPath}`,
      responseTransformer: async (res) => {
        return res.ok ? res.text() : null
      },
      fallbackAction: async () => {
        try {
          const { promises: fs } = await import("fs")
          return await fs.readFile(localPath, "utf-8")
        } catch (e) {
          console.error(e)
          return null
        }
      },
      useRemote: !!r2Base,
    }))
  )
}

/**
 * Loads a reference page as its serialized `DocPage` JSON string. The doc-model
 * is returned as-is: no MDX serialization, and no runtime link-fixing (links
 * are already resolved to final slugs at generation time).
 */
async function loadReferencesFileUncached(
  slug: string[]
): Promise<string | undefined> {
  const pathname = `/references/${slug.join("/")}`
  const filesMap = (await import("@/generated/files-map.mjs")).filesMap
  const fileDetails = filesMap.find((f) => f.pathname === pathname)
  if (!fileDetails) {
    return undefined
  }

  const content = await loadReferenceSource(fileDetails.filePath)
  return content ?? undefined
}

// The revalidation window bounds how long a stale entry is served when
// references are re-uploaded to R2 without a redeploy (deploys already
// invalidate the cache through the build ID in cache keys).
const loadReferencesFile = unstable_cache(
  loadReferencesFileUncached,
  ["references-file"],
  {
    revalidate: 3600,
  }
)

export const dynamic = "force-static"
export const revalidate = 3600
