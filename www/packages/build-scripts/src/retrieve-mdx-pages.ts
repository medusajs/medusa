import { readdirSync, readFileSync } from "fs"
import path from "path"
import { getFileSlugSync } from "docs-utils"

type Options = {
  basePath: string
}

export type MdxPage = {
  url: string
  filePath: string
}

export function retrieveMdxPageFiles({ basePath }: Options): MdxPage[] {
  function retrieveMdxFilesInPath(dir: string): MdxPage[] {
    const pages: MdxPage[] = []
    const files = readdirSync(dir, {
      withFileTypes: true,
    })

    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        if (!file.name.startsWith("_")) {
          pages.push(...retrieveMdxFilesInPath(filePath))
        }
        continue
      } else if (file.name !== "page.mdx") {
        continue
      }

      const slug = getFileSlugSync(filePath)

      const url = (slug || filePath.replace(basePath, ""))
        .replace(file.name, "")
        .replace(/\/$/, "")

      pages.push({ url, filePath })
    }

    return pages
  }

  return retrieveMdxFilesInPath(basePath)
}

export function retrieveMdxPages({ basePath }: Options): string[] {
  return retrieveMdxPageFiles({ basePath }).map((page) => page.url)
}

/**
 * Reads the `title` from a page's exported `metadata`, falling back to the
 * last segment of its URL.
 */
export function getMdxPageTitle({ url, filePath }: MdxPage): string {
  const match = readFileSync(filePath, "utf-8").match(
    /title:\s*(?:`((?:\\.|[^`\\])*)`|"((?:\\.|[^"\\])*)")/
  )
  const title = (match?.[1] ?? match?.[2] ?? "")
    .replace(/\$\{[^}]*\}/g, "")
    .replace(/\\(.)/g, "$1")
    .trim()

  return title || getTitleFromUrl(url)
}

/**
 * Builds a title from a URL path, dropping its first segment when there are
 * several, e.g. `/references/auth/provider` becomes `Auth Provider`.
 */
export function getTitleFromUrl(url: string): string {
  const segments = url.split("/").filter(Boolean)
  const titleSegments = segments.length > 1 ? segments.slice(1) : segments
  return (
    titleSegments
      .join("-")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Home"
  )
}
