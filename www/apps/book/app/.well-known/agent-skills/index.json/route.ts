import { unstable_cache } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { config } from "../../../../config"
import { fetchFromAssetsBinding } from "../../../../utils/fetch-from-assets-binding"
import { trackAgentRequest } from "../../../../utils/track-agent-request"

const REPO = "medusajs/medusa-agent-skills"
const SKILL_PATH_REGEX = /^plugins\/[^/]+\/skills\/([^/]+)\/SKILL\.md$/

const headers = {
  "content-type": "application/json",
  "cache-control": "public, max-age=3600, must-revalidate",
  "access-control-allow-origin": "*",
}

type GitTree = { tree: { path: string; type: string }[] }

const fetchOk = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`)
  }
  return res
}

const getFrontmatterField = (content: string, field: string) => {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ""
  const value = frontmatter
    .match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
    .trim()

  if (value && /^"/.test(value)) {
    return JSON.parse(value) as string
  }
  return value?.replace(/^'(.*)'$/, "$1")
}

const sha256 = async (bytes: BufferSource) => {
  const hash = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")
}

const getDocsSkill = async () => {
  const url = `${config.baseUrl}/SKILL.md`
  let content = await fetchFromAssetsBinding(url)
  if (content === null) {
    const { promises: fs } = await import("fs")
    content = await fs.readFile(
      path.join(process.cwd(), "public", "SKILL.md"),
      "utf-8"
    )
  }
  const bytes = new TextEncoder().encode(content)

  return {
    name: getFrontmatterField(content, "name") ?? "medusa-docs",
    type: "skill-md",
    description: getFrontmatterField(content, "description") ?? "",
    url,
    digest: `sha256:${await sha256(bytes)}`,
  }
}

const getIndex = unstable_cache(
  async () => {
    // GitHub rejects API requests without a User-Agent, which Workers' fetch doesn't set
    const userAgent = { "user-agent": "medusa-docs" }
    const githubHeaders = {
      ...userAgent,
      accept: "application/vnd.github+json",
    }
    // Pin to a commit so each digest matches the bytes served at its url
    const commitSha = await (
      await fetchOk(`https://api.github.com/repos/${REPO}/commits/main`, {
        headers: { ...userAgent, accept: "application/vnd.github.sha" },
      })
    ).text()
    const { tree } = (await (
      await fetchOk(
        `https://api.github.com/repos/${REPO}/git/trees/${commitSha}?recursive=1`,
        { headers: githubHeaders }
      )
    ).json()) as GitTree

    const repoSkills = Promise.all(
      tree
        .filter(
          ({ type, path }) => type === "blob" && SKILL_PATH_REGEX.test(path)
        )
        .map(async ({ path }) => {
          const url = `https://raw.githubusercontent.com/${REPO}/${commitSha}/${path}`
          const bytes = await (await fetchOk(url)).arrayBuffer()
          const content = new TextDecoder().decode(bytes)

          return {
            name:
              getFrontmatterField(content, "name") ??
              path.match(SKILL_PATH_REGEX)![1],
            type: "skill-md",
            description: getFrontmatterField(content, "description") ?? "",
            url,
            digest: `sha256:${await sha256(bytes)}`,
          }
        })
    )

    return {
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: (await Promise.all([getDocsSkill(), repoSkills]))
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name)),
    }
  },
  ["agent-skills-index"],
  { revalidate: 3600 }
)

export async function GET(req: NextRequest) {
  trackAgentRequest(req, "well_known_requested", { resource: "agent-skills" })
  return NextResponse.json(await getIndex(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
