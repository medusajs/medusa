import { Octokit } from "octokit"
import promiseExec from "../../utils/promise-exec.js"
import getMonorepoRoot from "../../utils/get-monorepo-root.js"
import filterFiles from "../../utils/filter-files.js"

type Options = {
  owner?: string
  repo?: string
  authToken?: string
}

export class GitManager {
  private owner: string
  private repo: string
  private authToken: string
  private octokit: Octokit
  private gitApiVersion = "2022-11-28"

  constructor(options?: Options) {
    this.owner = options?.owner || process.env.GIT_OWNER || ""
    this.repo = options?.repo || process.env.GIT_REPO || ""
    this.authToken = options?.authToken || process.env.GITHUB_TOKEN || ""

    this.octokit = new Octokit({
      auth: this.authToken,
    })
  }

  async getCommitFilesSinceRelease(tagName: string) {
    const { data: release } = await this.octokit.request(
      "GET /repos/{owner}/{repo}/releases/tags/{tag}",
      {
        owner: this.owner,
        repo: this.repo,
        tag: tagName,
        headers: {
          "X-GitHub-Api-Version": this.gitApiVersion,
        },
      }
    )

    return this.getCommitsFiles(release.published_at)
  }

  async getCommitFilesSinceLastRelease() {
    // list releases to get the latest two releases
    const { data: release } = await this.octokit.request(
      "GET /repos/{owner}/{repo}/releases/latest",
      {
        owner: this.owner,
        repo: this.repo,
        headers: {
          "X-GitHub-Api-Version": this.gitApiVersion,
        },
      }
    )

    return this.getCommitsFiles(release.published_at)
  }

  async getCommitsFiles(date?: string | null) {
    // get commits between the last two releases
    const commits = await this.octokit.paginate(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: this.owner,
        repo: this.repo,
        since: date || undefined,
        per_page: 100,
      }
    )

    // get files of each of the commits
    const files = new Set<string>()

    await Promise.all(
      commits.map(async (commit) => {
        const commitFiles = await this.getCommitFiles(commit.sha)

        commitFiles?.forEach((commitFile) => files.add(commitFile.filename))
      })
    )

    return [...files]
  }

  async getDiffFiles(): Promise<string[]> {
    const childProcess = await promiseExec(
      `git diff --name-only -- "packages/**/**.ts" "packages/**/*.js" "packages/**/*.tsx" "packages/**/*.jsx"`,
      {
        cwd: getMonorepoRoot(),
      }
    )

    return filterFiles(
      childProcess.stdout.toString().split("\n").filter(Boolean)
    )
  }

  async getCommitFiles(commitSha: string) {
    const {
      data: { files },
    } = await this.octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
      owner: "medusajs",
      repo: "medusa",
      ref: commitSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 3000,
    })

    return files
  }
}
