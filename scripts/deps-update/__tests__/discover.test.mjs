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
  it("refreshes the lockfile for in-range updates", () => {
    const result = plan({
      declarations: [{ name: "uuid", spec: "^9.0.0" }],
      locked: { "uuid@npm:^9.0.0": "9.0.0" },
      entries: [["uuid", { "9.0.0": {}, "9.0.1": {} }]],
    })
    assert.deepEqual(result.groups[0].packages[0].changes[0], {
      workspace: "packages/a",
      field: "dependencies",
      spec: "^9.0.0",
      from: "9.0.0",
      to: "9.0.1",
      newSpec: "^9.0.0",
      action: "lockfile",
    })
  })

  it("plans exact pins like majors: own group, capped, off with majors", () => {
    const base = {
      declarations: [
        { name: "bullmq", spec: "5.13.0" },
        { name: "bullmq", spec: "^5.13.0", workspace: "packages/b" },
        { name: "express", spec: "^4.0.0" },
      ],
      locked: {
        "bullmq@npm:5.13.0": "5.13.0",
        "bullmq@npm:^5.13.0": "5.13.0",
        "express@npm:^4.0.0": "4.22.1",
      },
      entries: [
        ["bullmq", { "5.13.0": {}, "5.81.5": {} }],
        ["express", { "4.22.1": {}, "5.1.0": {} }],
      ],
    }

    const result = plan(base)
    assert.deepEqual(
      result.groups.map((g) => g.key),
      ["major-express", "minor"]
    )
    assert.deepEqual(result.deferred, [
      { key: "major-bullmq", reason: "weekly major cap reached" },
    ])
    assert.deepEqual(
      result.groups[1].packages[0].changes.map((c) => c.workspace),
      ["packages/b"]
    )

    const only = plan({ ...base, only: "major-bullmq" })
    const unit = only.groups[0]
    assert.equal(unit.kind, "major")
    assert.equal(unit.pinned, true)
    assert.deepEqual(
      unit.packages[0].changes.map((c) => `${c.workspace} ${c.newSpec}`),
      ["packages/a 5.81.5", "packages/b ^5.13.0"]
    )

    const off = plan({ ...base, includeMajors: false })
    assert.deepEqual(
      off.deferred.map((d) => d.key),
      ["major-express", "major-bullmq"]
    )
  })

  it("keeps a pinned package in its major group when both apply", () => {
    const result = plan({
      declarations: [
        { name: "stripe", spec: "19.1.0" },
        { name: "stripe", spec: "^15.5.0", workspace: "packages/b" },
      ],
      locked: {
        "stripe@npm:19.1.0": "19.1.0",
        "stripe@npm:^15.5.0": "15.12.0",
      },
      entries: [
        ["stripe", { "15.12.0": {}, "19.1.0": {}, "19.3.0": {}, "23.0.0": {} }],
      ],
    })
    const unit = result.groups[0]
    assert.equal(unit.key, "major-stripe")
    assert.equal(unit.pinned, false)
    assert.deepEqual(
      unit.packages[0].changes.map((c) => `${c.workspace} ${c.to}`),
      ["packages/a 23.0.0", "packages/b 23.0.0"]
    )
  })

  it("pairs @types packages with the package they type", () => {
    const result = plan({
      declarations: [
        { name: "express", spec: "^4.0.0" },
        { name: "@types/express", spec: "^4.0.0", field: "devDependencies" },
        { name: "@types/scope__pkg", spec: "^1.0.0", field: "devDependencies" },
        { name: "@scope/pkg", spec: "^1.0.0" },
        { name: "@types/node", spec: "^20.0.0", field: "devDependencies" },
      ],
      locked: {
        "express@npm:^4.0.0": "4.22.1",
        "@types/express@npm:^4.0.0": "4.17.21",
        "@types/scope__pkg@npm:^1.0.0": "1.0.0",
        "@scope/pkg@npm:^1.0.0": "1.0.0",
        "@types/node@npm:^20.0.0": "20.19.27",
      },
      entries: [
        ["express", { "4.22.1": {}, "5.1.0": {} }],
        ["@types/express", { "4.17.21": {}, "5.0.3": {} }],
        ["@types/scope__pkg", { "1.0.0": {}, "2.0.0": {} }],
        ["@scope/pkg", { "1.0.0": {}, "2.0.0": {} }],
        ["@types/node", { "20.19.27": {}, "24.0.0": {} }],
      ],
      only: "major-express",
    })
    assert.deepEqual(
      result.groups[0].packages.map((p) => p.name),
      ["express", "@types/express"]
    )
    const all = plan({
      declarations: [
        { name: "@scope/pkg", spec: "^1.0.0" },
        { name: "@types/scope__pkg", spec: "^1.0.0", field: "devDependencies" },
        { name: "@types/node", spec: "^20.0.0", field: "devDependencies" },
      ],
      locked: {
        "@scope/pkg@npm:^1.0.0": "1.0.0",
        "@types/scope__pkg@npm:^1.0.0": "1.0.0",
        "@types/node@npm:^20.0.0": "20.19.27",
      },
      entries: [
        ["@scope/pkg", { "1.0.0": {}, "2.0.0": {} }],
        ["@types/scope__pkg", { "1.0.0": {}, "2.0.0": {} }],
        ["@types/node", { "20.19.27": {}, "24.0.0": {} }],
      ],
      includeMajors: false,
    })
    assert.deepEqual(
      all.deferred.map((d) => d.key),
      ["major-scope-pkg", "major-types-node"]
    )
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
