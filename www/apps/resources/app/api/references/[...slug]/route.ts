import { unstable_cache } from "next/cache"
import mdxOptions from "@/mdx-options.mjs"
import {
  typeListLinkFixerPlugin,
  localLinksRehypePlugin,
  workflowDiagramLinkFixerPlugin,
  prerequisitesLinkFixerPlugin,
  recmaInjectMdxDataPlugin,
} from "remark-rehype-plugins"
import { serialize } from "next-mdx-remote-client/serialize"
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
  const fileData = await loadReferencesFile(slug)

  if (!fileData) {
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

  const payload =
    "docPage" in fileData && fileData.docPage
      ? fileData.docPage
      : fileData.serialized

  return new Response(JSON.stringify(payload), {
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
 * Reads a reference source file (MDX or JSON doc-model) from R2 — via the
 * bucket binding, the public bucket URL, or the local filesystem in dev — using
 * the `<dir>/<relPath>` key derived from `fileDetails.filePath`.
 */
async function loadReferenceSource(
  filePath: string,
  dir: "references" | "references-json"
): Promise<string | null> {
  const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
  const monoRepoPath = path.resolve("..", "..", "..")
  const relPath = filePath.replace(new RegExp(`^.*/${dir}/`), "")
  const localPath = path.join(monoRepoPath, filePath)

  return (
    (await loadReferenceFromBinding(`resources/${dir}/${relPath}`)) ??
    (await workerCompatibleFetch<string | null>({
      url: `${r2Base}/${dir}/${relPath}`,
      responseTransformer: async (res) => (res.ok ? res.text() : null),
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

async function loadReferencesFileUncached(slug: string[]) {
  const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL

  const pathname = `/references/${slug.join("/")}`
  const slugChanges = (await import("@/generated/slug-changes.mjs")).slugChanges
  const filesMap = (await import("@/generated/files-map.mjs")).filesMap
  // JSON doc-model entries are keyed by their final slug, so they are matched
  // first (and win over the MDX slug-changes / files-map) during migration.
  const fileDetails = (filesMap.find(
    (f) => (f as { format?: string }).format === "json" && f.pathname === pathname
  ) ||
    slugChanges.find((f) => f.newSlug === pathname) ||
    filesMap.find((f) => f.pathname === pathname)) as
    | { filePath: string; pathname?: string; format?: string }
    | undefined
  if (!fileDetails) {
    return undefined
  }

  // References served from the JSON doc-model return the parsed DocPage as-is:
  // no MDX serialization, no runtime link-fixing (links are pre-resolved).
  if (fileDetails.format === "json") {
    const jsonContent = await loadReferenceSource(
      fileDetails.filePath,
      "references-json"
    )
    if (!jsonContent) {
      return undefined
    }
    try {
      return { docPage: JSON.parse(jsonContent), content: jsonContent }
    } catch {
      return undefined
    }
  }

  const monoRepoPath = path.resolve("..", "..", "..")
  const localPath = path.join(monoRepoPath, fileDetails.filePath)

  const fileContent = await loadReferenceSource(
    fileDetails.filePath,
    "references"
  )

  if (!fileContent) {
    return undefined
  }

  // On Cloudflare, monoRepoPath is unreliable; use fileDetails.filePath directly
  // (it starts with /www/...) so path math in the link-fixer plugins is correct.
  // getFileSlugSync failures are now caught in fixLinkUtil, so fs unavailability
  // in Workers degrades gracefully to path-based URLs instead of throwing.
  const pluginOptions = r2Base
    ? {
        filePath: fileDetails.filePath,
        basePath: "/www/apps/resources",
        r2BaseUrl: r2Base,
      }
    : {
        filePath: localPath,
        basePath: process.cwd(),
      }

  const serialized = await serialize({
    source: fileContent,
    options: {
      disableImports: true,
      mdxOptions: {
        development: process.env.NEXT_PUBLIC_ENV === "development",
        format: "mdx",
        rehypePlugins: [
          ...mdxOptions.options.rehypePlugins,
          [
            typeListLinkFixerPlugin,
            {
              ...pluginOptions,
              checkLinksType: "md",
            },
          ],
          [
            workflowDiagramLinkFixerPlugin,
            {
              ...pluginOptions,
              checkLinksType: "value",
            },
          ],
          [
            prerequisitesLinkFixerPlugin,
            {
              ...pluginOptions,
              checkLinksType: "value",
            },
          ],
          [localLinksRehypePlugin, pluginOptions],
        ],
        remarkPlugins: [...mdxOptions.options.remarkPlugins],
        recmaPlugins: [
          [
            recmaInjectMdxDataPlugin,
            { isRemoteMdx: true, mode: process.env.NODE_ENV },
          ],
        ],
      },
    },
  })

  return {
    serialized,
    content: fileContent,
  }
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
