import { unstable_cache } from "next/cache"
import path from "path"
import fs from "fs/promises"
import mdxOptions from "@/mdx-options.mjs"
import {
  typeListLinkFixerPlugin,
  localLinksRehypePlugin,
  workflowDiagramLinkFixerPlugin,
  prerequisitesLinkFixerPlugin,
  recmaInjectMdxDataPlugin,
} from "remark-rehype-plugins"
import { serialize } from "next-mdx-remote-client/serialize"

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
  path.join(process.cwd(), "references")
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
  const fullPath = path.join(monoRepoPath, fileDetails.filePath)

  const fileContent = await fs.readFile(fullPath, "utf-8")

  const pluginOptions = {
    filePath: fullPath,
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
    path: fullPath,
  }
})

export const dynamic = "force-static"
