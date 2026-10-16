#!/usr/bin/env node

// Creates a DX Linear ticket per failing AFDocs check across the docs apps. Reads every
// `<app>.json` report (`afdocs check --format json --score`) in the given directory and
// skips checks that already have an open ticket. Writes a scorecard to the job summary.
//
// Usage: yarn report:agent-docs <reports-dir>

import { LinearClient, Team } from "@linear/sdk"
import fs from "fs"
import path from "path"

type AfdocsResult = {
  id: string
  status: "pass" | "warn" | "fail" | "skip" | "error"
  message: string
  details?: {
    pageResults?: { url?: string; status?: unknown; found?: boolean }[]
  }
}

type AfdocsReport = {
  url: string
  results: AfdocsResult[]
  summary: { pass: number; warn: number; fail: number }
  scoring?: {
    overall: number
    grade: string
    resolutions?: Record<string, string>
  }
}

type CheckFailure = {
  app: string
  url: string
  message: string
  fix?: string
  pages: string[]
}

type Ticket = {
  checkId: string
  identifier: string
  url: string
  status: "created" | "existing"
}

const TITLE_PREFIX = "[Agent Docs]"
const MAX_PAGES_PER_APP = 10

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
})

const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null

function readReports(reportsDir: string) {
  return fs
    .readdirSync(reportsDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({
      app: path.basename(file, ".json"),
      report: JSON.parse(
        fs.readFileSync(path.join(reportsDir, file), "utf-8")
      ) as AfdocsReport,
    }))
}

function getFailingPages(result: AfdocsResult) {
  return (result.details?.pageResults ?? [])
    .filter((page) => page.status === "fail" || page.found === false)
    .map((page) => page.url)
    .filter((url): url is string => !!url)
    .slice(0, MAX_PAGES_PER_APP)
}

function groupFailuresByCheck(
  reports: { app: string; report: AfdocsReport }[]
) {
  const failures = new Map<string, CheckFailure[]>()
  for (const { app, report } of reports) {
    for (const result of report.results) {
      if (result.status !== "fail") {
        continue
      }
      const checkFailures = failures.get(result.id) ?? []
      checkFailures.push({
        app,
        url: report.url,
        message: result.message,
        fix: report.scoring?.resolutions?.[result.id],
        pages: getFailingPages(result),
      })
      failures.set(result.id, checkFailures)
    }
  }
  return failures
}

// Closed tickets are ignored so a check that regresses after a fix gets a new ticket.
async function findOpenIssue(team: Team, checkId: string) {
  const issues = await team.issues({
    filter: {
      title: { contains: `${TITLE_PREFIX} ${checkId} failing` },
      state: { type: { nin: ["completed", "canceled"] } },
    },
    first: 1,
  })
  return issues.nodes[0]
}

function buildDescription(checkId: string, failures: CheckFailure[]) {
  const sections = failures.map((failure) =>
    [
      `### ${failure.app}`,
      `**Scanned:** ${failure.url}`,
      "",
      failure.message,
      failure.fix ? `\n**Fix:** ${failure.fix}` : null,
      failure.pages.length
        ? `\n**Affected pages (sample):**\n${failure.pages
            .map((page) => `- ${page}`)
            .join("\n")}`
        : null,
    ]
      .filter((line) => line !== null)
      .join("\n")
  )

  return [
    `**Check:** [\`${checkId}\`](https://afdocs.dev/checks/)`,
    `**Apps:** ${failures.map((failure) => failure.app).join(", ")}`,
    runUrl ? `**Workflow run:** ${runUrl}` : null,
    "",
    sections.join("\n\n"),
    "",
    "---",
    "_Automatically opened by the Agent-Friendly Docs Scan workflow (AFDocs)._",
  ]
    .filter((line) => line !== null)
    .join("\n")
}

function writeSummary(
  reports: { app: string; report: AfdocsReport }[],
  tickets: Ticket[]
) {
  if (!process.env.GITHUB_STEP_SUMMARY) {
    return
  }
  const rows = reports.map(({ app, report }) => {
    const { pass, warn, fail } = report.summary
    return `| ${app} | ${report.scoring?.overall ?? "-"} (${
      report.scoring?.grade ?? "-"
    }) | ${pass} | ${warn} | ${fail} |`
  })
  const ticketLines = tickets.map(
    (ticket) =>
      `- \`${ticket.checkId}\`: [${ticket.identifier}](${ticket.url}) (${ticket.status})`
  )
  fs.appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      "## Agent-Friendly Docs Scan",
      "",
      "| App | Score | Pass | Warn | Fail |",
      "| --- | --- | --- | --- | --- |",
      ...rows,
      "",
      ticketLines.length ? "### Linear tickets" : "No failing checks.",
      ...ticketLines,
      "",
    ].join("\n")
  )
}

async function main() {
  const reportsDir = process.argv[2]
  if (!reportsDir) {
    throw new Error("Usage: yarn report:agent-docs <reports-dir>")
  }

  const reports = readReports(reportsDir)
  console.log(`Read ${reports.length} AFDocs reports from ${reportsDir}.`)

  const failures = groupFailuresByCheck(reports)
  const tickets: Ticket[] = []
  const errors: string[] = []

  if (failures.size) {
    const teams = await linearClient.teams({
      filter: { name: { eqIgnoreCase: "DX" } },
      first: 1,
    })
    const team = teams.nodes[0]
    if (!team) {
      throw new Error("Couldn't find the DX team in Linear.")
    }

    const triageStates = await team.states({
      filter: { type: { eq: "triage" } },
      first: 1,
    })
    const triageStateId = triageStates.nodes[0]?.id

    for (const [checkId, checkFailures] of failures) {
      try {
        const existing = await findOpenIssue(team, checkId)
        if (existing) {
          tickets.push({
            checkId,
            identifier: existing.identifier,
            url: existing.url,
            status: "existing",
          })
          console.log(`skip   ${checkId} (open ticket ${existing.identifier})`)
          continue
        }

        const payload = await linearClient.createIssue({
          teamId: team.id,
          title: `${TITLE_PREFIX} ${checkId} failing in ${checkFailures
            .map((failure) => failure.app)
            .join(", ")}`.slice(0, 250),
          description: buildDescription(checkId, checkFailures),
          stateId: triageStateId,
        })
        const issue = await payload.issue
        if (!payload.success || !issue) {
          throw new Error("Linear didn't return the created issue.")
        }
        tickets.push({
          checkId,
          identifier: issue.identifier,
          url: issue.url,
          status: "created",
        })
        console.log(`create ${checkId} -> ${issue.identifier} ${issue.url}`)
      } catch (err) {
        errors.push(checkId)
        console.error(`error  ${checkId}: ${(err as Error).message}`)
      }
    }
  }

  writeSummary(reports, tickets)

  const created = tickets.filter((ticket) => ticket.status === "created")
  console.log(
    `\nDone. failing=${failures.size} created=${created.length} errors=${errors.length}`
  )
  if (errors.length) {
    throw new Error(`Failed checks: ${errors.join(", ")}`)
  }
}

void main().catch((err) => {
  console.error(err)
  process.exit(1)
})
