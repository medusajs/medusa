import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import getSlugs from "../utils/get-slugs.mjs"
import path from "path"

const monoRepoPath = path.resolve("..", "..", "..")
const baseReferencePath = path.resolve("references")

/**
 * Reference pages bake their final slug into the JSON doc-model. Emit a
 * slug-change entry for each page whose slug differs from its file location, so
 * the broken-link checker can resolve slug-overridden reference links (e.g.
 * `/references/api-key/revoke`).
 *
 * @param {string} [dir]
 * @returns {import("types").SlugChange[]}
 */
function getReferenceSlugs(dir = baseReferencePath) {
  /** @type {import("types").SlugChange[]} */
  const slugs = []
  let files
  try {
    files = readdirSync(dir)
  } catch {
    return slugs
  }

  for (const file of files) {
    const filePath = path.join(dir, file)
    if (path.basename(file) !== "page.json") {
      if (statSync(filePath).isDirectory()) {
        slugs.push(...getReferenceSlugs(filePath))
      }
      continue
    }

    // file location relative to the resources root, e.g. /references/api_key/...
    const origSlug = filePath
      .replace(path.resolve(), "")
      .replace(`/${path.basename(file)}`, "")

    let newSlug
    try {
      newSlug = JSON.parse(readFileSync(filePath, "utf-8")).slug
    } catch {
      continue
    }

    if (newSlug && newSlug !== origSlug) {
      slugs.push({
        origSlug,
        newSlug,
        filePath: filePath.replace(monoRepoPath, ""),
      })
    }
  }

  return slugs
}

export async function main() {
  const slugs = await getSlugs()
  slugs.push(...getReferenceSlugs())

  // write generated slugs
  writeFileSync(
    path.resolve("generated", "slug-changes.mjs"),
    `export const slugChanges = ${JSON.stringify(slugs, null, 2)}`
  )
}
