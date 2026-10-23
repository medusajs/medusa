#!/usr/bin/env node
// Reads and writes the dependency update state kept in an In Progress Linear
// issue in the DX team.
//
// Usage:
//   node scripts/deps-update/state.mjs read --out state.json
//   node scripts/deps-update/state.mjs write --in state.json
//
// Requires LINEAR_API_KEY and LINEAR_TEAM_ID.

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { linear, linearTeamId } from "./lib.mjs"

const TITLE = "Dependency update state"

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

// Only an open issue created by the workflow's own Linear key is trusted.
async function findIssue(teamId) {
  const data = await linear(
    `query ($teamId: ID!, $title: String!) {
      issues(
        filter: {
          team: { id: { eq: $teamId } }
          title: { eq: $title }
          creator: { isMe: { eq: true } }
          state: { type: { nin: ["completed", "canceled", "duplicate"] } }
        }
        first: 1
      ) { nodes { id identifier description } }
    }`,
    { teamId, title: TITLE }
  )
  return data.issues.nodes[0] ?? null
}

async function inProgressStateId(teamId) {
  const data = await linear(
    `query ($teamId: String!) {
      team(id: $teamId) { states { nodes { id name type position } } }
    }`,
    { teamId }
  )
  const started = data.team.states.nodes
    .filter((s) => s.type === "started")
    .sort((a, b) => a.position - b.position)
  return (started.find((s) => s.name === "In Progress") ?? started[0])?.id
}

async function main() {
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
  const teamId = linearTeamId()

  if (command === "read") {
    const issue = await findIssue(teamId)
    writeFileSync(
      file,
      JSON.stringify(issue ? parseStateBody(issue.description) : {}, null, 2) +
        "\n"
    )
    console.log(
      issue
        ? `Read state from ${issue.identifier}`
        : "No state issue yet; starting empty."
    )
    return
  }

  const description = renderStateBody(JSON.parse(readFileSync(file, "utf8")))
  const issue = await findIssue(teamId)
  if (issue) {
    await linear(
      `mutation ($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { description } }
    )
    console.log(`Updated state issue ${issue.identifier}`)
    return
  }
  const stateId = await inProgressStateId(teamId)
  const data = await linear(
    `mutation ($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { identifier url } }
    }`,
    {
      input: {
        teamId,
        title: TITLE,
        description,
        ...(stateId ? { stateId } : {}),
      },
    }
  )
  if (!data.issueCreate.success) {
    throw new Error("issueCreate returned success=false")
  }
  console.log(`Created state issue ${data.issueCreate.issue.url}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
