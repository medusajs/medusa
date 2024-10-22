import fs from "fs"
import { Ora } from "ora"
import path from "path"
import { isAbortError } from "./create-abort-controller.js"
import execute from "./execute.js"
import logMessage from "./log-message.js"

type CloneRepoOptions = {
  directoryName?: string
  repoUrl?: string
  abortController?: AbortController
  verbose?: boolean
}

const DEFAULT_REPO = "https://github.com/medusajs/medusa-starter-default"
const BRANCH = "master"

export default async function cloneRepo({
  directoryName = "",
  repoUrl,
  abortController,
  verbose = false,
}: CloneRepoOptions) {
  await execute(
    [
      `git clone ${repoUrl || DEFAULT_REPO} -b ${BRANCH} ${directoryName}`,
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
}: {
  projectName: string
  repoUrl: string
  abortController: AbortController
  spinner: Ora
  verbose?: boolean
}) {
  try {
    await cloneRepo({
      directoryName: projectName,
      repoUrl,
      abortController,
      verbose,
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
  fs.rmSync(path.join(projectDirectory, ".git"), {
    recursive: true,
    force: true,
  })

  fs.rmSync(path.join(projectDirectory, ".github"), {
    recursive: true,
    force: true,
  })
}
