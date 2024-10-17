import { existsSync, writeFileSync } from "fs"
import getSlugs from "../utils/get-slugs.mjs"
import path from "path"
import { getAllProjectFiles, getChangedFiles } from "build-scripts"
import { readFile } from "fs/promises"

export async function main() {
  const generatedFilePath = path.resolve("generated", "slug-changes.mjs")
  const generatedFileExists = existsSync(generatedFilePath)

  let files = []

  if (generatedFileExists) {
    // only retrieve git changes
    files = await getChangedFiles()
  } else {
    // scan for all files
    files = await getAllProjectFiles({
      includeReferences: true,
    })
  }

  let slugs = await getSlugs(files)

  const fileContentPrefix = "export const slugChanges = "
  if (generatedFileExists) {
    const existingSlugs = JSON.parse(
      (await readFile(generatedFilePath, "utf-8")).replace(
        fileContentPrefix,
        ""
      )
    )

    slugs.forEach(({ origSlug, newSlug, filePath }) => {
      const existingSlugIndex = existingSlugs.findIndex(
        (item) => item.origSlug === origSlug
      )
      if (existingSlugIndex === -1) {
        // add it
        existingSlugs.push({
          origSlug,
          newSlug,
          filePath,
        })
      } else {
        // update it
        existingSlugs[existingSlugIndex] = {
          origSlug,
          newSlug,
          filePath,
        }
      }
    })

    slugs = existingSlugs
  }

  // write generated slugs
  writeFileSync(
    generatedFilePath,
    `${fileContentPrefix}${JSON.stringify(slugs, null, 2)}`
  )
}
