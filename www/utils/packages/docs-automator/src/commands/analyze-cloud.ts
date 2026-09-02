import { readFileSync, writeFileSync } from "fs"
import chalk from "chalk"
import { Command } from "commander"
import { CloudContextBuilder } from "../classes/cloud-context-builder.js"
import { AnalyzeCloudOptions, CloudDispatchPayload } from "../types/index.js"

export function registerAnalyzeCloudCommand(program: Command) {
  program
    .command("analyze-cloud")
    .description(
      "Build a documentation update prompt for Claude from a cloud deployment dispatch payload"
    )
    .requiredOption(
      "--dispatch-file <path>",
      "Path to JSON file containing the CloudDispatchPayload"
    )
    .option(
      "--output <path>",
      "Write the analysis JSON to this file path (default: stdout)"
    )
    .option("--dry-run", "Print prompt preview without writing output")
    .action(async (options: AnalyzeCloudOptions) => {
      try {
        await runAnalyzeCloud(options)
      } catch (error) {
        console.error(chalk.red("Error during cloud analysis:"), error)
        process.exit(1)
      }
    })
}

async function runAnalyzeCloud(options: AnalyzeCloudOptions) {
  const { dispatchFile, output, dryRun } = options

  console.error(chalk.blue(`Reading dispatch payload from: ${dispatchFile}`))

  const raw = readFileSync(dispatchFile, "utf8")
  const payload: CloudDispatchPayload = JSON.parse(raw)

  const hasDescriptions = !!payload.descriptions?.trim()
  const hasChangelog = !!payload.releaseNotes?.trim() && !!payload.version

  if (!hasDescriptions && !hasChangelog) {
    console.error(
      chalk.yellow(
        "No feature descriptions or changelog found in dispatch payload."
      )
    )
    if (output) {
      writeFileSync(
        output,
        JSON.stringify(
          {
            affectedProjects: [],
            claudePrompt: "",
            featureFlaggedFeatures: [],
          },
          null,
          2
        )
      )
    }
    process.exit(2)
  }

  if (payload.releaseNotes?.trim() && !payload.version) {
    console.error(
      chalk.yellow(
        "Release notes present but no version provided — skipping changelog step."
      )
    )
  }

  console.log(chalk.green(`Building cloud docs prompt`))

  // The automation runs right after a deployment, so the current date is the
  // release date shown alongside the version in the changelog.
  const now = new Date()
  const releaseDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
  // The dashboard changelog stores each date as a `YYYY-MM-DD.mjs` entry file,
  // so the same date is also needed in ISO form.
  const isoReleaseDate = now.toISOString().split("T")[0]

  const builder = new CloudContextBuilder()
  const result = builder.build(payload, releaseDate, isoReleaseDate)

  if (dryRun) {
    console.log(chalk.cyan("Dry run — prompt preview:"))
    console.log(result.claudePrompt.slice(0, 500) + "...")
    return
  }

  const json = JSON.stringify(result, null, 2)

  if (output) {
    writeFileSync(output, json)
    console.log(chalk.green(`Analysis written to: ${output}`))
  } else {
    process.stdout.write(json)
  }
}
