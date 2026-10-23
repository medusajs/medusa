#!/usr/bin/env node
// Renders the "Release notes" section of a dependency update PR. Each package
// always links its GitHub releases and npm version page; links the agent found
// (update-result.json `sources`) are kept only when they point at that
// package's own repository or homepage, as listed in its npm metadata.
//
// Usage:
//   node scripts/deps-update/render-sources.mjs --group group.json --result update-result.json

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { compareVersions, mapLimit, plainText } from "./lib.mjs"

const MAX_SOURCES_PER_PACKAGE = 4
const SHARED_HOSTS = new Set([
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "www.npmjs.com",
  "npmjs.com",
])

export function githubSlug(repository) {
  const url = typeof repository === "string" ? repository : repository?.url
  const match =
    /github\.com[/:]([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?(?:[/#].*)?$/.exec(
      url ?? ""
    ) ?? /^(?:github:)?([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/.exec(url ?? "")
  return match ? `${match[1]}/${match[2]}` : null
}

export function isAllowedSource(url, { name, slug, homepage }) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.port
  ) {
    return false
  }
  const host = parsed.hostname.toLowerCase()
  if (host === "github.com") {
    return (
      Boolean(slug) &&
      parsed.pathname.toLowerCase().startsWith(`/${slug.toLowerCase()}/`)
    )
  }
  if (host === "www.npmjs.com") {
    return (
      parsed.pathname.startsWith(`/package/${name}/`) ||
      parsed.pathname === `/package/${name}`
    )
  }
  let home
  try {
    home = new URL(homepage)
  } catch {
    return false
  }
  const homeHost = home.hostname.toLowerCase()
  if (SHARED_HOSTS.has(homeHost)) {
    const prefix = home.pathname.replace(/\/+$/, "").toLowerCase()
    return (
      host === homeHost &&
      prefix.length > 1 &&
      parsed.pathname.toLowerCase().startsWith(`${prefix}/`)
    )
  }
  return host === homeHost || host.endsWith(`.${homeHost}`)
}

function link(title, url) {
  return `[${plainText(title, 80) || "notes"}](${new URL(url).href.replace(
    /[()|]/g,
    encodeURIComponent
  )})`
}

function targetOf(pkg) {
  return pkg.changes
    .map((c) => c.to)
    .sort(compareVersions)
    .at(-1)
}

export function renderSources({ group, sources = [], metadata }) {
  const rows = group.packages.map((pkg) => {
    const meta = metadata.get(pkg.name) ?? {}
    const versions = [...new Set(pkg.changes.map((c) => c.from))].join(", ")
    const target = targetOf(pkg)
    const links = sources
      .filter(
        (s) =>
          s?.package === pkg.name &&
          isAllowedSource(String(s.url), { name: pkg.name, ...meta })
      )
      .slice(0, MAX_SOURCES_PER_PACKAGE)
      .map((s) => link(s.title, s.url))
    if (meta.slug) {
      links.push(
        link("GitHub releases", `https://github.com/${meta.slug}/releases`)
      )
    }
    links.push(
      link("npm", `https://www.npmjs.com/package/${pkg.name}/v/${target}`)
    )
    return `| \`${pkg.name}\` | ${versions} → ${target} | ${links.join(", ")} |`
  })
  return [
    "### Release notes",
    "",
    "| Package | Version | Notes |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n")
}

async function main() {
  const { values } = parseArgs({
    options: { group: { type: "string" }, result: { type: "string" } },
  })
  if (!values.group || !values.result) {
    console.error(
      "Usage: render-sources.mjs --group group.json --result update-result.json"
    )
    process.exit(1)
  }
  const group = JSON.parse(readFileSync(values.group, "utf8"))
  const result = JSON.parse(readFileSync(values.result, "utf8"))
  const updated = new Set(
    (result.packages ?? [])
      .filter((p) => p.outcome === "updated")
      .map((p) => p.name)
  )
  const shipped = {
    ...group,
    packages: group.packages.filter((p) => updated.has(p.name)),
  }

  const metadata = new Map()
  await mapLimit(shipped.packages, 8, async (pkg) => {
    const target = targetOf(pkg)
    try {
      const res = await fetch(
        `https://registry.npmjs.org/${pkg.name.replace("/", "%2F")}/${target}`
      )
      const manifest = res.ok ? await res.json() : {}
      metadata.set(pkg.name, {
        slug: githubSlug(manifest.repository),
        homepage:
          typeof manifest.homepage === "string" ? manifest.homepage : null,
      })
    } catch {
      metadata.set(pkg.name, {})
    }
  })

  process.stdout.write(
    renderSources({
      group: shipped,
      sources: Array.isArray(result.sources) ? result.sources : [],
      metadata,
    })
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
