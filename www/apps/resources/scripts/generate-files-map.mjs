import { slugChanges } from "../generated/slug-changes.mjs"
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path"

const baseAppPath = path.resolve("app")
const baseReferencePath = path.resolve("references")
const baseReferenceJsonPath = path.resolve("references-json")
const monoRepoPath = path.resolve("..", "..", "..")

/**
 *
 * @param {object} options
 * @param {string} options.dir - The directory to scan
 * @param {string} options.basePath - The path to consider as base
 * @param {string} [options.targetBasename] - The content file name to match
 * @param {"page" | "mdx" | "json"} [options.format] - The format tag to attach
 * @returns {Promise<{ filePath: string; pathname: string; format: string; }[]>}
 */
async function scanFiles(options = {}) {
  const {
    dir = "",
    basePath = baseAppPath,
    baseSlug = baseAppPath,
    targetBasename = "page.mdx",
    format = "page",
  } = options
  /**
   * @type {{ filePath: string; pathname: string; format: string; }[]}
   */
  const filesMap = []
  const fullPath = path.resolve(basePath, dir.replace(/^\//, ""))
  const files = readdirSync(fullPath)

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const fileBasename = path.basename(file)
    if (fileBasename !== targetBasename) {
      if (statSync(filePath).isDirectory()) {
        filesMap.push(
          ...(await scanFiles({
            dir: filePath.replace(basePath, ""),
            basePath,
            baseSlug,
            targetBasename,
            format,
          }))
        )
      }
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
      format,
    })
  }

  return filesMap
}

export async function main() {
  const appFiles = await scanFiles()

  // References rendered from the JSON doc-model (win over the MDX version for
  // the same pathname during the incremental migration). Each entry is keyed by
  // the DocPage's baked-in `slug` (its final URL), so slug-overridden pages
  // resolve without needing the MDX-derived slug-changes map.
  let jsonReferenceFiles = []
  try {
    jsonReferenceFiles = await scanFiles({
      basePath: baseReferenceJsonPath,
      baseSlug: path.resolve(),
      targetBasename: "page.json",
      format: "json",
    })
    jsonReferenceFiles = jsonReferenceFiles.map((entry) => {
      try {
        const docPage = JSON.parse(
          readFileSync(path.join(monoRepoPath, entry.filePath), "utf-8")
        )
        if (docPage.slug) {
          return { ...entry, pathname: docPage.slug }
        }
      } catch {
        // keep the file-path-derived pathname on parse failure
      }
      return entry
    })
  } catch {
    // references-json/ not generated yet — fall back to MDX only.
  }
  const jsonPathnames = new Set(jsonReferenceFiles.map((f) => f.pathname))

  let mdxReferenceFiles = []
  try {
    mdxReferenceFiles = (
      await scanFiles({
        basePath: baseReferencePath,
        baseSlug: path.resolve(),
        targetBasename: "page.mdx",
        format: "mdx",
      })
    ).filter((f) => !jsonPathnames.has(f.pathname))
  } catch {
    // references/ (MDX) not present — JSON-only.
  }

  const filesMap = [...appFiles, ...jsonReferenceFiles, ...mdxReferenceFiles]

  // write files map
  writeFileSync(
    path.resolve("generated", "files-map.mjs"),
    `export const filesMap = ${JSON.stringify(filesMap, null, 2)}`
  )
}
