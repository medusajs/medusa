#!/usr/bin/env node
import { Command, Option } from "commander"
import generate from "./commands/generate.js"

const program = new Command()

program
  .name("workflows-diagram-generator")
  .description("Generate diagram(s) for workflow(s).")

program
  .command("run")
  .description(
    "Generate Mermaid.js diagrams for your workflows based on the type you choose."
  )
  .argument(
    "<workflowPath>",
    "The path to a workflow file or a directory of workflow files."
  )
  .requiredOption(
    "-o, --output <output>",
    "The directory to output the files in."
  )
  .addOption(
    new Option("-t, --type <type>", "Type of diagrams to be generated.")
      .choices(["docs", "markdown", "mermaid", "console", "svg", "png", "pdf"])
      .default("docs")
  )
  .option("--no-theme", "Remove theming from outputted diagrams.", true)
  .option(
    "--pretty-names",
    "Prettify step names. Useful for creating presentational diagrams.",
    false
  )
  .action(generate)

program.parse()
