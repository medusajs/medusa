import path from "path"
import { getFileSlugUtil } from "remark-rehype-plugins"

const monoRepoPath = path.resolve("..", "..", "..")

/**
 *
 * @param {string[]} files - The files to get their slugs
 * @returns {Promise<{ origSlug: string; newSlug: string }[]>}
 */
export default async function getSlugs(files) {
  /**
   * @type {{ origSlug: string; newSlug: string }[]}
   */
  const slugs = []

  for (const file of files) {
    const fileBasename = path.basename(file)
    if (fileBasename !== "page.mdx") {
      continue
    }

    const filePath = path.join(path.resolve(), file)
    const origSlug = (
      file.startsWith("resources/") ? `/${file}` : file.replace(/^app/, "")
    ).replace(`/${fileBasename}`, "")
    const newSlug = await getFileSlugUtil(filePath)

    if (newSlug) {
      slugs.push({
        origSlug,
        newSlug,
        filePath: filePath.replace(monoRepoPath, ""),
      })
    }
  }

  return slugs
}
