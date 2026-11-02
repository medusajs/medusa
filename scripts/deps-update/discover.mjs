#!/usr/bin/env node
// Builds the week's dependency update plan from the workspace manifests,
// yarn.lock, and the npm registry.
//
// Usage:
//   node scripts/deps-update/discover.mjs --out plan.json [--state state.json]
//     [--open-prs branches.json] [--include-majors] [--only <group key>]

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import {
  bumpKind,
  compareVersions,
  fetchPackument,
  listWorkspaces,
  lockedVersions,
  majorLine,
  mapLimit,
  matchesAny,
  parseLockfile,
  parseRange,
  parseVersion,
  riskier,
  satisfies,
  slugify,
} from "./lib.mjs"

const UPDATABLE_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
]
const DAY_MS = 24 * 60 * 60 * 1000

export function collectDeclarations(workspaces, config) {
  const workspaceNames = new Set(workspaces.map((w) => w.name))
  const declarations = []
  for (const workspace of workspaces) {
    for (const field of [...UPDATABLE_FIELDS, "peerDependencies"]) {
      for (const [name, spec] of Object.entries(
        workspace.manifest[field] ?? {}
      )) {
        if (workspaceNames.has(name) || matchesAny(name, config.ignore)) {
          continue
        }
        declarations.push({
          name,
          spec,
          field,
          workspace: workspace.location,
          published: workspace.published,
        })
      }
    }
  }
  return declarations
}

function eligibleVersions(abbreviated, times, cutoff) {
  const latest = abbreviated["dist-tags"]?.latest
  if (!latest || !parseVersion(latest)) {
    return []
  }
  return Object.entries(abbreviated.versions ?? {})
    .filter(([version, meta]) => {
      const parsed = parseVersion(version)
      const published = times?.[version] ? Date.parse(times[version]) : NaN
      return (
        parsed &&
        !parsed.prerelease &&
        !meta.deprecated &&
        compareVersions(version, latest) <= 0 &&
        published <= cutoff
      )
    })
    .map(([version]) => version)
    .sort(compareVersions)
}

export function typesTarget(name) {
  const bare = name.slice("@types/".length)
  return bare.includes("__") ? `@${bare.replace("__", "/")}` : bare
}

// @types/<x> moves with <x> when the repo declares <x>.
function unitNameOf(name, config, declaredNames) {
  const group = config.groups?.find((g) => matchesAny(name, g.packages))?.name
  if (group) {
    return group
  }
  if (name.startsWith("@types/") && declaredNames.has(typesTarget(name))) {
    return unitNameOf(typesTarget(name), config, declaredNames)
  }
  return name
}

function isSkippedByState(state, name, target, kind) {
  const entry = state?.packages?.[name]
  if (!entry) {
    return null
  }
  if (entry.status === "held" && kind === "major") {
    return `held: ${entry.reason ?? "kept on the current major"}`
  }
  if (["blocked", "failed"].includes(entry.status) && entry.target === target) {
    return `${entry.status} at ${target}: ${
      entry.reason ?? "see the state issue"
    }`
  }
  return null
}

export function computeMetrics({
  declarations,
  locked,
  lockfileVersions,
  packuments,
}) {
  const byName = new Map()
  for (const d of declarations) {
    if (!byName.has(d.name)) {
      byName.set(d.name, [])
    }
    byName.get(d.name).push(d)
  }
  const metrics = {
    dependencies: byName.size,
    majorBehind: 0,
    shippedMajorBehind: 0,
    threeMajorsBehind: 0,
    deprecated: 0,
    duplicated: 0,
    multiRange: 0,
  }
  for (const [name, decls] of byName) {
    const abbreviated = packuments.get(name)
    const latest = abbreviated?.["dist-tags"]?.latest
    if (new Set(decls.map((d) => d.spec)).size >= 3) {
      metrics.multiRange++
    }
    const versions = decls
      .map((d) => locked.get(`${name}@npm:${d.spec}`))
      .filter((v) => v && parseVersion(v))
    if (!latest || !parseVersion(latest) || !versions.length) {
      continue
    }
    const oldest = versions.sort(compareVersions)[0]
    const behind = parseVersion(latest).major - parseVersion(oldest).major
    if (behind >= 1) {
      metrics.majorBehind++
      if (decls.some((d) => d.published && d.field !== "devDependencies")) {
        metrics.shippedMajorBehind++
      }
    }
    if (behind >= 3) {
      metrics.threeMajorsBehind++
    }
    if (versions.some((v) => abbreviated.versions?.[v]?.deprecated)) {
      metrics.deprecated++
    }
  }
  for (const versions of lockfileVersions.values()) {
    if (versions.size >= 3) {
      metrics.duplicated++
    }
  }
  return metrics
}

export function buildPlan({
  declarations,
  locked,
  packuments,
  times,
  config,
  state = {},
  openBranches = new Set(),
  includeMajors = false,
  only = null,
  now = Date.now(),
}) {
  const cutoff = now - config.cooldownDays * DAY_MS
  const declaredNames = new Set(declarations.map((d) => d.name))
  const unitOf = (name) => unitNameOf(name, config, declaredNames)
  const skipped = []
  const inMajor = new Map()
  const pinned = new Map()
  const majors = new Map()

  const eligibleCache = new Map()
  const eligibleFor = (name) => {
    if (!eligibleCache.has(name)) {
      const abbreviated = packuments.get(name)
      eligibleCache.set(
        name,
        abbreviated
          ? eligibleVersions(abbreviated, times.get(name), cutoff)
          : []
      )
    }
    return eligibleCache.get(name)
  }
  const addChange = (map, name, change, kind) => {
    if (!map.has(name)) {
      map.set(name, { name, kind: null, changes: [] })
    }
    const entry = map.get(name)
    entry.kind = riskier(entry.kind, kind)
    entry.changes.push(change)
  }

  for (const d of declarations) {
    if (d.field === "peerDependencies") {
      continue
    }
    if (!packuments.get(d.name)) {
      skipped.push({
        name: d.name,
        workspace: d.workspace,
        reason: "not on the npm registry",
      })
      continue
    }
    const range = parseRange(d.spec)
    if (!range) {
      skipped.push({
        name: d.name,
        workspace: d.workspace,
        reason: `unsupported range "${d.spec}"`,
      })
      continue
    }
    const current = locked.get(`${d.name}@npm:${d.spec}`) ?? range.version
    if (!parseVersion(current)) {
      continue
    }
    const eligible = eligibleFor(d.name).filter(
      (v) => compareVersions(v, current) > 0
    )
    if (!eligible.length) {
      continue
    }
    const base = {
      workspace: d.workspace,
      field: d.field,
      spec: d.spec,
      from: current,
    }

    const sameLine = eligible.filter((v) => majorLine(v) === majorLine(current))
    if (sameLine.length) {
      const target = sameLine[sameLine.length - 1]
      const kind = bumpKind(current, target)
      // An exact pin is usually deliberate, so it's planned like a major.
      const reason = isSkippedByState(
        state,
        d.name,
        target,
        range.exact ? "major" : kind
      )
      if (reason) {
        skipped.push({ name: d.name, workspace: d.workspace, reason })
      } else {
        const lockfileOnly = satisfies(target, range)
        addChange(
          range.exact ? pinned : inMajor,
          d.name,
          {
            ...base,
            to: target,
            newSpec: lockfileOnly ? d.spec : `${range.operator}${target}`,
            action: lockfileOnly ? "lockfile" : "range",
          },
          kind
        )
      }
    }

    const target = eligible[eligible.length - 1]
    if (majorLine(target) === majorLine(current)) {
      continue
    }
    if (
      parseVersion(target).major - parseVersion(current).major >
      config.maxMajorJump
    ) {
      skipped.push({
        name: d.name,
        workspace: d.workspace,
        reason: `suspicious jump from ${current} to ${target}`,
      })
      continue
    }
    const reason = isSkippedByState(state, d.name, target, "major")
    if (reason) {
      skipped.push({ name: d.name, workspace: d.workspace, reason })
      continue
    }
    addChange(
      majors,
      d.name,
      {
        ...base,
        to: target,
        newSpec: `${range.operator}${target}`,
        action: "range",
      },
      "major"
    )
  }

  const withDocs = (entry) => ({
    ...entry,
    context7: config.context7?.[entry.name] ?? null,
    shipped: entry.changes.some((c) =>
      declarations.some(
        (d) =>
          d.name === entry.name &&
          d.workspace === c.workspace &&
          d.published &&
          d.field === "dependencies"
      )
    ),
  })

  const majorUnits = new Map()
  const addToUnit = (entry, isPinned) => {
    const unitName = unitOf(entry.name)
    if (!majorUnits.has(unitName)) {
      majorUnits.set(unitName, {
        key: `major-${slugify(unitName)}`,
        kind: "major",
        name: unitName,
        pinned: isPinned,
        packages: [],
      })
    }
    const unit = majorUnits.get(unitName)
    unit.pinned = unit.pinned && isPinned
    const existing = unit.packages.find((p) => p.name === entry.name)
    if (!existing) {
      unit.packages.push(withDocs(entry))
      return
    }
    const covered = new Set(
      existing.changes.map((c) => `${c.workspace}:${c.field}`)
    )
    existing.changes.push(
      ...entry.changes.filter((c) => !covered.has(`${c.workspace}:${c.field}`))
    )
  }
  for (const entry of majors.values()) {
    addToUnit(entry, false)
  }
  for (const entry of pinned.values()) {
    addToUnit(entry, true)
  }
  const majorsBehind = (unit) =>
    Math.max(
      ...unit.packages.flatMap((p) =>
        p.changes.map(
          (c) => parseVersion(c.to).major - parseVersion(c.from).major
        )
      )
    )
  const rankedMajors = [...majorUnits.values()].sort(
    (a, b) =>
      Number(b.packages.some((p) => p.shipped)) -
        Number(a.packages.some((p) => p.shipped)) ||
      majorsBehind(b) - majorsBehind(a) ||
      a.key.localeCompare(b.key)
  )

  const groups = []
  const pending = []
  const deferred = []
  let majorSlots =
    config.maxMajorsPerWeek -
    rankedMajors.filter((unit) => openBranches.has(`chore/deps-${unit.key}`))
      .length
  for (const unit of rankedMajors) {
    if (only) {
      if (unit.key === only) {
        groups.push(unit)
      }
      continue
    }
    const branch = `chore/deps-${unit.key}`
    if (openBranches.has(branch)) {
      pending.push({ key: unit.key, branch })
    } else if (!includeMajors) {
      deferred.push({ key: unit.key, reason: "majors are turned off" })
    } else if (majorSlots > 0) {
      groups.push(unit)
      majorSlots--
    } else {
      deferred.push({ key: unit.key, reason: "weekly major cap reached" })
    }
  }

  const takenByMajors = new Set()
  for (const unit of groups) {
    for (const pkg of unit.packages) {
      takenByMajors.add(pkg.name)
      const covered = new Set(
        pkg.changes.map((c) => `${c.workspace}:${c.field}`)
      )
      pkg.changes.push(
        ...(inMajor.get(pkg.name)?.changes ?? []).filter(
          (c) => !covered.has(`${c.workspace}:${c.field}`)
        )
      )
    }
  }
  const batchKind = new Map()
  for (const entry of inMajor.values()) {
    const group = unitOf(entry.name)
    batchKind.set(group, riskier(batchKind.get(group), entry.kind))
  }
  for (const kind of ["patch", "minor"]) {
    const key = kind
    const packages = [...inMajor.values()]
      .filter(
        (entry) =>
          !takenByMajors.has(entry.name) &&
          batchKind.get(unitOf(entry.name)) === kind
      )
      .map(withDocs)
    if (!packages.length || (only && only !== key)) {
      continue
    }
    const branch = `chore/deps-${key}`
    if (!only && openBranches.has(branch)) {
      pending.push({ key, branch })
      continue
    }
    groups.push({ key, kind, name: `${kind} updates`, packages })
  }

  return { groups, pending, deferred, skipped }
}

function readJson(file, fallback) {
  return file && existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : fallback
}

async function main() {
  const { values } = parseArgs({
    options: {
      out: { type: "string" },
      state: { type: "string" },
      "open-prs": { type: "string" },
      "include-majors": { type: "boolean", default: false },
      only: { type: "string" },
      config: { type: "string", default: ".github/dependency-updates.json" },
    },
  })
  if (!values.out) {
    console.error(
      "Usage: discover.mjs --out plan.json [--state state.json] [--open-prs branches.json] [--include-majors] [--only <key>]"
    )
    process.exit(1)
  }

  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  )
  const config = readJson(path.join(root, values.config))
  const state = readJson(values.state, {})
  const openBranches = new Set(readJson(values["open-prs"], []))

  const workspaces = listWorkspaces(root)
  const declarations = collectDeclarations(workspaces, config)
  const locked = parseLockfile(
    readFileSync(path.join(root, "yarn.lock"), "utf8")
  )

  const names = [...new Set(declarations.map((d) => d.name))]
  const packuments = new Map()
  await mapLimit(names, 16, async (name) => {
    packuments.set(name, await fetchPackument(name))
  })

  const times = new Map()
  const needsTimes = names.filter((name) => {
    const latest = packuments.get(name)?.["dist-tags"]?.latest
    return (
      latest &&
      parseVersion(latest) &&
      declarations.some((d) => {
        const current =
          locked.get(`${name}@npm:${d.spec}`) ?? parseRange(d.spec)?.version
        return (
          current &&
          parseVersion(current) &&
          compareVersions(latest, current) > 0
        )
      })
    )
  })
  await mapLimit(needsTimes, 8, async (name) => {
    times.set(name, (await fetchPackument(name, { full: true }))?.time ?? {})
  })

  const plan = buildPlan({
    declarations,
    locked,
    packuments,
    times,
    config,
    state,
    openBranches,
    includeMajors: values["include-majors"],
    only: values.only ?? null,
  })
  plan.generatedAt = new Date().toISOString()
  plan.metrics = computeMetrics({
    declarations,
    locked,
    lockfileVersions: lockedVersions(locked),
    packuments,
  })

  writeFileSync(values.out, JSON.stringify(plan, null, 2) + "\n")
  console.log(
    `Planned ${plan.groups.length} group(s): ${
      plan.groups.map((g) => g.key).join(", ") || "none"
    }`
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
