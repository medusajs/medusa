import promiseExec from "./promise-exec.js"
import { Ora } from "ora"
import { isAbortError } from "./create-abort-controller.js"
import logMessage from "./log-message.js"
import fs from "fs"
import path from "path"

type CloneRepoOptions = {
  directoryName?: string
  repoUrl?: string
  abortController?: AbortController
  stable?: boolean
}

const DEFAULT_REPO = "https://github.com/medusajs/medusa-starter-default"

export default async function cloneRepo({
  directoryName = "",
  repoUrl,
  abortController,
  stable = false,
}: CloneRepoOptions) {
  await promiseExec(
    `git clone ${repoUrl || getRepoUrl(stable)} ${directoryName}`,
    {
      signal: abortController?.signal,
    }
  )
}

export async function runCloneRepo({
  projectName,
  repoUrl,
  abortController,
  spinner,
  stable = false,
}: {
  projectName: string
  repoUrl: string
  abortController: AbortController
  spinner: Ora
  stable?: boolean
}) {
  try {
    await cloneRepo({
      directoryName: projectName,
      repoUrl,
      abortController,
      stable,
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
}

function getRepoUrl(stable?: boolean) {
  return !stable ? `${DEFAULT_REPO} -b feat/onboarding` : DEFAULT_REPO
}
