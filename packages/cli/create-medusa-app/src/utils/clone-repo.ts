import fs from "fs"
import { Ora } from "ora"
import path from "path"
import { isAbortError } from "./create-abort-controller.js"
import execute from "./execute.js"
import logMessage from "./log-message.js"
import { execFileSync } from "child_process"

type CloneRepoOptions = {
  directoryName?: string
  repoUrl?: string
  abortController?: AbortController
  verbose?: boolean
  isPlugin?: boolean
}

const DEFAULT_REPO = "https://github.com/medusajs/medusa-starter-default"
const DEFAULT_PLUGIN_REPO = "https://github.com/medusajs/medusa-starter-plugin"
const BRANCH = "master"
const PLUGIN_BRANCH = "main"

export default async function cloneRepo({
  directoryName = "",
  repoUrl,
  abortController,
  verbose = false,
  isPlugin = false,
}: CloneRepoOptions) {
  const defaultRepo = isPlugin ? DEFAULT_PLUGIN_REPO : DEFAULT_REPO
  const branch = isPlugin ? PLUGIN_BRANCH : BRANCH

  await execute(
    [
      `git clone ${
        repoUrl || defaultRepo
      } -b ${branch} ${directoryName} --depth 1`,
      {
        signal: abortController?.signal,
      },
    ],
    { verbose }
  )
}

export async function runCloneRepo({
  projectName,
  repoUrl,
  abortController,
  spinner,
  verbose = false,
  isPlugin = false,
}: {
  projectName: string
  repoUrl: string
  abortController: AbortController
  spinner: Ora
  verbose?: boolean
  isPlugin?: boolean
}) {
  try {
    await cloneRepo({
      directoryName: projectName,
      repoUrl,
      abortController,
      verbose,
      isPlugin,
    })

    deleteGitDirectory(projectName)
  } catch (e) {
    if (isAbortError(e)) {
      process.exit()
    }

    spinner.stop()
    logMessage({
      message: `An error occurred while setting up your project: ${e}`,
      type: "error",
    })
  }
}

function deleteGitDirectory(projectDirectory: string) {
  try {
    fs.rmSync(path.join(projectDirectory, ".git"), {
      recursive: true,
      force: true,
    })
  } catch (error) {
    deleteWithCommand(projectDirectory, ".git")
  }

  try {
    fs.rmSync(path.join(projectDirectory, ".github"), {
      recursive: true,
      force: true,
    })
  } catch (error) {
    deleteWithCommand(projectDirectory, ".github")
  }
}

/**
 * Useful for deleting directories when fs methods fail (e.g., with Yarn v3)
 */
function deleteWithCommand(projectDirectory: string, dirName: string) {
  const dirPath = path.normalize(path.join(projectDirectory, dirName))
  if (!fs.existsSync(dirPath)) {
    return
  }

  if (process.platform === "win32") {
    execFileSync("cmd", ["/c", "rmdir", "/s", "/q", dirPath])
  } else {
    execFileSync("rm", ["-rf", dirPath])
  }
}
