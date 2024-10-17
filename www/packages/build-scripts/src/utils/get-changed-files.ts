import { exec } from "child_process"
import path from "path"
import util from "util"

const promiseExec = util.promisify(exec)
const projectBasePath = path.resolve()
const rootPath = path.resolve("..", "..", "..")
const monorepoRelativePath = projectBasePath
  .replace(rootPath, "")
  .replace(/^\//, "")

type Options = {
  onlyPages?: boolean
}

export const getChangedFiles = async (options?: Options): Promise<string[]> => {
  const { onlyPages = true } = options || {}
  const changedFiles: string[] = []

  // get untracked files
  const untrackedFiles = await promiseExec(
    `git ls-files --other --exclude-standard`
  )

  untrackedFiles.stdout.split("\n").forEach((file) => {
    if (onlyPages && path.basename(file) !== "page.mdx") {
      return
    }

    changedFiles.push(path.relative(projectBasePath, file))
  })

  // get tracked files
  const trackedFiles = await promiseExec(
    `{ git diff --name-only ; git diff --name-only --staged ; } | sort | uniq`
  )

  trackedFiles.stdout.split("\n").forEach((file) => {
    // The above command retrieve the full file path relative to the monorepo
    // so all parts before the project's path should be removed.
    if (
      !file.startsWith(monorepoRelativePath) ||
      (onlyPages && path.basename(file) !== "page.mdx")
    ) {
      return
    }

    changedFiles.push(file.replace(`${monorepoRelativePath}/`, ""))
  })

  return changedFiles
}
