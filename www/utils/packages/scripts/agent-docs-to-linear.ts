#!/usr/bin/env node

// Creates a DX Linear ticket per failing AFDocs check in a docs scan report
// (`afdocs check --format json --score`) and skips checks that already have an open
// ticket. Writes a scorecard to the job summary.
//
// Usage: yarn report:agent-docs <report-file>

import { LinearClient, Team } from "@linear/sdk"
import fs from "fs"

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
  checkId: string
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
const MAX_PAGES = 20

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
})

const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null

function getFailingPages(result: AfdocsResult) {
  return (result.details?.pageResults ?? [])
    .filter((page) => page.status === "fail" || page.found === false)
    .map((page) => page.url)
    .filter((url): url is string => !!url)
    .slice(0, MAX_PAGES)
}

function getFailures(report: AfdocsReport): CheckFailure[] {
  return report.results
    .filter((result) => result.status === "fail")
    .map((result) => ({
      checkId: result.id,
      message: result.message,
      fix: report.scoring?.resolutions?.[result.id],
      pages: getFailingPages(result),
    }))
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

function buildDescription(failure: CheckFailure, scannedUrl: string) {
  return [
    `**Check:** [\`${failure.checkId}\`](https://afdocs.dev/checks/)`,
    `**Scanned:** ${scannedUrl}`,
    runUrl ? `**Workflow run:** ${runUrl}` : null,
    "",
    failure.message,
    failure.fix ? `\n**Fix:** ${failure.fix}` : null,
    failure.pages.length
      ? `\n**Affected pages (sample):**\n${failure.pages
          .map((page) => `- ${page}`)
          .join("\n")}`
      : null,
    "",
    "---",
    "_Automatically opened by the Agent-Friendly Docs Scan workflow (AFDocs)._",
  ]
    .filter((line) => line !== null)
    .join("\n")
}

function writeSummary(report: AfdocsReport, tickets: Ticket[]) {
  if (!process.env.GITHUB_STEP_SUMMARY) {
    return
  }
  const { pass, warn, fail } = report.summary
  const ticketLines = tickets.map(
    (ticket) =>
      `- \`${ticket.checkId}\`: [${ticket.identifier}](${ticket.url}) (${ticket.status})`
  )
  fs.appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      "## Agent-Friendly Docs Scan",
      "",
      "| URL | Score | Pass | Warn | Fail |",
      "| --- | --- | --- | --- | --- |",
      `| ${report.url} | ${report.scoring?.overall ?? "-"} (${
        report.scoring?.grade ?? "-"
      }) | ${pass} | ${warn} | ${fail} |`,
      "",
      ticketLines.length ? "### Linear tickets" : "No failing checks.",
      ...ticketLines,
      "",
    ].join("\n")
  )
}

async function main() {
  const reportFile = process.argv[2]
  if (!reportFile) {
    throw new Error("Usage: yarn report:agent-docs <report-file>")
  }

  const report = JSON.parse(
    fs.readFileSync(reportFile, "utf-8")
  ) as AfdocsReport
  const failures = getFailures(report)
  console.log(`Read AFDocs report for ${report.url} from ${reportFile}.`)
  const tickets: Ticket[] = []
  const errors: string[] = []

  if (failures.length) {
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

    for (const failure of failures) {
      const { checkId } = failure
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
          title: `${TITLE_PREFIX} ${checkId} failing`,
          description: buildDescription(failure, report.url),
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

  writeSummary(report, tickets)

  const created = tickets.filter((ticket) => ticket.status === "created")
  console.log(
    `\nDone. failing=${failures.length} created=${created.length} errors=${errors.length}`
  )
  if (errors.length) {
    throw new Error(`Failed checks: ${errors.join(", ")}`)
  }
}

void main().catch((err) => {
  console.error(err)
  process.exit(1)
})
