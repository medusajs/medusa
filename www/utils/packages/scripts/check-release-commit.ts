import { Octokit } from "@octokit/core"
import * as core from "@actions/core"

const commitSha = process.argv.length >= 3 ? process.argv[2] : null

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

async function checkReleaseCommit() {
  if (!commitSha) {
    throw new Error("Commit SHA is required.")
  }

  // retrieve commit by the SHA
  const { data: commit } = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner: process.env.GIT_OWNER || "",
      repo: process.env.GIT_REPO || "",
      ref: commitSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )

  if (!commit) {
    throw new Error("Commit doesn't exist.")
  }

  core.setOutput(
    "is_release_commit",
    commit.commit.message === "chore: Release"
  )
}

void checkReleaseCommit()
