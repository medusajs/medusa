#!/usr/bin/env node
// Applies a group's lockfile-only changes and checks yarn.lock ends up on the
// planned versions. Range bumps are left to the caller.
//
// Usage:
//   node scripts/deps-update/apply-lockfile.mjs --group group.json

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
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
  satisfies,
} from "./lib.mjs"

const NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

export function newestSatisfying(versions, spec) {
  const range = parseRange(spec)
  return (
    versions
      .filter((v) => parseVersion(v) && satisfies(v, range))
      .sort(compareVersions)
      .at(-1) ?? null
  )
}

// `yarn up -R` refreshes every range of a package to its newest match in one
// install; `yarn set resolution` pins one range but runs a full install each time.
export function planLockfileUpdates(group, versionsByName) {
  const changes = group.packages.flatMap((pkg) =>
    pkg.changes
      .filter((c) => c.action === "lockfile")
      .map((c) => ({ name: pkg.name, spec: c.spec, to: c.to }))
  )
  const invalid = changes.filter(
    (c) => !NAME.test(c.name) || !parseRange(c.spec) || !parseVersion(c.to)
  )
  const valid = changes.filter((c) => !invalid.includes(c))
  const needsPin = new Set(
    valid
      .filter(
        (c) =>
          newestSatisfying(versionsByName.get(c.name) ?? [], c.spec) !== c.to
      )
      .map((c) => c.name)
  )
  const pins = new Map()
  for (const c of valid.filter((c) => needsPin.has(c.name))) {
    pins.set(`${c.name}@npm:${c.spec}`, c.to)
  }
  return {
    changes: valid,
    invalid,
    refresh: [
      ...new Set(valid.filter((c) => !needsPin.has(c.name)).map((c) => c.name)),
    ],
    pins: [...pins].map(([descriptor, to]) => ({ descriptor, to })),
  }
}

async function main() {
  const { values } = parseArgs({ options: { group: { type: "string" } } })
  if (!values.group) {
    console.error("Usage: apply-lockfile.mjs --group group.json")
    process.exit(1)
  }
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  )
  const group = JSON.parse(readFileSync(values.group, "utf8"))

  const names = [
    ...new Set(
      group.packages
        .filter((p) => p.changes.some((c) => c.action === "lockfile"))
        .map((p) => p.name)
    ),
  ].filter((name) => NAME.test(name))
  const versionsByName = new Map()
  await mapLimit(names, 16, async (name) => {
    versionsByName.set(
      name,
      Object.keys((await fetchPackument(name))?.versions ?? {})
    )
  })

  const plan = planLockfileUpdates(group, versionsByName)
  for (const c of plan.invalid) {
    console.error(`Skipped invalid change: ${JSON.stringify(c)}`)
  }
  const yarn = (args) =>
    execFileSync("yarn", args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: "false" },
    })

  if (plan.refresh.length) {
    console.log(`Refreshing ${plan.refresh.length} package(s) in one install`)
    yarn(["up", "-R", ...plan.refresh])
  }
  for (const { descriptor, to } of plan.pins) {
    console.log(`Pinning ${descriptor} to ${to}`)
    yarn(["set", "resolution", descriptor, `npm:${to}`])
  }

  const locked = parseLockfile(
    readFileSync(path.join(root, "yarn.lock"), "utf8")
  )
  const mismatches = plan.changes.filter(
    (c) => locked.get(`${c.name}@npm:${c.spec}`) !== c.to
  )
  for (const c of mismatches) {
    console.error(
      `${c.name}@${c.spec} resolved to ${
        locked.get(`${c.name}@npm:${c.spec}`) ?? "nothing"
      }, expected ${c.to}`
    )
  }
  console.log(
    `Applied ${plan.changes.length - mismatches.length} of ${
      plan.changes.length
    } lockfile change(s)`
  )
  if (mismatches.length || plan.invalid.length) {
    process.exit(1)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
