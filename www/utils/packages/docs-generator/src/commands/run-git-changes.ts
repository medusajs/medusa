import path from "path"
import DocblockGenerator from "../classes/generators/docblock.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import { GitManager } from "../classes/helpers/git-manager.js"
import { CommonCliOptions } from "../types/index.js"
import OasGenerator from "../classes/generators/oas.js"
import DmlGenerator from "../classes/generators/dml.js"

export default async function runGitChanges({
  type,
  ...options
}: CommonCliOptions) {
  const monorepoPath = getMonorepoRoot()
  // retrieve the changed files under `packages` in the monorepo root.
  const gitManager = new GitManager()
  let files = await gitManager.getDiffFiles()

  if (!files.length) {
    console.log(`No file changes detected.`)
    return
  }

  console.log(
    `${files.length} files have changed. Running generator on them...`
  )

  files = files.map((filePath) => path.resolve(monorepoPath, filePath))

  if (type === "all" || type === "docs") {
    const docblockGenerator = new DocblockGenerator({
      paths: files,
      ...options,
    })

    await docblockGenerator.run()
  }

  if (type === "all" || type === "oas") {
    const oasGenerator = new OasGenerator({
      paths: files,
      ...options,
    })

    await oasGenerator.run()
  }

  if (type === "all" || type === "dml") {
    const dmlGenerator = new DmlGenerator({
      paths: files,
      ...options,
    })

    await dmlGenerator.run()
  }

  console.log(`Finished generating docs for ${files.length} files.`)
}
