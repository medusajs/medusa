#!/usr/bin/env node
// Create Linear triage tickets in the DX team for TRIAGE-state repository security
// advisories (reported at github.com/medusajs/medusa/security/advisories).
//
// Triage advisories are NOT delivered by the `repository_advisory` workflow event
// (that only fires on published/reported), so this polls the REST API for the
// `triage` state and creates one Linear issue per advisory. Dedup is stateless:
// before creating, we check the DX team for an existing issue whose title
// contains the advisory's GHSA id, so re-runs never duplicate.
//
// Usage:
//   node scripts/security-advisories-to-linear.mjs
//
// Requires env:
//   GH_TOKEN        PAT / App token with "Repository security advisories: Read"
//                   (the built-in GITHUB_TOKEN cannot read advisories, esp. drafts).
//   LINEAR_API_KEY  Linear API key (personal or workspace).
//   LINEAR_TEAM_ID  UUID of the target Linear team (DX).

import { execSync } from "node:child_process"

const REPO = process.env.GITHUB_REPOSITORY || "medusajs/medusa"
const LINEAR_API = "https://api.linear.app/graphql"
const LINEAR_API_KEY = process.env.LINEAR_API_KEY
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID

if (!LINEAR_API_KEY || !LINEAR_TEAM_ID) {
  console.error("Missing LINEAR_API_KEY or LINEAR_TEAM_ID env variable.")
  process.exit(1)
}

// Fetch triage advisories via the `gh` CLI (auth comes from GH_TOKEN).
// --paginate follows the cursor Link headers; --slurp yields an array-of-pages.
function fetchAdvisories() {
  const pages = JSON.parse(
    execSync(
      `gh api "/repos/${REPO}/security-advisories?state=triage&per_page=100" --paginate --slurp`,
      { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
    )
  ).flat()
  return pages.filter((a) => a?.ghsa_id)
}

async function linear(query, variables) {
  const res = await fetch(LINEAR_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: LINEAR_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (!res.ok || json.errors) {
    throw new Error(`Linear API error: ${res.status} ${JSON.stringify(json.errors ?? json)}`)
  }
  return json.data
}

// Resolve the DX team's Triage workflow state so created issues land in Triage
// explicitly, regardless of the API's default-state behaviour.
async function getTriageStateId() {
  const data = await linear(
    `query ($id: String!) {
      team(id: $id) { states { nodes { id type } } }
    }`,
    { id: LINEAR_TEAM_ID }
  )
  return data.team.states.nodes.find((s) => s.type === "triage")?.id ?? null
}

// A ticket already exists if any non-archived DX issue has the GHSA id in its title.
async function issueExists(ghsaId) {
  const data = await linear(
    `query ($teamId: ID!, $q: String!) {
      issues(
        filter: { team: { id: { eq: $teamId } }, title: { contains: $q } }
        first: 1
      ) { nodes { identifier } }
    }`,
    { teamId: LINEAR_TEAM_ID, q: ghsaId }
  )
  return data.issues.nodes.length > 0
}

function buildDescription(a) {
  return [
    `**GHSA:** ${a.ghsa_id}`,
    a.cve_id ? `**CVE:** ${a.cve_id}` : null,
    `**Severity:** ${a.severity ?? "unknown"}`,
    `**State:** ${a.state}`,
    `**Advisory:** ${a.html_url}`,
    "",
    a.description || a.summary || "_No description provided yet._",
    "",
    "---",
    "_Automatically opened from a GitHub repository security advisory._",
  ]
    .filter((line) => line !== null)
    .join("\n")
}

async function createIssue(a, triageStateId) {
  const summary = a.summary ? `: ${a.summary}` : ""
  const title = `[Security Advisory] ${a.ghsa_id}${summary}`.slice(0, 250)
  const data = await linear(
    `mutation ($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { identifier url } }
    }`,
    {
      input: {
        teamId: LINEAR_TEAM_ID,
        title,
        description: buildDescription(a),
        ...(triageStateId ? { stateId: triageStateId } : {}),
      },
    }
  )
  if (!data.issueCreate.success) {
    throw new Error(`issueCreate returned success=false for ${a.ghsa_id}`)
  }
  return data.issueCreate.issue
}

async function main() {
  const advisories = fetchAdvisories()
  console.log(`Found ${advisories.length} triage advisories in ${REPO}.`)

  const triageStateId = await getTriageStateId()
  if (!triageStateId) {
    console.warn("No Triage state found on the team; issues will use the team default state.")
  }

  let created = 0
  let skipped = 0
  const failures = []

  for (const a of advisories) {
    try {
      if (await issueExists(a.ghsa_id)) {
        skipped++
        console.log(`skip  ${a.ghsa_id} (ticket already exists)`)
        continue
      }
      const issue = await createIssue(a, triageStateId)
      created++
      console.log(`create ${a.ghsa_id} -> ${issue.identifier} ${issue.url}`)
    } catch (err) {
      failures.push(a.ghsa_id)
      console.error(`error ${a.ghsa_id}: ${err.message}`)
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failures.length}`)
  if (failures.length) {
    console.error(`Failed advisories: ${failures.join(", ")}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
