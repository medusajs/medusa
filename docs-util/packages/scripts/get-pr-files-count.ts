import { Octokit } from "@octokit/core"
import * as core from "@actions/core"

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

let prNumber = process.argv.length >= 3 ? process.argv[2] : null

async function getPrFilesCount() {
  if (!prNumber) {
    throw new Error("Commit SHA is required.")
  }

  prNumber = prNumber.replace("/merge", "")

  const { data: pr } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: process.env.GIT_OWNER || "medusajs",
      repo: process.env.GIT_REPO || "medusa",
      pull_number: parseInt(prNumber),
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )

  core.setOutput("count", pr.changed_files)
}

void getPrFilesCount()
