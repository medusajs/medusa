import path from "path"
import DocblockGenerator from "../classes/docblock-generator.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import promiseExec from "../utils/promise-exec.js"

export default async function runGitChanges() {
  const monorepoPath = getMonorepoRoot()
  // TODO
  const childProcess = await promiseExec(
    `git diff --name-only -- "packages/**/**.ts" "packages/**/*.js" "packages/**/*.tsx" "packages/**/*.jsx"`,
    {
      cwd: monorepoPath,
    }
  )

  let files = childProcess.stdout.toString().split("\n").filter(Boolean)

  if (files.length) {
    console.log(
      `${files.length} files have changed. Running generator on them...`
    )

    files = files.map((filePath) => path.resolve(monorepoPath, filePath))

    const docblockGenerator = new DocblockGenerator({
      paths: files,
    })

    await docblockGenerator.run()

    console.log(`Finished generating docs for ${files.length} files.`)
  } else {
    console.log(`No file changes detected.`)
  }
}
