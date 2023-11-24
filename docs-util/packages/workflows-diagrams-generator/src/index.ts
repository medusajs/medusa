import { Command, Option } from "commander"
import generate from "./commands/generate.js"

const program = new Command()

program
  .name("workflows-diagram-generator")
  .description("Generate diagram(s) for workflow(s).")

program
  .command("generate")
  .description(
    "Generate Mermaid.js diagrams for your workflows based on the type you choose."
  )
  .argument(
    "<workflowPath>",
    "The path to a workflow file or a directory of workflow files."
  )
  .requiredOption("-o, --output", "The directory to output the files in.")
  .addOption(
    new Option(
      "-t, --type",
      "Type of diagrams to be generated. `docs` generate spec directories having diagrams with associated code. `markdown` prints all diagrams in a single markdown file. `mermaid` prints each diagram in a file having `.mermaid` extension."
    )
      .choices(
        // TODO remove other options if haven't added in time
        ["docs", "markdown", "mermaid"]
      )
      .default("docs")
  )
  .action(generate)

program.parse()
