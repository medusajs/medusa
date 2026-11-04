import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  bumpKind,
  compareVersions,
  matchesAny,
  parseLockfile,
  parseRange,
  satisfies,
} from "../lib.mjs"

describe("parseRange", () => {
  it("parses caret, tilde, exact, and partial ranges", () => {
    assert.deepEqual(parseRange("^5.1.0"), {
      operator: "^",
      version: "5.1.0",
      exact: false,
    })
    assert.deepEqual(parseRange("~1.2.3"), {
      operator: "~",
      version: "1.2.3",
      exact: false,
    })
    assert.deepEqual(parseRange("1.5.7"), {
      operator: "",
      version: "1.5.7",
      exact: true,
    })
    assert.deepEqual(parseRange("^8"), {
      operator: "^",
      version: "8.0.0",
      exact: false,
    })
    assert.deepEqual(parseRange("5.x"), {
      operator: "^",
      version: "5.0.0",
      exact: false,
    })
  })

  it("rejects ranges it can't bump safely", () => {
    for (const spec of [
      ">=22",
      "^1 || ^2",
      "workspace:*",
      "npm:foo@^1",
      "*",
      "^1.0.0-pre.53",
    ]) {
      assert.equal(parseRange(spec), null, spec)
    }
  })
})

describe("satisfies", () => {
  it("follows caret semantics, including 0.x", () => {
    assert.equal(satisfies("5.9.0", parseRange("^5.1.0")), true)
    assert.equal(satisfies("6.0.0", parseRange("^5.1.0")), false)
    assert.equal(satisfies("0.2.9", parseRange("^0.2.1")), true)
    assert.equal(satisfies("0.3.0", parseRange("^0.2.1")), false)
    assert.equal(satisfies("1.2.9", parseRange("~1.2.3")), true)
    assert.equal(satisfies("1.3.0", parseRange("~1.2.3")), false)
    assert.equal(satisfies("1.5.8", parseRange("1.5.7")), false)
  })
})

describe("bumpKind", () => {
  it("classifies bumps and treats 0.x minors as major", () => {
    assert.equal(bumpKind("1.2.3", "1.2.4"), "patch")
    assert.equal(bumpKind("1.2.3", "1.4.0"), "minor")
    assert.equal(bumpKind("1.2.3", "2.0.0"), "major")
    assert.equal(bumpKind("0.2.3", "0.3.0"), "major")
    assert.equal(bumpKind("1.2.3", "1.2.3"), null)
  })
})

describe("compareVersions", () => {
  it("orders prereleases before releases", () => {
    assert.ok(compareVersions("1.0.0-rc.1", "1.0.0") < 0)
    assert.ok(compareVersions("1.10.0", "1.9.0") > 0)
  })
})

describe("parseLockfile", () => {
  it("maps every npm descriptor to its resolved version", () => {
    const lock = [
      "__metadata:",
      "  version: 6",
      "",
      '"vite@npm:^7.0.0, vite@npm:^7.3.6":',
      "  version: 7.3.6",
      '  resolution: "vite@npm:7.3.6"',
      "",
      '"@scope/pkg@npm:1.0.0":',
      "  version: 1.0.0",
      "",
      '"resolve@patch:resolve@^1.1.7#~builtin<compat/resolve>":',
      "  version: 1.22.8",
    ].join("\n")
    const resolved = parseLockfile(lock)
    assert.equal(resolved.get("vite@npm:^7.0.0"), "7.3.6")
    assert.equal(resolved.get("vite@npm:^7.3.6"), "7.3.6")
    assert.equal(resolved.get("@scope/pkg@npm:1.0.0"), "1.0.0")
    assert.equal(resolved.size, 3)
  })
})

describe("matchesAny", () => {
  it("matches exact names and trailing wildcards", () => {
    assert.equal(matchesAny("@mikro-orm/core", ["@mikro-orm/*"]), true)
    assert.equal(matchesAny("jest-environment-node", ["jest-*"]), true)
    assert.equal(matchesAny("jest", ["jest-*"]), false)
    assert.equal(matchesAny("vite", ["vite"]), true)
    assert.equal(matchesAny("vitest", ["vite"]), false)
  })
})
