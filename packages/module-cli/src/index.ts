#!/usr/bin/env node
import { program } from "commander"
import ora from "ora"
import { migrateModules } from "./actions/migrate.js"
import { createNewModule } from "./actions/new.js"

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

  program
    .description("Run or revert the modules migrations")
    .command("migrate")
    .argument(
      "[module-paths...]",
      "Specify the modules for which to run the migrations for. If not specified, all modules installed will be listed and selectable."
    )
    .option("-r, --revert", "Revert the last migrations", false)
    .action(migrateModules)

  program.parse()
} finally {
  spinner.stop()
}
