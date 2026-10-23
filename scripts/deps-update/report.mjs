#!/usr/bin/env node
// Folds a run's results into the dependency update state and, when the team
// has something to act on, posts a short weekly report to Linear.
//
// Usage:
//   node scripts/deps-update/report.mjs --plan plan.json --state state.json
//     --results <dir> --state-out new-state.json [--dry-run] [--post]
//
// <dir> holds the downloaded artifacts: deps-result-<key>/update-result.json
// and deps-pr-<key>/pr.json per group.
// --post requires LINEAR_API_KEY and LINEAR_TEAM_ID (DX); without it the report
// only goes to the step summary.

import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { linear, linearTeamId, plainText } from "./lib.mjs"

const METRICS_HISTORY = 26

function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null
}

function versionRange(pkg) {
  const from = [...new Set(pkg.changes.map((c) => c.from))].join(", ")
  const to = [...new Set(pkg.changes.map((c) => c.to))].join(", ")
  return `${from} → ${to}`
}

export function nextState({ state, plan, results, today }) {
  const packages = { ...(state.packages ?? {}) }
  for (const { result } of results) {
    for (const pkg of result?.packages ?? []) {
      if (pkg.outcome === "updated" && packages[pkg.name]?.status !== "held") {
        delete packages[pkg.name]
      } else if (pkg.outcome === "dropped" || pkg.outcome === "blocked") {
        packages[pkg.name] = {
          status: pkg.outcome === "dropped" ? "failed" : "blocked",
          target: pkg.to,
          reason: plainText(pkg.reason, 300),
          since:
            packages[pkg.name]?.target === pkg.to
              ? packages[pkg.name].since
              : today,
        }
      }
    }
  }
  const metrics = [
    ...(state.metrics ?? []).filter((m) => m.date !== today),
    { date: today, ...plan.metrics },
  ].slice(-METRICS_HISTORY)
  return { packages, metrics }
}

// Only minor and major work needs the team: patch PRs and quiet weeks post nothing.
export function buildReport({ plan, results, dryRun, runUrl }) {
  const review = []
  const decide = []
  for (const group of plan.groups) {
    if (group.kind === "patch") {
      continue
    }
    const label =
      group.kind === "minor"
        ? `Minor updates (${group.packages.length} packages)`
        : `${group.packages
            .map((p) => `${p.name} ${versionRange(p)}`)
            .join(", ")} (${group.pinned ? "pinned" : "major"})`
    if (dryRun) {
      review.push(`- ${label}`)
      continue
    }
    const entry = results.find((r) => r.key === group.key)
    const { result, pr } = entry ?? {}
    if (pr?.url) {
      const risk = result?.risk ? `, ${result.risk} risk` : ""
      review.push(`- ${label}${risk}: ${pr.url}`)
    } else if (pr?.violation === "conflict") {
      decide.push(
        `- ${label}: develop changed while it ran, so the update no longer applies; it'll be retried next week`
      )
    } else if (pr?.violation) {
      decide.push(
        `- ${label}: the change broke a workflow limit (${pr.violation}), so no PR was opened`
      )
    } else if (!result || result.status === "failed") {
      decide.push(
        `- ${label}: the update failed${
          result?.summary ? `: ${plainText(result.summary)}` : ""
        }`
      )
    }
    for (const pkg of result?.packages ?? []) {
      if (pkg.outcome === "dropped") {
        decide.push(
          `- ${pkg.name} ${pkg.to} was dropped: ${plainText(pkg.reason)}`
        )
      }
    }
  }
  if (!review.length && !decide.length) {
    return null
  }
  const lines = []
  if (review.length) {
    lines.push(
      dryRun ? "**Would open (dry run)**" : "**Needs review**",
      ...review,
      ""
    )
  }
  if (decide.length) {
    lines.push("**Needs a decision**", ...decide, "")
  }
  lines.push(`[Workflow run](${runUrl})`)
  return lines.join("\n")
}

async function postToLinear(title, description) {
  const teamId = linearTeamId()
  const existing = await linear(
    `query ($teamId: ID!, $title: String!) {
      issues(filter: { team: { id: { eq: $teamId } }, title: { eq: $title } }, first: 1) {
        nodes { id identifier }
      }
    }`,
    { teamId, title }
  )
  const issue = existing.issues.nodes[0]
  if (issue) {
    const data = await linear(
      `mutation ($input: CommentCreateInput!) {
        commentCreate(input: $input) { success }
      }`,
      { input: { issueId: issue.id, body: description } }
    )
    if (!data.commentCreate.success) {
      throw new Error(
        `commentCreate returned success=false on ${issue.identifier}`
      )
    }
    console.log(`Added the report as a comment on ${issue.identifier}`)
    return
  }
  const data = await linear(
    `mutation ($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { identifier url } }
    }`,
    { input: { teamId, title, description } }
  )
  if (!data.issueCreate.success) {
    throw new Error("issueCreate returned success=false")
  }
  console.log(
    `Posted ${data.issueCreate.issue.identifier} ${data.issueCreate.issue.url}`
  )
}

async function main() {
  const { values } = parseArgs({
    options: {
      plan: { type: "string" },
      state: { type: "string" },
      results: { type: "string" },
      "state-out": { type: "string" },
      "dry-run": { type: "boolean", default: false },
      post: { type: "boolean", default: false },
    },
  })
  if (
    !values.plan ||
    !values.state ||
    !values.results ||
    !values["state-out"]
  ) {
    console.error(
      "Usage: report.mjs --plan plan.json --state state.json --results <dir> --state-out new-state.json [--dry-run] [--post]"
    )
    process.exit(1)
  }
  const plan = readJson(values.plan)
  const state = readJson(values.state) ?? {}
  const results = plan.groups.map((group) => ({
    key: group.key,
    result: readJson(
      path.join(
        values.results,
        `deps-result-${group.key}`,
        "update-result.json"
      )
    ),
    pr: readJson(path.join(values.results, `deps-pr-${group.key}`, "pr.json")),
  }))
  const today = new Date().toISOString().slice(0, 10)

  writeFileSync(
    values["state-out"],
    JSON.stringify(nextState({ state, plan, results, today }), null, 2) + "\n"
  )

  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  const report = buildReport({
    plan,
    results,
    dryRun: values["dry-run"],
    runUrl,
  })
  if (!report) {
    console.log("Nothing needs the team this week; no report posted.")
    return
  }
  console.log(report)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `### Linear report${values.post ? "" : " (not posted)"}\n\n${report}\n`
    )
  }
  if (values.post) {
    await postToLinear(`Dependency updates: week of ${today}`, report)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
