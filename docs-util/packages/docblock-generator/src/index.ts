#!/usr/bin/env node
import "dotenv/config"
import { Command } from "commander"
import run from "./commands/run.js"
import runGitChanges from "./commands/run-git-changes.js"
import runGitCommit from "./commands/run-git-commit.js"
import runRelease from "./commands/run-release.js"

const program = new Command()

program.name("docblock-generator").description("Generate TSDoc doc-blocks")

program
  .command("run")
  .description("Generate TSDoc doc-blocks for specified files.")
  .argument("<files...>", "One or more TypeScript file or directory paths.")
  .option(
    "--dry-run",
    "Whether to run the command without writing the changes."
  )
  .action(run)

program
  .command("run:changes")
  .description("Generate TSDoc doc-blocks for changed files in git.")
  .action(runGitChanges)

program
  .command("run:commit")
  .description("Generate TSDoc doc-blocks for changed files in a commit.")
  .argument("<commitSha>", "The SHA of a commit.")
  .action(runGitCommit)

program
  .command("run:release")
  .description(
    "Generate TSDoc doc-blocks for files part of the latest release. It will retrieve the files of commits between the latest two releases."
  )
  .option(
    "--tag <tag>",
    "Specify a release tag to use rather than the latest release."
  )
  .action(runRelease)

program.parse()
