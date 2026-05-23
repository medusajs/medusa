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

  return new Response(JSON.stringify(fileData.serialized), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

const loadReferencesFile = unstable_cache(async (slug: string[]) => {
  const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
  const monoRepoPath = path.resolve("..", "..", "..")

  const pathname = `/references/${slug.join("/")}`
  const slugChanges = (await import("@/generated/slug-changes.mjs")).slugChanges
  const filesMap = (await import("@/generated/files-map.mjs")).filesMap
  const fileDetails =
    slugChanges.find((f) => f.newSlug === pathname) ||
    filesMap.find((f) => f.pathname === pathname)
  if (!fileDetails) {
    return undefined
  }

  // fileDetails.filePath is like /www/apps/resources/references/some/path/page.mdx
  const relPath = fileDetails.filePath.replace(/^.*\/references\//, "")
  const r2Url = `${r2Base}/references/${relPath}`
  const localPath = path.join(monoRepoPath, fileDetails.filePath)

  const fileContent = await workerCompatibleFetch<string | null>({
    url: r2Url,
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
  })

  if (!fileContent) {
    return undefined
  }

  // On Cloudflare, monoRepoPath is unreliable; use fileDetails.filePath directly
  // (it starts with /www/...) so path math in the link-fixer plugins is correct.
  // getFileSlugSync failures are now caught in fixLinkUtil, so fs unavailability
  // in Workers degrades gracefully to path-based URLs instead of throwing.
  const pluginOptions = process.env.CLOUDFLARE_ENV
    ? {
        filePath: fileDetails.filePath,
        basePath: "/www/apps/resources",
        r2BaseUrl: process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL,
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
})

export const dynamic = "force-static"
