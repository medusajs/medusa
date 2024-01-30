import path from "path"
import DocblockGenerator from "../classes/docblock-generator.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import { GitManager } from "../classes/git-manager.js"

export default async function runGitChanges() {
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

  // generate docblocks for each of the files.
  const docblockGenerator = new DocblockGenerator({
    paths: files,
  })

  await docblockGenerator.run()

  console.log(`Finished generating docs for ${files.length} files.`)
}
