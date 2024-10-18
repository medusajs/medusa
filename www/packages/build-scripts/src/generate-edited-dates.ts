import { exec } from "child_process"
import { existsSync } from "fs"
import { readFile, stat, writeFile } from "fs/promises"
import path from "path"
import util from "util"
import { getAllProjectFiles } from "./utils/get-all-project-files.js"
import { getChangedFiles } from "./utils/get-changed-files.js"

const promiseExec = util.promisify(exec)

const projectBasePath = path.resolve()
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

export const generateEditedDates = async () => {
  const generatedFileExists = existsSync(generatedFilePath)

  let files: string[] = []
  let editDates: Record<string, string | undefined> = {}

  if (!generatedFileExists) {
    // get all files in a project
    files = await getAllProjectFiles({})
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
