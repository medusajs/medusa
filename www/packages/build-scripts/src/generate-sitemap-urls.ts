import { writeFile } from "fs/promises"
import path from "path"
import { retrieveMdxPages } from "./retrieve-mdx-pages.js"

type Options = {
  /**
   * The directory to scan for MDX pages. Defaults to the `app` directory of the
   * current project.
   */
  basePath?: string
  /**
   * Where to write the generated file. Defaults to `generated/sitemap-urls.mjs`
   * of the current project.
   */
  outputPath?: string
  /**
   * Additional URL paths to include in the sitemap that aren't backed by an MDX
   * page (for example, generated reference pages).
   */
  extraPaths?: string[]
}

/**
 * Reads the project's MDX pages at build time and writes their URL paths to a
 * generated `.mjs` file. This lets `app/sitemap.ts` build the sitemap by
 * importing a static array instead of reading the filesystem at request time,
 * which isn't possible in the Cloudflare Workers runtime.
 */
export const generateSitemapUrls = async ({
  basePath,
  outputPath,
  extraPaths = [],
}: Options = {}) => {
  const projectBasePath = path.resolve()
  const appPath = basePath || path.join(projectBasePath, "app")
  const generatedFilePath =
    outputPath || path.join(projectBasePath, "generated", "sitemap-urls.mjs")

  const paths = retrieveMdxPages({
    basePath: appPath,
  })

  const urls = [...paths, ...extraPaths]

  await writeFile(
    generatedFilePath,
    `export const sitemapUrls = ${JSON.stringify(urls, undefined, 2)}\n`,
    {
      flag: "w",
    }
  )
}
