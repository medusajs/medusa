import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { plainText } from "../lib.mjs"
import { buildReport, nextState } from "../report.mjs"
import { parseStateBody, renderStateBody } from "../state.mjs"

const pkg = (name, from, to) => ({ name, changes: [{ from, to }] })
const plan = {
  metrics: { dependencies: 263, majorBehind: 121 },
  groups: [
    { key: "patch", kind: "patch", packages: [pkg("uuid", "9.0.0", "9.0.1")] },
    {
      key: "minor",
      kind: "minor",
      packages: [
        pkg("axios", "1.13.2", "1.20.0"),
        pkg("pg", "8.11.3", "8.23.1"),
      ],
    },
    {
      key: "major-stripe",
      kind: "major",
      packages: [pkg("stripe", "19.1.0", "23.0.0")],
    },
  ],
}
const runUrl = "https://github.com/medusajs/medusa/actions/runs/1"

describe("buildReport", () => {
  it("posts nothing when only patch updates happened", () => {
    const patchOnly = { ...plan, groups: [plan.groups[0]] }
    const results = [
      {
        key: "patch",
        result: { status: "proposed" },
        pr: { url: "https://x/1" },
      },
    ]
    assert.equal(
      buildReport({ plan: patchOnly, results, dryRun: false, runUrl }),
      null
    )
  })

  it("lists PRs to review and failures to decide on", () => {
    const report = buildReport({
      plan,
      results: [
        {
          key: "patch",
          result: { status: "proposed" },
          pr: { url: "https://x/1" },
        },
        {
          key: "minor",
          result: { status: "proposed", risk: "low" },
          pr: { url: "https://x/2" },
        },
        {
          key: "major-stripe",
          result: {
            status: "failed",
            summary:
              "Types changed. See [notes](https://evil.example) @someone",
            packages: [
              {
                name: "stripe",
                to: "23.0.0",
                outcome: "dropped",
                reason: "tests failed",
              },
            ],
          },
          pr: null,
        },
      ],
      dryRun: false,
      runUrl,
    })
    assert.equal(
      report,
      [
        "**Needs review**",
        "- Minor updates (2 packages), low risk: https://x/2",
        "",
        "**Needs a decision**",
        "- stripe 19.1.0 → 23.0.0 (major): the update failed: Types changed. See notes someone",
        "- stripe 23.0.0 was dropped: tests failed",
        "",
        `[Workflow run](${runUrl})`,
      ].join("\n")
    )
  })

  it("explains a patch that no longer applies to develop", () => {
    const report = buildReport({
      plan,
      results: [
        {
          key: "minor",
          result: { status: "proposed" },
          pr: { violation: "conflict" },
        },
      ],
      dryRun: false,
      runUrl,
    })
    assert.match(
      report,
      /^- Minor updates \(2 packages\): develop changed while it ran, so the update no longer applies; it'll be retried next week$/m
    )
  })

  it("labels pinned groups so they stand apart from majors", () => {
    const pinnedPlan = {
      ...plan,
      groups: [
        {
          key: "major-bullmq",
          kind: "major",
          pinned: true,
          packages: [pkg("bullmq", "5.13.0", "5.81.5")],
        },
      ],
    }
    const report = buildReport({
      plan: pinnedPlan,
      results: [
        {
          key: "major-bullmq",
          result: { status: "proposed", risk: "high" },
          pr: { url: "https://x/3" },
        },
      ],
      dryRun: false,
      runUrl,
    })
    assert.match(
      report,
      /^- bullmq 5\.13\.0 → 5\.81\.5 \(pinned\), high risk: https:\/\/x\/3$/m
    )
  })

  it("lists what would be opened in a dry run", () => {
    const report = buildReport({ plan, results: [], dryRun: true, runUrl })
    assert.match(
      report,
      /^\*\*Would open \(dry run\)\*\*\n- Minor updates \(2 packages\)\n- stripe 19\.1\.0 → 23\.0\.0 \(major\)/
    )
  })
})

describe("nextState", () => {
  it("records dropped and blocked packages and clears updated ones", () => {
    const state = {
      packages: {
        uuid: { status: "failed", target: "9.0.1", since: "2026-10-19" },
        awilix: { status: "held", reason: "stay on 8" },
      },
      metrics: [{ date: "2026-10-19", dependencies: 260 }],
    }
    const results = [
      {
        result: {
          packages: [
            { name: "uuid", to: "9.0.1", outcome: "updated" },
            { name: "awilix", to: "13.0.0", outcome: "updated" },
            {
              name: "typescript",
              to: "7.0.0",
              outcome: "blocked",
              reason: "tsc-alias needs the TS API",
            },
          ],
        },
      },
    ]
    const next = nextState({ state, plan, results, today: "2026-10-26" })
    assert.deepEqual(next.packages, {
      awilix: { status: "held", reason: "stay on 8" },
      typescript: {
        status: "blocked",
        target: "7.0.0",
        reason: "tsc-alias needs the TS API",
        since: "2026-10-26",
      },
    })
    assert.deepEqual(
      next.metrics.map((m) => m.date),
      ["2026-10-19", "2026-10-26"]
    )
  })
})

describe("nextState with skipped packages", () => {
  it("doesn't record packages the agent never attempted", () => {
    const state = {
      packages: {
        uuid: { status: "failed", target: "9.0.1", since: "2026-10-19" },
      },
    }
    const results = [
      {
        result: {
          status: "failed",
          packages: [
            {
              name: "axios",
              to: "1.20.0",
              outcome: "skipped",
              reason: "yarn was denied",
            },
            { name: "uuid", to: "9.0.1", outcome: "skipped" },
          ],
        },
      },
    ]
    const next = nextState({ state, plan, results, today: "2026-10-26" })
    assert.deepEqual(next.packages, state.packages)
  })
})

describe("plainText", () => {
  it("strips links, mentions, markup, and caps length", () => {
    assert.equal(
      plainText("see [docs](http://x) @a `b` <img src=x>"),
      "see docs a b"
    )
    assert.equal(plainText("x".repeat(200), 10), "xxxxxxx...")
  })
})

describe("state body", () => {
  it("round-trips the JSON block", () => {
    const state = {
      packages: {
        vite: { status: "blocked", target: "8.0.3", reason: "a | b" },
      },
      metrics: [],
    }
    assert.deepEqual(parseStateBody(renderStateBody(state)), state)
    assert.deepEqual(parseStateBody("no json here"), {})
    assert.deepEqual(parseStateBody("```json\nnot json\n```"), {})
  })
})
