#!/usr/bin/env node
// Validates the staged changes of a dependency update against its plan group
// before anything is pushed. Prints {"violation": "<code>"|"", "details": [...]}.
//
// Usage:
//   node scripts/deps-update/check-patch.mjs --group group.json [--out result.json]
//     [--worktree] [--revision]
//
// Run from the repo root with the patch applied to the index on top of HEAD,
// or pass --worktree to check uncommitted working-tree changes instead.
// --revision skips the changeset check for a commit on top of an existing PR.

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import {
  compareVersions,
  fetchPackument,
  mapLimit,
  parseLockfile,
  parseRange,
  parseVersion,
} from "./lib.mjs"

const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
]
const BLOCKED_PATHS =
  /^(\.github\/|\.claude\/|scripts\/|\.husky\/|\.yarn\/|www\/|\.yarnrc|\.mcp\.json$)|(^|\/)migrations\/|(^|\/)\.env/
const NOT_COUNTED =
  /(^|\/)package\.json$|^yarn\.lock$|^\.changeset\/|^(update-result\.json|pr-body\.md)$/
const DAY_MS = 24 * 60 * 60 * 1000

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 200 * 1024 * 1024,
  })
}

function readAtHead(file) {
  try {
    return git(["show", `HEAD:${file}`])
  } catch {
    return null
  }
}

export function checkManifest({ file, before, after, group, limits }) {
  const allowed = new Map(
    group.packages.map((p) => [
      p.name,
      p.changes
        .map((c) => c.to)
        .sort(compareVersions)
        .at(-1),
    ])
  )
  const problems = []
  const added = []
  const strip = (manifest) => {
    const rest = { ...manifest }
    for (const field of DEPENDENCY_FIELDS) {
      delete rest[field]
    }
    return JSON.stringify(rest)
  }
  if (!before || !after) {
    return { problems: [`${file}: manifests can't be added or removed`], added }
  }
  if (strip(before) !== strip(after)) {
    problems.push(`${file}: changes outside dependency fields`)
  }
  for (const field of DEPENDENCY_FIELDS) {
    const old = before[field] ?? {}
    const next = after[field] ?? {}
    for (const name of new Set([...Object.keys(old), ...Object.keys(next)])) {
      if (old[name] === next[name]) {
        continue
      }
      if (!(name in next)) {
        problems.push(`${file}: removed ${field}.${name}`)
        continue
      }
      if (!(name in old)) {
        if (
          group.kind === "major" &&
          field === "devDependencies" &&
          parseRange(next[name])
        ) {
          added.push(name)
        } else {
          problems.push(`${file}: added ${field}.${name}`)
        }
        continue
      }
      const range = parseRange(next[name])
      const target = allowed.get(name)
      if (!target) {
        problems.push(`${file}: ${field}.${name} is not in this update`)
      } else if (!range || compareVersions(range.version, target) > 0) {
        problems.push(
          `${file}: ${field}.${name} "${next[name]}" goes past ${target}`
        )
      } else if (field === "peerDependencies" && group.kind !== "major") {
        problems.push(
          `${file}: peer range of ${name} changed outside a major update`
        )
      }
    }
  }
  if (added.length > limits.newDependencies) {
    problems.push(`${file}: adds ${added.length} dependencies`)
  }
  return { problems, added }
}

export function newLockfileVersions(baseText, headText) {
  const base = new Set(
    [...parseLockfile(baseText)].map(
      ([d, v]) => `${d.slice(0, d.indexOf("@npm:", 1))}@${v}`
    )
  )
  const fresh = new Map()
  for (const [descriptor, version] of parseLockfile(headText)) {
    const name = descriptor.slice(0, descriptor.indexOf("@npm:", 1))
    if (!base.has(`${name}@${version}`) && parseVersion(version)) {
      if (!fresh.has(name)) {
        fresh.set(name, new Set())
      }
      fresh.get(name).add(version)
    }
  }
  return fresh
}

async function main() {
  const { values } = parseArgs({
    options: {
      group: { type: "string" },
      out: { type: "string" },
      worktree: { type: "boolean", default: false },
      revision: { type: "boolean", default: false },
      config: { type: "string", default: ".github/dependency-updates.json" },
    },
  })
  if (!values.group) {
    console.error(
      "Usage: check-patch.mjs --group group.json [--out result.json] [--worktree] [--revision]"
    )
    process.exit(1)
  }
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  )
  const config = JSON.parse(
    readFileSync(path.join(root, values.config), "utf8")
  )
  const group = JSON.parse(readFileSync(values.group, "utf8"))
  const limits = config.limits[group.kind]

  const result = { violation: "", details: [] }
  const fail = (violation, details) => {
    if (!result.violation) {
      result.violation = violation
    }
    result.details.push(...details)
  }

  const diff = values.worktree ? ["diff", "HEAD"] : ["diff", "--cached"]
  const changed = [
    ...git([...diff, "--no-renames", "--name-only"]).split("\n"),
    ...(values.worktree
      ? git(["ls-files", "--others", "--exclude-standard"]).split("\n")
      : []),
  ].filter(Boolean)
  const blocked = changed.filter((file) => BLOCKED_PATHS.test(file))
  if (blocked.length) {
    fail("blocked-path", blocked)
  }

  const numstat = git([...diff, "--no-renames", "--numstat"])
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t"))
  if (numstat.some(([added, removed]) => added === "-" || removed === "-")) {
    fail("binary-file", [])
  }
  const counted = numstat.filter(([, , file]) => !NOT_COUNTED.test(file))
  const lines = counted.reduce((sum, [a, r]) => sum + Number(a) + Number(r), 0)
  if (counted.length > limits.files) {
    fail("too-many-files", [
      `${counted.length} source files changed (limit ${limits.files})`,
    ])
  }
  if (lines > limits.lines) {
    fail("too-many-lines", [
      `${lines} source lines changed (limit ${limits.lines})`,
    ])
  }

  const manifests = changed.filter((file) => file.endsWith("package.json"))
  for (const file of manifests) {
    const before = readAtHead(file)
    const after = readFileSync(path.join(root, file), "utf8")
    const { problems } = checkManifest({
      file,
      before: before && JSON.parse(before),
      after: JSON.parse(after),
      group,
      limits,
    })
    if (problems.length) {
      fail("manifest-change", problems)
    }
  }
  if (
    !values.revision &&
    manifests.some((file) => file.startsWith("packages/")) &&
    !changed.some((file) => /^\.changeset\/[a-z0-9-]+\.md$/.test(file))
  ) {
    fail("missing-changeset", [
      "package manifests under packages/ changed without a changeset",
    ])
  }

  if (changed.includes("yarn.lock")) {
    const fresh = newLockfileVersions(
      readAtHead("yarn.lock") ?? "",
      readFileSync(path.join(root, "yarn.lock"), "utf8")
    )
    const cutoff = Date.now() - config.cooldownDays * DAY_MS
    const tooNew = []
    await mapLimit([...fresh], 8, async ([name, versions]) => {
      const time = (await fetchPackument(name, { full: true }))?.time ?? {}
      for (const version of versions) {
        const published = Date.parse(time[version] ?? "")
        if (!(published <= cutoff)) {
          tooNew.push(`${name}@${version}`)
        }
      }
    })
    if (tooNew.length) {
      fail(
        "too-new",
        tooNew
          .sort()
          .map((v) => `${v} is younger than ${config.cooldownDays} days`)
      )
    }
  }

  const output = JSON.stringify(result, null, 2)
  if (values.out) {
    writeFileSync(values.out, output + "\n")
  }
  console.log(output)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
