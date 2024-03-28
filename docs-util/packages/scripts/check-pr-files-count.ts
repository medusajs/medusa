import { Octokit } from "@octokit/core"
import * as core from "@actions/core"

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

let prNumber = process.argv.length >= 3 ? process.argv[2] : null
const threshold = process.argv.length >= 4 ? parseInt(process.argv[3]) : 300

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

  core.setOutput("files_lt_threshold", pr.changed_files < threshold)
}

void getPrFilesCount()
