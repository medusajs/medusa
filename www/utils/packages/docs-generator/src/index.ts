#!/usr/bin/env node
import "dotenv/config"
import { Command, Option } from "commander"
import run from "./commands/run.js"
import runGitChanges from "./commands/run-git-changes.js"
import runGitCommit from "./commands/run-git-commit.js"
import runRelease from "./commands/run-release.js"
import cleanOas from "./commands/clean-oas.js"
import cleanDml from "./commands/clean-dml.js"

const program = new Command()

program.name("docblock-generator").description("Generate TSDoc doc-blocks")

// define common options
const typeOption = new Option("--type <type>", "The type of docs to generate.")
  .choices(["all", "docs", "oas", "dml"])
  .default("all")

const generateExamplesOption = new Option(
  "--generate-examples",
  "Whether to generate examples"
).default(false)

program
  .command("run")
  .description("Generate TSDoc doc-blocks for specified files.")
  .argument("<files...>", "One or more TypeScript file or directory paths.")
  .option(
    "--dry-run",
    "Whether to run the command without writing the changes."
  )
  .addOption(typeOption)
  .addOption(generateExamplesOption)
  .action(run)

program
  .command("run:changes")
  .description("Generate TSDoc doc-blocks for changed files in git.")
  .addOption(typeOption)
  .addOption(generateExamplesOption)
  .action(runGitChanges)

program
  .command("run:commit")
  .description("Generate TSDoc doc-blocks for changed files in a commit.")
  .argument("<commitSha>", "The SHA of a commit.")
  .addOption(typeOption)
  .addOption(generateExamplesOption)
  .action(runGitCommit)

program
  .command("run:release")
  .description(
    "Generate TSDoc doc-blocks for files part of the latest release. It will retrieve the files of commits between the latest two releases."
  )
  .addOption(typeOption)
  .addOption(generateExamplesOption)
  .option(
    "--tag <tag>",
    "Specify a release tag to use rather than the latest release."
  )
  .action(runRelease)

program
  .command("clean:oas")
  .description(
    "Check generated OAS under the `oas-output/operations` directory and remove any OAS that no longer exists."
  )
  .action(cleanOas)

program
  .command("clean:dml")
  .description(
    "Check generated DML files under the `dml-output` directory and remove any data models that no longer exists."
  )
  .action(cleanDml)

program.parse()
