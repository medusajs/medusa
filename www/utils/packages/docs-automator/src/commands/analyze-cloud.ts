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

  if (!payload.descriptions || payload.descriptions.trim().length === 0) {
    console.error(
      chalk.yellow("No feature descriptions found in dispatch payload.")
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

  console.error(chalk.green(`Building cloud docs prompt`))

  const builder = new CloudContextBuilder()
  const result = builder.build(payload)

  if (dryRun) {
    console.error(chalk.cyan("Dry run — prompt preview:"))
    console.error(result.claudePrompt.slice(0, 500) + "...")
    return
  }

  const json = JSON.stringify(result, null, 2)

  if (output) {
    writeFileSync(output, json)
    console.error(chalk.green(`Analysis written to: ${output}`))
  } else {
    process.stdout.write(json)
  }
}
