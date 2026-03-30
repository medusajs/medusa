import { writeFileSync } from "fs"
import chalk from "chalk"
import { Command } from "commander"
import { ContextBuilder } from "../classes/context-builder.js"
import { DiffAnalyzer } from "../classes/diff-analyzer.js"
import { DocMapper } from "../classes/doc-mapper.js"
import { AnalyzeOptions } from "../types/index.js"

export function registerAnalyzeCommand(program: Command) {
  program
    .command("analyze")
    .description(
      "Analyze a commit's changes to packages/ and build documentation update context for Claude"
    )
    .requiredOption("--commit-sha <sha>", "The commit SHA to analyze")
    .option(
      "--output <path>",
      "Write the analysis JSON to this file path (default: stdout)"
    )
    .option("--dry-run", "Print analysis without writing output")
    .action(async (options: AnalyzeOptions) => {
      try {
        await runAnalyze(options)
      } catch (error) {
        console.error(chalk.red("Error during analysis:"), error)
        process.exit(1)
      }
    })
}

async function runAnalyze(options: AnalyzeOptions) {
  const { commitSha, output, dryRun } = options

  console.error(chalk.blue(`Analyzing commit: ${commitSha}`))

  const analyzer = new DiffAnalyzer()
  const changedPackages = await analyzer.analyze(commitSha)

  if (changedPackages.length === 0) {
    console.error(
      chalk.yellow("No doc-relevant package changes found in this commit.")
    )
    if (output) {
      writeFileSync(
        output,
        JSON.stringify(
          {
            changedPackages: [],
            affectedProjects: [],
            claudePrompt: "",
            triggerCommitSha: commitSha,
          },
          null,
          2
        )
      )
    }
    process.exit(2)
  }

  console.error(
    chalk.green(`Found ${changedPackages.length} changed package(s):`) +
      changedPackages.map((p) => `\n  - ${p.path} (${p.kind})`).join("")
  )

  const mapper = new DocMapper()
  const affectedProjects = mapper.map(changedPackages)

  console.error(
    chalk.green(`Affected doc projects:`) +
      affectedProjects.map((p) => `\n  - ${p.project}`).join("")
  )

  const builder = new ContextBuilder()
  const result = builder.build(changedPackages, affectedProjects, commitSha)

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
