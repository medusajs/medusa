#!/usr/bin/env node
// Triage Dependabot alerts: keep only those whose vulnerable package is in the
// PRODUCTION dependency closure of a published (@medusajs/*, private!==true) package.
// Everything else in the root yarn.lock (integration-tests, build tooling like
// redoc, devDependencies) is auto-dismissed as "not_used".
//
// Usage:
//   node triage-published-alerts.mjs            # dry run, prints report
//   node triage-published-alerts.mjs --dismiss  # actually dismiss irrelevant alerts
//
// Requires: `gh` authenticated, node_modules installed (node-modules linker).

import { execSync } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const REPO = "medusajs/medusa"
const ROOT = process.cwd()
const DISMISS = process.argv.includes("--dismiss")

// Published packages that are developer tooling, not consumed as app dependencies.
// They are excluded from the production closure so alerts reachable only through
// them are treated as irrelevant (dismissable).
const IGNORED_PACKAGES = new Set([])

// 1. Discover published workspaces (private !== true) and map name -> dir
const workspaces = execSync("yarn workspaces list --json", { encoding: "utf8" })
  .trim().split("\n").map((l) => JSON.parse(l))

const nameToDir = new Map()
const publishedDirs = []
for (const ws of workspaces) {
  const pjPath = path.join(ROOT, ws.location, "package.json")
  if (!existsSync(pjPath)) continue
  const pj = JSON.parse(readFileSync(pjPath, "utf8"))
  if (pj.name) nameToDir.set(pj.name, ws.location)
  if (pj.private !== true && pj.name && !IGNORED_PACKAGES.has(pj.name))
    publishedDirs.push({ name: pj.name, dir: ws.location })
}

// 2. Resolve a package's package.json + its directory. We read package.json off
//    disk directly (NOT require.resolve) so strict `exports` maps can't block the
//    `./package.json` subpath — that bug silently truncated the closure and would
//    have wrongly dismissed real alerts (e.g. @babel/core). Walk node_modules from
//    `fromAbs` up to the repo root, which also finds hoisted deps.
function readPkg(name, fromAbs) {
  if (nameToDir.has(name)) {
    const dir = path.join(ROOT, nameToDir.get(name))
    return { pj: JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8")), dir }
  }
  let cur = fromAbs
  while (true) {
    const found = path.join(cur, "node_modules", name, "package.json")
    if (existsSync(found)) {
      return { pj: JSON.parse(readFileSync(found, "utf8")), dir: path.dirname(found) }
    }
    const parent = path.dirname(cur)
    if (parent === cur) break
    cur = parent
  }
  return null
}

// 3. BFS the PRODUCTION closure (dependencies + optionalDependencies, NOT dev)
const closure = new Set()
const queue = []
for (const { dir } of publishedDirs) {
  const abs = path.join(ROOT, dir)
  const pj = JSON.parse(readFileSync(path.join(abs, "package.json"), "utf8"))
  for (const dep of Object.keys({ ...pj.dependencies, ...pj.optionalDependencies }))
    queue.push({ name: dep, fromAbs: abs })
}
const seen = new Set()
while (queue.length) {
  const { name, fromAbs } = queue.shift()
  const key = `${name}@${fromAbs}`
  if (seen.has(key)) continue
  seen.add(key)
  closure.add(name)
  const res = readPkg(name, fromAbs)
  if (!res) continue
  for (const dep of Object.keys({ ...res.pj.dependencies, ...res.pj.optionalDependencies }))
    queue.push({ name: dep, fromAbs: res.dir })
}
console.error(`Production closure of ${publishedDirs.length} published packages: ${closure.size} packages`)

// 4. Fetch open alerts on the root lockfile
const alerts = JSON.parse(execSync(
  `gh api "/repos/${REPO}/dependabot/alerts?state=open&per_page=100" --paginate --slurp`,
  { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
)).flat()

const rootAlerts = alerts.filter((a) => a.dependency.manifest_path === "yarn.lock")
const relevant = [], irrelevant = []
for (const a of rootAlerts) {
  (closure.has(a.dependency.package.name) ? relevant : irrelevant).push(a)
}

console.log(`\nRoot lockfile alerts: ${rootAlerts.length}`)
console.log(`  RELEVANT (in published prod tree): ${relevant.length}`)
console.log(`  IRRELEVANT (tooling/tests/dev):    ${irrelevant.length}`)
console.log(`\nRelevant packages: ${[...new Set(relevant.map((a) => a.dependency.package.name))].join(", ")}`)

// 5. Dismiss irrelevant alerts
if (DISMISS) {
  for (const a of irrelevant) {
    execSync(
      `gh api --method PATCH "/repos/${REPO}/dependabot/alerts/${a.number}" ` +
      `-f state=dismissed -f dismissed_reason=not_used ` +
      `-f dismissed_comment="Not in the production dependency tree of any published @medusajs package (auto-triaged)."`,
      { stdio: "inherit" }
    )
  }
  console.log(`\nDismissed ${irrelevant.length} alerts.`)
} else {
  console.log(`\n(dry run — pass --dismiss to dismiss the ${irrelevant.length} irrelevant alerts)`)
}
