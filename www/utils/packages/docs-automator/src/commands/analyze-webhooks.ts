import { readFileSync, writeFileSync } from "fs"
import chalk from "chalk"
import { Command } from "commander"
import { WebhooksContextBuilder } from "../classes/webhooks-context-builder.js"
import {
  AnalyzeWebhooksOptions,
  WebhooksDispatchPayload,
} from "../types/index.js"

export function registerAnalyzeWebhooksCommand(program: Command) {
  program
    .command("analyze-webhooks")
    .description(
      "Build a documentation update prompt for Claude from a Cloud webhooks dispatch payload"
    )
    .requiredOption(
      "--dispatch-file <path>",
      "Path to JSON file containing the WebhooksDispatchPayload"
    )
    .option(
      "--output <path>",
      "Write the analysis JSON to this file path (default: stdout)"
    )
    .option("--dry-run", "Print prompt preview without writing output")
    .action(async (options: AnalyzeWebhooksOptions) => {
      try {
        await runAnalyzeWebhooks(options)
      } catch (error) {
        console.error(chalk.red("Error during webhooks analysis:"), error)
        process.exit(1)
      }
    })
}

async function runAnalyzeWebhooks(options: AnalyzeWebhooksOptions) {
  const { dispatchFile, output, dryRun } = options

  console.error(chalk.blue(`Reading dispatch payload from: ${dispatchFile}`))

  const raw = readFileSync(dispatchFile, "utf8")
  const payload: WebhooksDispatchPayload = JSON.parse(raw)

  const events = payload.webhooks ?? []
  const hasDescriptions = !!payload.descriptions?.trim()

  if (!events.length && !hasDescriptions) {
    console.error(chalk.yellow("No webhook changes found in dispatch payload."))
    if (output) {
      writeFileSync(
        output,
        JSON.stringify(
          {
            affectedProjects: [],
            claudePrompt: "",
            featureFlaggedFeatures: [],
            changelogDate: "",
            changeSummary: [],
          },
          null,
          2
        )
      )
    }
    process.exit(2)
  }

  const invalid = events.filter((event) => !event.event || !event.changeType)
  if (invalid.length) {
    throw new Error(
      `Every webhook entry must have an \`event\` and a \`changeType\`. Invalid entries: ${JSON.stringify(invalid)}`
    )
  }

  console.log(chalk.green(`Building webhooks docs prompt`))

  const builder = new WebhooksContextBuilder()
  // The automation runs right after the deployment, so today's date is the
  // release date unless the payload says otherwise.
  const result = builder.build(payload, new Date())

  if (dryRun) {
    console.log(chalk.cyan("Dry run — prompt preview:"))
    console.log(result.claudePrompt)
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
