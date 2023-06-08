import promiseExec from "./promise-exec.js"

type CloneRepoOptions = {
  directoryName?: string
  repoUrl?: string
  abortController?: AbortController
}

// TODO change default repo URL
const DEFAULT_REPO = "https://github.com/medusajs/medusa-starter-default"

export default async ({
  directoryName = "",
  repoUrl,
  abortController,
}: CloneRepoOptions) => {
  await promiseExec(`git clone ${repoUrl || DEFAULT_REPO} ${directoryName}`, {
    signal: abortController?.signal,
  })
}
