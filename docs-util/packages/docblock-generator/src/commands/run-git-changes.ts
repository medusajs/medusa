import getMonorepoRoot from "../utils/get-monorepo-root.js"
import promiseExec from "../utils/promise-exec.js"

export default async function runGitChanges() {
  // TODO
  const childProcess = await promiseExec(
    `git diff HEAD^ HEAD --name-only -- "packages/**/**.ts" "packages/**/*.js" "packages/**/*.tsx" "packages/**/*.jsx"`,
    {
      cwd: getMonorepoRoot(),
    }
  )

  const files = childProcess.stdout.toString().split("\n").filter(Boolean)

  console.log(files)
}
