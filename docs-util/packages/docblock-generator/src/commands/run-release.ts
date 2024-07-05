import filterFiles from "../utils/filter-files.js"
import path from "path"
import DocblockGenerator from "../classes/generators/docblock.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import { GitManager } from "../classes/helpers/git-manager.js"
import OasGenerator from "../classes/generators/oas.js"
import { CommonCliOptions } from "../types/index.js"

export default async function ({ type, tag, ...options }: CommonCliOptions) {
  const gitManager = new GitManager()

  console.log(`Get files in commits since ${tag || "last release"}`)

  const files = tag
    ? await gitManager.getCommitFilesSinceRelease(tag)
    : await gitManager.getCommitFilesSinceLastRelease()

  // filter changed files
  let filteredFiles = filterFiles(files)

  if (!filteredFiles.length) {
    console.log("No applicable files changed. Canceling...")
    return
  }

  console.log(
    `${filteredFiles.length} files have changed. Running generator on them...`
  )

  filteredFiles = filteredFiles.map((filePath) =>
    path.resolve(getMonorepoRoot(), filePath)
  )

  if (type === "all" || type === "docs") {
    const docblockGenerator = new DocblockGenerator({
      paths: filteredFiles,
      ...options,
    })

    await docblockGenerator.run()
  }

  if (type === "all" || type === "oas") {
    const oasGenerator = new OasGenerator({
      paths: filteredFiles,
      ...options,
    })

    await oasGenerator.run()
  }

  console.log(`Finished generating docs for ${filteredFiles.length} files.`)
}
