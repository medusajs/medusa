import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { newestSatisfying, planLockfileUpdates } from "../apply-lockfile.mjs"

const change = (spec, to, action = "lockfile") => ({ spec, to, action })

describe("newestSatisfying", () => {
  it("picks the highest release inside the range", () => {
    const versions = ["1.0.0", "1.2.0", "1.3.0-rc.1", "2.0.0"]
    assert.equal(newestSatisfying(versions, "^1.0.0"), "1.2.0")
    assert.equal(newestSatisfying(versions, "~1.0.0"), "1.0.0")
    assert.equal(newestSatisfying(versions, "^3.0.0"), null)
  })
})

describe("planLockfileUpdates", () => {
  it("refreshes packages already targeting their newest match and pins the rest", () => {
    const group = {
      packages: [
        { name: "axios", changes: [change("^1.12.0", "1.20.0")] },
        {
          name: "pg",
          changes: [change("^8.11.3", "8.23.1"), change("^8.13.0", "8.23.1")],
        },
        { name: "zod", changes: [change("4.2.0", "4.6.7", "range")] },
      ],
    }
    const versions = new Map([
      ["axios", ["1.12.0", "1.20.0"]],
      ["pg", ["8.11.3", "8.23.1", "8.24.0"]],
    ])
    const plan = planLockfileUpdates(group, versions)
    assert.deepEqual(plan.refresh, ["axios"])
    assert.deepEqual(plan.pins, [
      { descriptor: "pg@npm:^8.11.3", to: "8.23.1" },
      { descriptor: "pg@npm:^8.13.0", to: "8.23.1" },
    ])
    assert.equal(plan.changes.length, 3)
  })

  it("rejects changes that aren't safe to pass to yarn", () => {
    const group = {
      packages: [
        { name: "evil;rm -rf", changes: [change("^1.0.0", "1.0.1")] },
        { name: "ok", changes: [change("^1.0.0", "not-a-version")] },
      ],
    }
    const plan = planLockfileUpdates(group, new Map())
    assert.equal(plan.invalid.length, 2)
    assert.deepEqual(plan.refresh, [])
    assert.deepEqual(plan.pins, [])
  })
})
