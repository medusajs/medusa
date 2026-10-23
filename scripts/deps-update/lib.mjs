import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"

const KIND_RANK = { patch: 1, minor: 2, major: 3 }

export function parseVersion(version) {
  const match =
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(
      String(version).trim()
    )
  if (!match) {
    return null
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  }
}

export function compareVersions(a, b) {
  const va = typeof a === "string" ? parseVersion(a) : a
  const vb = typeof b === "string" ? parseVersion(b) : b
  for (const part of ["major", "minor", "patch"]) {
    if (va[part] !== vb[part]) {
      return va[part] - vb[part]
    }
  }
  if (va.prerelease === vb.prerelease) {
    return 0
  }
  if (!va.prerelease) {
    return 1
  }
  if (!vb.prerelease) {
    return -1
  }
  return va.prerelease < vb.prerelease ? -1 : 1
}

// Only plain `^x.y.z`, `~x.y.z` and exact `x.y.z` ranges (partial versions
// like `^8` or `5.x` are padded). Anything else is left to people.
export function parseRange(spec) {
  const match = /^([\^~]?)(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$/.exec(
    String(spec).trim()
  )
  if (!match) {
    return null
  }
  const [, operator, major, minor, patch] = match
  const wildcard = (part) => part === undefined || part === "x" || part === "*"
  if (operator === "" && (wildcard(minor) || wildcard(patch))) {
    return {
      operator: wildcard(minor) ? "^" : "~",
      version: `${major}.${wildcard(minor) ? 0 : minor}.0`,
      exact: false,
    }
  }
  return {
    operator,
    version: `${major}.${wildcard(minor) ? 0 : minor}.${
      wildcard(patch) ? 0 : patch
    }`,
    exact: operator === "",
  }
}

export function satisfies(version, range) {
  const v = parseVersion(version)
  const r = parseVersion(range.version)
  if (!v || !r || v.prerelease || compareVersions(v, r) < 0) {
    return false
  }
  if (range.operator === "") {
    return compareVersions(v, r) === 0
  }
  if (range.operator === "~") {
    return v.major === r.major && v.minor === r.minor
  }
  if (r.major > 0) {
    return v.major === r.major
  }
  if (r.minor > 0) {
    return v.major === 0 && v.minor === r.minor
  }
  return v.major === 0 && v.minor === 0 && v.patch === r.patch
}

// A 0.x minor bump is breaking under caret semantics, so it counts as major.
export function bumpKind(from, to) {
  const a = parseVersion(from)
  const b = parseVersion(to)
  if (!a || !b || compareVersions(b, a) <= 0) {
    return null
  }
  if (b.major !== a.major || (a.major === 0 && b.minor !== a.minor)) {
    return "major"
  }
  return b.minor !== a.minor ? "minor" : "patch"
}

export function riskier(a, b) {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  return KIND_RANK[a] >= KIND_RANK[b] ? a : b
}

export function majorLine(version) {
  const v = parseVersion(version)
  return v.major === 0 ? `0.${v.minor}` : String(v.major)
}

// Maps each `name@npm:range` descriptor in a Yarn Berry lockfile to the version it resolves to.
export function parseLockfile(text) {
  const resolved = new Map()
  let descriptors = null
  for (const line of text.split("\n")) {
    if (line && !line.startsWith(" ") && line.endsWith(":")) {
      descriptors = line
        .slice(0, -1)
        .replace(/^"|"$/g, "")
        .split(/,\s*/)
        .filter((d) => d.includes("@npm:"))
      continue
    }
    const version = /^ {2}version: (.+)$/.exec(line)
    if (version && descriptors) {
      for (const descriptor of descriptors) {
        resolved.set(descriptor, version[1].trim())
      }
      descriptors = null
    }
  }
  return resolved
}

export function lockedVersions(resolved) {
  const byName = new Map()
  for (const [descriptor, version] of resolved) {
    const name = descriptor.slice(0, descriptor.indexOf("@npm:", 1))
    if (!byName.has(name)) {
      byName.set(name, new Set())
    }
    byName.get(name).add(version)
  }
  return byName
}

export function listWorkspaces(root) {
  const output = execFileSync("yarn", ["workspaces", "list", "--json"], {
    cwd: root,
    encoding: "utf8",
  })
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const { location } = JSON.parse(line)
      const manifest = JSON.parse(
        readFileSync(path.join(root, location, "package.json"), "utf8")
      )
      return {
        location,
        name: manifest.name ?? location,
        published: manifest.private !== true && location !== ".",
        manifest,
      }
    })
}

export function matchesPattern(name, pattern) {
  if (pattern.endsWith("*")) {
    return name.startsWith(pattern.slice(0, -1))
  }
  return name === pattern
}

export function matchesAny(name, patterns = []) {
  return patterns.some((pattern) => matchesPattern(name, pattern))
}

export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  )
  return results
}

const REGISTRY = "https://registry.npmjs.org"

export async function fetchPackument(
  name,
  { full = false, fetchImpl = fetch } = {}
) {
  const url = `${REGISTRY}/${name.replace("/", "%2F")}`
  const headers = full ? {} : { Accept: "application/vnd.npm.install-v1+json" }
  for (let attempt = 1; ; attempt++) {
    let error
    try {
      const res = await fetchImpl(url, { headers })
      if (res.status === 404) {
        return null
      }
      if (res.ok) {
        return await res.json()
      }
      error = new Error(`npm registry returned ${res.status} for ${name}`)
    } catch (err) {
      error = err
    }
    if (attempt === 3) {
      throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
  }
}

export function linearTeamId() {
  if (!process.env.LINEAR_API_KEY || !process.env.LINEAR_TEAM_ID) {
    throw new Error("Missing LINEAR_API_KEY or LINEAR_TEAM_ID env variable.")
  }
  return process.env.LINEAR_TEAM_ID
}

export async function linear(query, variables) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.LINEAR_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(
      `Linear API error: ${res.status} ${JSON.stringify(json.errors ?? json)}`
    )
  }
  return json.data
}

// Model-written text: single line, no markdown links, mentions, or HTML, capped.
export function plainText(text, max = 140) {
  const clean = String(text ?? "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[@`*_#|[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
