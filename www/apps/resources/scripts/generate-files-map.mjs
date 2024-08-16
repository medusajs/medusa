import { getAllProjectFiles, getChangedFiles } from "build-scripts"
import { slugChanges } from "../generated/slug-changes.mjs"
import { existsSync, writeFileSync } from "fs"
import path from "path"
import { readFile } from "fs/promises"

const monoRepoPath = path.resolve("..", "..", "..")

/**
 *
 * @param {string[]} files - The files to scan
 * @returns {Promise<{ filePath: string; pathname: string; }[]>}
 */
async function scanFiles(files = []) {
  /**
   * @type {{ filePath: string; pathname: string; }[]}
   */
  const filesMap = []

  for (const file of files) {
    const fullPath = path.join(path.resolve(), file).replace(monoRepoPath, "")
    const fileBasename = path.basename(file)
    if (fileBasename !== "page.mdx") {
      continue
    }
    const filePathWithoutBase = (
      file.startsWith("references/") ? `/${file}` : file.replace(/^app/, "")
    ).replace(`/${fileBasename}`, "")

    // check if it has a slug change and retrieve its new slug
    const slugChange = slugChanges.find(
      (item) => item.origSlug === filePathWithoutBase
    )

    const pathname = slugChange?.newSlug || filePathWithoutBase

    filesMap.push({
      filePath: fullPath,
      pathname: pathname.length ? pathname : "/",
    })
  }

  return filesMap
}

export async function main() {
  const generatedFilePath = path.resolve("generated", "files-map.mjs")
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

  let filesMap = await scanFiles(files)

  const fileContentPrefix = "export const filesMap = "
  if (generatedFileExists) {
    const existingFilesMap = JSON.parse(
      (await readFile(generatedFilePath, "utf-8")).replace(
        fileContentPrefix,
        ""
      )
    )

    filesMap.forEach(({ filePath, pathname }) => {
      const existingFileMapIndex = existingFilesMap.findIndex(
        (item) => item.filePath === filePath
      )
      if (existingFileMapIndex === -1) {
        // add it
        existingFilesMap.push({
          filePath,
          pathname,
        })
      } else {
        // update it
        existingFilesMap[existingFileMapIndex] = {
          filePath,
          pathname,
        }
      }
    })

    filesMap = existingFilesMap
  }

  // write files map
  writeFileSync(
    generatedFilePath,
    `${fileContentPrefix}${JSON.stringify(filesMap, null, 2)}`
  )
}
