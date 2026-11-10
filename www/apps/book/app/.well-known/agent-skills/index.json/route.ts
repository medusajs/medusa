import { NextResponse } from "next/server"

export const revalidate = 3600

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

const sha256 = async (bytes: ArrayBuffer) => {
  const hash = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")
}

const getIndex = async () => {
  const githubHeaders = { accept: "application/vnd.github+json" }
  // Pin to a commit so each digest matches the bytes served at its url
  const commitSha = await (
    await fetchOk(`https://api.github.com/repos/${REPO}/commits/main`, {
      headers: { accept: "application/vnd.github.sha" },
    })
  ).text()
  const { tree } = (await (
    await fetchOk(
      `https://api.github.com/repos/${REPO}/git/trees/${commitSha}?recursive=1`,
      { headers: githubHeaders }
    )
  ).json()) as GitTree

  const skills = await Promise.all(
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
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
  }
}

export async function GET() {
  return NextResponse.json(await getIndex(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
