import { slugChanges } from "../generated/slug-changes.mjs"
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import path from "path"

const baseAppPath = path.resolve("app")
const baseReferencePath = path.resolve("references")
const monoRepoPath = path.resolve("..", "..", "..")

/**
 * Scans the `app/` directory for `page.mdx` content files.
 *
 * @param {object} options
 * @param {string} [options.dir] - The directory to scan
 * @param {string} [options.basePath] - The path to consider as base
 * @param {string} [options.baseSlug] - The path to derive the pathname from
 * @returns {Promise<{ filePath: string; pathname: string; }[]>}
 */
async function scanAppFiles(options = {}) {
  const { dir = "", basePath = baseAppPath, baseSlug = baseAppPath } = options
  const filesMap = []
  const fullPath = path.resolve(basePath, dir.replace(/^\//, ""))
  const files = readdirSync(fullPath)

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const fileBasename = path.basename(file)
    if (fileBasename !== "page.mdx") {
      if (statSync(filePath).isDirectory()) {
        filesMap.push(
          ...(await scanAppFiles({
            dir: filePath.replace(basePath, ""),
            basePath,
            baseSlug,
          }))
        )
      }
      continue
    }

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

/**
 * Scans the `references/` directory for `page.json` doc-model files. Each entry
 * is keyed by the DocPage's baked-in `slug` (its final URL), so the reference
 * route resolves pages — including slug-overridden ones — with a direct lookup.
 *
 * @param {string} [dir] - The directory to scan (defaults to references/)
 * @returns {{ filePath: string; pathname: string; }[]}
 */
function scanReferenceFiles(dir = baseReferencePath) {
  const filesMap = []
  let files
  try {
    files = readdirSync(dir)
  } catch {
    return filesMap
  }

  for (const file of files) {
    const filePath = path.join(dir, file)
    if (path.basename(file) !== "page.json") {
      if (statSync(filePath).isDirectory()) {
        filesMap.push(...scanReferenceFiles(filePath))
      }
      continue
    }

    let pathname = filePath.replace(path.resolve(), "").replace("/page.json", "")
    try {
      const docPage = JSON.parse(readFileSync(filePath, "utf-8"))
      if (docPage.slug) {
        pathname = docPage.slug
      }
    } catch {
      // keep the path-derived pathname on parse failure
    }

    filesMap.push({
      filePath: filePath.replace(monoRepoPath, ""),
      pathname,
    })
  }

  return filesMap
}

export async function main() {
  const filesMap = [...(await scanAppFiles()), ...scanReferenceFiles()]

  // write files map
  writeFileSync(
    path.resolve("generated", "files-map.mjs"),
    `export const filesMap = ${JSON.stringify(filesMap, null, 2)}`
  )
}
