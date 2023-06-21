#!/usr/bin/env node
import { program } from "commander"
import { createNewModule } from "./actions/new.js"
import ora from "ora"

export const spinner = ora().start()

try {
  program
    .name("medusa-module")
    .description("CLI to generate modules for Medusa")

  program
    .description("Create a new Medusa module")
    .command("new")
    .argument("<module-name>", "The name of the module")
    .option(
      "-p, --path <path>",
      "The path to create the module in",
      process.cwd()
    )
    .action(createNewModule)

  program.parse()
} finally {
  spinner.stop()
}
