import filterFiles from "../utils/filter-files.js"
import path from "path"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import DocblockGenerator from "../classes/docblock-generator.js"
import { GitManager } from "../classes/git-manager.js"

export default async function (commitSha: string) {
  const monorepoPath = getMonorepoRoot()
  // retrieve the files changed in the commit
  const gitManager = new GitManager()

  const files = await gitManager.getCommitFiles(commitSha)

  // filter changed files
  let filteredFiles = filterFiles(files?.map((file) => file.filename) || [])

  if (!filteredFiles.length) {
    console.log("No applicable files changed. Canceling...")
    return
  }

  console.log(
    `${filteredFiles.length} files have changed. Running generator on them...`
  )

  filteredFiles = filteredFiles.map((filePath) =>
    path.resolve(monorepoPath, filePath)
  )

  // generate docblocks for each of the files.
  const docblockGenerator = new DocblockGenerator({
    paths: filteredFiles,
  })

  await docblockGenerator.run()

  console.log(`Finished generating docs for ${filteredFiles.length} files.`)
}
