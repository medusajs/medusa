import filterFiles from "../utils/filter-files.js"
import path from "path"
import DocblockGenerator from "../classes/docblock-generator.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import { GitManager } from "../classes/git-manager.js"

type Options = {
  tag?: string
}

export default async function ({ tag }: Options) {
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

  // generate docblocks for each of the files.
  const docblockGenerator = new DocblockGenerator({
    paths: filteredFiles,
  })

  await docblockGenerator.run()

  console.log(`Finished generating docs for ${filteredFiles.length} files.`)
}
