import { Command } from "commander"
import { registerAnalyzeCommand } from "./commands/analyze.js"
import { registerAnalyzeCloudCommand } from "./commands/analyze-cloud.js"

const program = new Command()

program
  .name("docs-automator")
  .description(
    "Analyzes package changes and builds documentation update context for Claude"
  )
  .version("0.0.1")

registerAnalyzeCommand(program)
registerAnalyzeCloudCommand(program)

program.parse(process.argv)
