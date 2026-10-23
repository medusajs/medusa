import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildPlan, collectDeclarations } from "../discover.mjs"

const NOW = Date.parse("2026-10-26T06:00:00Z")
const OLD = "2026-01-01T00:00:00Z"
const FRESH = "2026-10-25T00:00:00Z"

const config = {
  cooldownDays: 3,
  maxMajorsPerWeek: 1,
  maxMajorJump: 20,
  ignore: ["@medusajs/*"],
  groups: [{ name: "vite", packages: ["vite", "vitest"] }],
  context7: { vite: "/vitejs/vite" },
}

function registry(entries) {
  const packuments = new Map()
  const times = new Map()
  for (const [name, versions, latest] of entries) {
    packuments.set(name, {
      "dist-tags": { latest: latest ?? Object.keys(versions).at(-1) },
      versions: Object.fromEntries(
        Object.entries(versions).map(([v, meta]) => [
          v,
          meta.deprecated ? { deprecated: "x" } : {},
        ])
      ),
    })
    times.set(
      name,
      Object.fromEntries(
        Object.entries(versions).map(([v, meta]) => [v, meta.time ?? OLD])
      )
    )
  }
  return { packuments, times }
}

function plan({
  declarations,
  locked = {},
  entries,
  state,
  openBranches,
  includeMajors = true,
  only,
}) {
  return buildPlan({
    declarations: declarations.map((d) => ({
      field: "dependencies",
      workspace: "packages/a",
      published: true,
      ...d,
    })),
    locked: new Map(Object.entries(locked)),
    ...registry(entries),
    config,
    state,
    openBranches: new Set(openBranches ?? []),
    includeMajors,
    only,
    now: NOW,
  })
}

describe("collectDeclarations", () => {
  it("skips workspace packages and ignored names", () => {
    const workspaces = [
      {
        location: "packages/a",
        name: "@medusajs/a",
        published: true,
        manifest: {
          dependencies: {
            "@medusajs/b": "workspace:*",
            "@medusajs/types": "2.0.0",
            uuid: "^9.0.0",
          },
          peerDependencies: { react: "^18.0.0" },
        },
      },
      {
        location: "packages/b",
        name: "@medusajs/b",
        published: true,
        manifest: {},
      },
    ]
    const declarations = collectDeclarations(workspaces, config)
    assert.deepEqual(
      declarations.map((d) => `${d.field}:${d.name}`),
      ["dependencies:uuid", "peerDependencies:react"]
    )
  })
})

describe("buildPlan", () => {
  it("refreshes the lockfile for in-range updates and bumps exact pins", () => {
    const result = plan({
      declarations: [
        { name: "uuid", spec: "^9.0.0" },
        { name: "pinned", spec: "1.5.7" },
      ],
      locked: { "uuid@npm:^9.0.0": "9.0.0", "pinned@npm:1.5.7": "1.5.7" },
      entries: [
        ["uuid", { "9.0.0": {}, "9.0.1": {} }],
        ["pinned", { "1.5.7": {}, "1.6.0": {} }],
      ],
    })
    const patch = result.groups.find((g) => g.key === "patch")
    const minor = result.groups.find((g) => g.key === "minor")
    assert.deepEqual(patch.packages[0].changes[0], {
      workspace: "packages/a",
      field: "dependencies",
      spec: "^9.0.0",
      from: "9.0.0",
      to: "9.0.1",
      newSpec: "^9.0.0",
      action: "lockfile",
    })
    assert.equal(minor.packages[0].changes[0].newSpec, "1.6.0")
    assert.equal(minor.packages[0].changes[0].action, "range")
  })

  it("skips releases inside the cooldown, deprecated releases, and prereleases", () => {
    const result = plan({
      declarations: [{ name: "lib", spec: "^1.0.0" }],
      locked: { "lib@npm:^1.0.0": "1.0.0" },
      entries: [
        [
          "lib",
          {
            "1.0.0": {},
            "1.0.1": {},
            "1.0.2": { deprecated: true },
            "1.0.3": { time: FRESH },
            "2.0.0-rc.1": {},
          },
          "1.0.3",
        ],
      ],
    })
    assert.equal(result.groups.length, 1)
    assert.equal(result.groups[0].packages[0].changes[0].to, "1.0.1")
  })

  it("flags suspicious major jumps instead of planning them", () => {
    const result = plan({
      declarations: [{ name: "dotenv-expand", spec: "^11.0.0" }],
      locked: { "dotenv-expand@npm:^11.0.0": "11.0.7" },
      entries: [["dotenv-expand", { "11.0.7": {}, "1000.0.0": {} }]],
    })
    assert.equal(result.groups.length, 0)
    assert.match(result.skipped[0].reason, /suspicious jump/)
  })

  it("groups majors, caps them per week, and prefers shipped dependencies", () => {
    const result = plan({
      declarations: [
        { name: "vite", spec: "^7.0.0", field: "devDependencies" },
        { name: "vitest", spec: "^4.0.0", field: "devDependencies" },
        { name: "express", spec: "^4.0.0" },
      ],
      locked: {
        "vite@npm:^7.0.0": "7.3.6",
        "vitest@npm:^4.0.0": "4.1.10",
        "express@npm:^4.0.0": "4.22.1",
      },
      entries: [
        ["vite", { "7.3.6": {}, "8.0.3": {} }],
        ["vitest", { "4.1.10": {}, "5.0.2": {} }],
        ["express", { "4.22.1": {}, "5.1.0": {} }],
      ],
    })
    assert.deepEqual(
      result.groups.map((g) => g.key),
      ["major-express"]
    )
    assert.deepEqual(result.deferred, [
      { key: "major-vite", reason: "weekly major cap reached" },
    ])
  })

  it("moves a selected major's in-range updates into its group", () => {
    const result = plan({
      declarations: [
        { name: "vite", spec: "^7.0.0", workspace: "packages/a" },
        { name: "vite", spec: "^8.0.0", workspace: "packages/b" },
      ],
      locked: { "vite@npm:^7.0.0": "7.3.6", "vite@npm:^8.0.0": "8.0.1" },
      entries: [["vite", { "7.3.6": {}, "8.0.1": {}, "8.0.3": {} }]],
    })
    assert.deepEqual(
      result.groups.map((g) => g.key),
      ["major-vite"]
    )
    const vite = result.groups[0].packages[0]
    assert.equal(vite.context7, "/vitejs/vite")
    assert.deepEqual(
      vite.changes.map((c) => `${c.workspace} ${c.from}->${c.to}`),
      ["packages/a 7.3.6->8.0.3", "packages/b 8.0.1->8.0.3"]
    )
  })

  it("keeps whole config groups in the riskiest batch", () => {
    const result = plan({
      declarations: [
        { name: "vite", spec: "^7.0.0" },
        { name: "vitest", spec: "^4.0.0" },
      ],
      locked: { "vite@npm:^7.0.0": "7.3.6", "vitest@npm:^4.0.0": "4.1.10" },
      entries: [
        ["vite", { "7.3.6": {}, "7.3.7": {} }],
        ["vitest", { "4.1.10": {}, "4.2.0": {} }],
      ],
    })
    assert.deepEqual(
      result.groups.map((g) => g.key),
      ["minor"]
    )
    assert.equal(result.groups[0].packages.length, 2)
  })

  it("respects state, open PRs, and the majors switch", () => {
    const base = {
      declarations: [
        { name: "express", spec: "^4.0.0" },
        { name: "uuid", spec: "^9.0.0" },
        { name: "awilix", spec: "^8.0.0" },
      ],
      locked: {
        "express@npm:^4.0.0": "4.22.1",
        "uuid@npm:^9.0.0": "9.0.0",
        "awilix@npm:^8.0.0": "8.0.0",
      },
      entries: [
        ["express", { "4.22.1": {}, "5.1.0": {} }],
        ["uuid", { "9.0.0": {}, "9.0.1": {} }],
        ["awilix", { "8.0.0": {}, "13.0.0": {} }],
      ],
    }

    const blocked = plan({
      ...base,
      state: {
        packages: {
          express: {
            status: "blocked",
            target: "5.1.0",
            reason: "waiting on upstream",
          },
          awilix: { status: "held", reason: "stay on 8" },
        },
      },
    })
    assert.deepEqual(
      blocked.groups.map((g) => g.key),
      ["patch"]
    )
    assert.equal(blocked.skipped.length, 2)

    const open = plan({
      ...base,
      openBranches: ["chore/deps-patch", "chore/deps-major-express"],
    })
    assert.deepEqual(
      open.groups.map((g) => g.key),
      []
    )
    assert.deepEqual(
      open.pending.map((p) => p.key),
      ["major-express", "patch"]
    )

    const noMajors = plan({ ...base, includeMajors: false })
    assert.deepEqual(
      noMajors.groups.map((g) => g.key),
      ["patch"]
    )
    assert.equal(noMajors.deferred.length, 2)

    const only = plan({
      ...base,
      includeMajors: false,
      only: "major-awilix",
      openBranches: ["chore/deps-major-awilix"],
    })
    assert.deepEqual(
      only.groups.map((g) => g.key),
      ["major-awilix"]
    )
  })
})
