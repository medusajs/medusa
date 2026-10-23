#!/usr/bin/env node
// Reads and writes the dependency update state kept in a pinned GitHub issue.
//
// Usage:
//   node scripts/deps-update/state.mjs read --out state.json
//   node scripts/deps-update/state.mjs write --in state.json
//
// Requires GH_TOKEN (issues: read for `read`, issues: write for `write`).

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

export const STATE_LABEL = "dependency-update-state"
const TITLE = "Dependency update state"
const REPO = process.env.GITHUB_REPOSITORY || "medusajs/medusa"

export function parseStateBody(body) {
  const match = /```json\n([\s\S]*?)\n```/.exec(body ?? "")
  if (!match) {
    return {}
  }
  try {
    const state = JSON.parse(match[1])
    return state && typeof state === "object" ? state : {}
  } catch {
    return {}
  }
}

export function renderStateBody(state) {
  const rows = Object.entries(state.packages ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([name, entry]) =>
        `| \`${name}\` | ${entry.status} | ${entry.target ?? ""} | ${
          entry.since ?? ""
        } | ${(entry.reason ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`
    )
  const latest = state.metrics?.at(-1)
  return [
    'Tracked by `.github/workflows/update-dependencies.yml`. The JSON block below is the source of truth: edit it to hold a package (`"status": "held"`) or to clear a blocked entry.',
    "",
    rows.length
      ? [
          "| Package | Status | Target | Since | Reason |",
          "| --- | --- | --- | --- | --- |",
          ...rows,
        ].join("\n")
      : "_No blocked, failed, or held packages._",
    "",
    latest
      ? `Latest health (${latest.date}): ${latest.majorBehind} of ${latest.dependencies} dependencies at least 1 major behind (${latest.shippedMajorBehind} shipped), ${latest.threeMajorsBehind} 3+ majors behind, ${latest.deprecated} deprecated, ${latest.duplicated} with 3+ copies in yarn.lock.`
      : "",
    "",
    "```json",
    JSON.stringify(state, null, 2),
    "```",
    "",
  ].join("\n")
}

function gh(args) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  })
}

// Only an issue opened by a bot is trusted, so a look-alike issue can't feed the plan.
function findIssue() {
  const issues = JSON.parse(
    gh([
      "issue",
      "list",
      "--repo",
      REPO,
      "--label",
      STATE_LABEL,
      "--state",
      "open",
      "--json",
      "number,body,author",
      "--limit",
      "20",
    ])
  )
  return issues.find((issue) => issue.author?.is_bot) ?? null
}

function main() {
  const [command, flag, file] = process.argv.slice(2)
  if (
    !["read", "write"].includes(command) ||
    !["--out", "--in"].includes(flag) ||
    !file
  ) {
    console.error(
      "Usage: state.mjs read --out state.json | write --in state.json"
    )
    process.exit(1)
  }

  if (command === "read") {
    const issue = findIssue()
    writeFileSync(
      file,
      JSON.stringify(issue ? parseStateBody(issue.body) : {}, null, 2) + "\n"
    )
    console.log(
      issue
        ? `Read state from #${issue.number}`
        : "No state issue yet; starting empty."
    )
    return
  }

  const bodyFile = `${file}.md`
  writeFileSync(
    bodyFile,
    renderStateBody(JSON.parse(readFileSync(file, "utf8")))
  )
  const issue = findIssue()
  if (issue) {
    gh([
      "issue",
      "edit",
      String(issue.number),
      "--repo",
      REPO,
      "--body-file",
      bodyFile,
    ])
    console.log(`Updated state issue #${issue.number}`)
    return
  }
  gh([
    "label",
    "create",
    STATE_LABEL,
    "--repo",
    REPO,
    "--color",
    "ededed",
    "--description",
    "State for the dependency update workflow",
    "--force",
  ])
  const url = gh([
    "issue",
    "create",
    "--repo",
    REPO,
    "--title",
    TITLE,
    "--label",
    STATE_LABEL,
    "--body-file",
    bodyFile,
  ]).trim()
  try {
    gh(["issue", "pin", url, "--repo", REPO])
  } catch {
    console.warn("Could not pin the state issue.")
  }
  console.log(`Created state issue ${url}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
