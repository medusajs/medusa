import path from "path"
import DocblockGenerator from "../classes/generators/docblock.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import promiseExec from "../utils/promise-exec.js"
import filterFiles from "../utils/filter-files.js"
import OasGenerator from "../classes/generators/oas.js"
import { CommonCliOptions } from "../types/index.js"

export default async function runGitChanges({
  type,
  ...options
}: CommonCliOptions) {
  const monorepoPath = getMonorepoRoot()
  // retrieve the changed files under `packages` in the monorepo root.
  const childProcess = await promiseExec(
    `git diff --name-only -- "packages/**/**.ts" "packages/**/*.js" "packages/**/*.tsx" "packages/**/*.jsx"`,
    {
      cwd: monorepoPath,
    }
  )

  let files = filterFiles(
    childProcess.stdout.toString().split("\n").filter(Boolean)
  )

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

    oasGenerator.run()
  }

  console.log(`Finished generating docs for ${files.length} files.`)
}
