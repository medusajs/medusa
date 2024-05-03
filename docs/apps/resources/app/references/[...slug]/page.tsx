import { MDXRemote } from "next-mdx-remote/rsc"
import path from "path"
import { promises as fs } from "fs"
import { notFound } from "next/navigation"
import {
  typeListLinkFixerPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"
import MDXComponents from "@/components/MDXComponents"
import mdxOptions from "../../../mdx-options.mjs"
import { slugChanges } from "../../../generated/slug-changes.mjs"
import { filesMap } from "../../../generated/files-map.mjs"

type PageProps = {
  params: {
    slug: string[]
  }
}

export default async function ReferencesPage({ params }: PageProps) {
  const { slug } = params

  // ensure that Vercel loads references files
  path.join(process.cwd(), "references")
  const monoRepoPath = path.resolve("..", "..", "..")

  const pathname = `/references/${slug.join("/")}`
  const fileDetails =
    slugChanges.find((f) => f.newSlug === pathname) ||
    filesMap.find((f) => f.pathname === pathname)
  if (!fileDetails) {
    return notFound()
  }
  const fullPath = path.join(monoRepoPath, fileDetails.filePath)
  const fileContent = await fs.readFile(fullPath, "utf-8")

  const pluginOptions = {
    filePath: fullPath,
    basePath: process.cwd(),
  }

  return (
    <MDXRemote
      source={fileContent}
      components={MDXComponents}
      options={{
        mdxOptions: {
          rehypePlugins: [
            ...mdxOptions.options.rehypePlugins,
            [typeListLinkFixerPlugin, pluginOptions],
            [localLinksRehypePlugin, pluginOptions],
          ],
          remarkPlugins: mdxOptions.options.remarkPlugins,
        },
      }}
    />
  )
}
