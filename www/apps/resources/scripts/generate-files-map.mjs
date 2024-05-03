import { slugChanges } from "../generated/slug-changes.mjs"
import { readdirSync, statSync, writeFileSync } from "fs"
import path from "path"

const baseAppPath = path.resolve("app")
const baseReferencePath = path.resolve("references")
const monoRepoPath = path.resolve("..", "..", "..")

/**
 *
 * @param {string} options.dir - The directory to scan
 * @param {string} options.basePath - The path to consider as base
 * @returns {Promise<{ filePath: string; pathname: string; }[]>}
 */
async function scanFiles(options = {}) {
  const { dir = "", basePath = baseAppPath, baseSlug = baseAppPath } = options
  /**
   * @type {{ filePath: string; pathname: string; }[]}
   */
  const filesMap = []
  const fullPath = path.resolve(basePath, dir.replace(/^\//, ""))
  const files = readdirSync(fullPath)

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const fileBasename = path.basename(file)
    if (fileBasename !== "page.mdx" && statSync(filePath).isDirectory()) {
      filesMap.push(
        ...(await scanFiles({
          dir: filePath.replace(basePath, ""),
          basePath,
          baseSlug,
        }))
      )
      continue
    }

    // check if it has a slug change and retrieve its new slug
    const slugChange = slugChanges.find(
      (item) => item.origSlug === filePath.replace(basePath, "")
    )

    const pathname =
      slugChange?.newSlug ||
      filePath.replace(baseSlug, "").replace(`/${fileBasename}`, "")

    filesMap.push({
      filePath: filePath.replace(monoRepoPath, ""),
      pathname: pathname.length ? pathname : "/",
    })
  }

  return filesMap
}

export async function main() {
  const filesMap = await scanFiles()
  filesMap.push(
    ...(await scanFiles({
      basePath: baseReferencePath,
      baseSlug: path.resolve(),
    }))
  )

  // write files map
  writeFileSync(
    path.resolve("generated", "files-map.mjs"),
    `export const filesMap = ${JSON.stringify(filesMap, null, 2)}`
  )
}
