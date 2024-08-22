import { exec } from "child_process"
import { existsSync } from "fs"
import { readdir, readFile, stat, writeFile } from "fs/promises"
import path from "path"
import util from "util"

const promiseExec = util.promisify(exec)

const projectBasePath = path.resolve()
const rootPath = path.resolve("..", "..", "..")
const monorepoRelativePath = projectBasePath
  .replace(rootPath, "")
  .replace(/^\//, "")
const generatedFilePath = path.join(
  projectBasePath,
  "generated",
  "edit-dates.mjs"
)

const getGitEditDatesOfPaths = async (
  paths: string[]
): Promise<Record<string, string>> => {
  const editDates: Record<string, string> = {}
  await Promise.all(
    paths.map(async (filePath) => {
      const editDateProcess = await promiseExec(
        `git log -1 --pretty="format:%cI" ${filePath}`
      )

      editDates[filePath] = editDateProcess.stdout || new Date().toISOString()
    })
  )

  return editDates
}

// Note: this gets the date a file was edited in the OS. One drawback here
// is if a file is edited on a day, but the PR is merged a few days later, so the
// date doesn't accurately represent the publish date of the file.
const getOsLastEditDates = async (
  paths: string[]
): Promise<Record<string, string | undefined>> => {
  const editDates: Record<string, string | undefined> = {}
  await Promise.all(
    paths.map(async (filePath) => {
      if (!existsSync(filePath)) {
        // indicates that file was deleted
        editDates[filePath] = undefined
        return
      }
      const fileStat = await stat(filePath)

      editDates[filePath] = fileStat.mtime.toISOString()
    })
  )

  return editDates
}

const getChangedFiles = async (): Promise<string[]> => {
  const changedFiles: string[] = []

  // get untracked files
  const untrackedFiles = await promiseExec(
    `git ls-files --other --exclude-standard`
  )

  untrackedFiles.stdout.split("\n").forEach((file) => {
    if (path.basename(file) !== "page.mdx") {
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
      path.basename(file) !== "page.mdx"
    ) {
      return
    }

    changedFiles.push(file.replace(`${monorepoRelativePath}/`, ""))
  })

  return changedFiles
}

const getAllProjectFiles = async (): Promise<string[]> => {
  const appDir = path.join(projectBasePath, "app")

  const allFiles: string[] = []
  const filesInDir = await readdir(appDir, {
    withFileTypes: true,
    recursive: true,
  })

  filesInDir.forEach((file) => {
    if (file.isDirectory() || path.basename(file.name) !== "page.mdx") {
      return
    }

    const fullFilePath = path.join(file.path, file.name)

    // TODO check if this produces correct file paths
    allFiles.push(path.relative(projectBasePath, fullFilePath))
  })

  return allFiles
}

export const generateEditedDates = async () => {
  const generatedFileExists = existsSync(generatedFilePath)
  const type = generatedFileExists ? "git" : "all"

  let files: string[] = []
  let editDates: Record<string, string | undefined> = {}

  if (type === "all") {
    // get all files in a project
    files = await getAllProjectFiles()
    editDates = await getGitEditDatesOfPaths(files)
  } else {
    // set the last edit dates for git changes only
    files = await getChangedFiles()
    editDates = await getOsLastEditDates(files)
  }

  if (!files.length) {
    return
  }

  const fileContentPrefix = `export const generatedEditDates = `

  if (generatedFileExists) {
    const existingEditDates = JSON.parse(
      (await readFile(generatedFilePath, "utf-8")).replace(
        fileContentPrefix,
        ""
      )
    )

    editDates = Object.assign(existingEditDates, editDates)

    // delete items that don't exist anymore (their value is undefined)
    Object.keys(editDates)
      .filter((key) => editDates[key] === undefined)
      .forEach((key) => delete editDates[key])
  }

  await writeFile(
    generatedFilePath,
    `${fileContentPrefix}${JSON.stringify(editDates, undefined, 2)}`,
    {
      flag: "w",
    }
  )
}
