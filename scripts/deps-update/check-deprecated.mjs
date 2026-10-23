#!/usr/bin/env node
// Lists declared dependencies whose locked version is deprecated on npm.
// Exits 1 when any are found.
//
// Usage:
//   node scripts/deps-update/check-deprecated.mjs

import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { collectDeclarations } from "./discover.mjs"
import {
  fetchPackument,
  listWorkspaces,
  mapLimit,
  parseLockfile,
} from "./lib.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const config = JSON.parse(
  readFileSync(path.join(root, ".github/dependency-updates.json"), "utf8")
)
const locked = parseLockfile(readFileSync(path.join(root, "yarn.lock"), "utf8"))
const declarations = collectDeclarations(listWorkspaces(root), config)

const byName = new Map()
for (const d of declarations) {
  const version = locked.get(`${d.name}@npm:${d.spec}`)
  if (version) {
    if (!byName.has(d.name)) {
      byName.set(d.name, new Map())
    }
    byName.get(d.name).set(version, d.workspace)
  }
}

const deprecated = []
await mapLimit([...byName], 16, async ([name, versions]) => {
  const packument = await fetchPackument(name)
  for (const [version, workspace] of versions) {
    const message = packument?.versions?.[version]?.deprecated
    if (message) {
      deprecated.push(`${name}@${version} (${workspace}): ${message}`)
    }
  }
})

if (deprecated.length) {
  console.log(
    `${deprecated.length} deprecated dependencies:\n${deprecated
      .sort()
      .join("\n")}`
  )
  process.exit(1)
}
console.log("No deprecated dependencies.")
