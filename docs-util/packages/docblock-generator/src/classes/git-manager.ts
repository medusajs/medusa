import { Octokit } from "octokit"

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

    // get commits between the last two releases
    const commits = await this.octokit.paginate(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: this.owner,
        repo: this.repo,
        since: release.published_at || undefined,
        per_page: 100,
      }
    )

    // get files of each of the commits
    const files = new Set<string>()

    await Promise.all(
      commits.map(async (commit) => {
        const {
          data: { files: commitFiles },
        } = await this.octokit.request(
          "GET /repos/{owner}/{repo}/commits/{ref}",
          {
            owner: this.owner,
            repo: this.repo,
            ref: commit.sha,
            headers: {
              "X-GitHub-Api-Version": this.gitApiVersion,
            },
          }
        )

        commitFiles?.forEach((commitFile) => files.add(commitFile.filename))
      })
    )

    return [...files]
  }
}
