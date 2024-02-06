import { Octokit } from "@octokit/core"
import filterFiles from "../utils/filter-files.js"
import path from "path"
import getMonorepoRoot from "../utils/get-monorepo-root.js"
import DocblockGenerator from "../classes/generators/docblock.js"
import OasGenerator from "../classes/generators/oas.js"
import { CommonCliOptions } from "../types/index.js"

export default async function (
  commitSha: string,
  { type, ...options }: CommonCliOptions
) {
  const monorepoPath = getMonorepoRoot()
  // retrieve the files changed in the commit
  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
  })

  const {
    data: { files },
  } = await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
    owner: "medusajs",
    repo: "medusa",
    ref: commitSha,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  // filter changed files
  let filteredFiles = filterFiles(files?.map((file) => file.filename) || [])

  if (!filteredFiles.length) {
    console.log("No applicable files changed. Canceling...")
    return
  }

  console.log(
    `${filteredFiles.length} files have changed. Running generator on them...`
  )

  filteredFiles = filteredFiles.map((filePath) =>
    path.resolve(monorepoPath, filePath)
  )

  // generate docblocks for each of the files.
  if (type === "all" || type === "docs") {
    const docblockGenerator = new DocblockGenerator({
      paths: filteredFiles,
      ...options,
    })

    await docblockGenerator.run()
  }

  if (type === "all" || type === "oas") {
    const oasGenerator = new OasGenerator({
      paths: filteredFiles,
      ...options,
    })

    oasGenerator.run()
  }

  console.log(`Finished generating docs for ${filteredFiles.length} files.`)
}
