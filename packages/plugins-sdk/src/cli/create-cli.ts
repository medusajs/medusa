import { Command } from "commander"

const pkg = require("../../package.json")

const program = new Command()

program.name("@medusajs/plugin-sdk")
program.version(pkg.version, "-v, --version")

program.command("create").description("Create a new plugin")

program.command("add").description("Add a new extension to a existing plugin")

program
  .command("build")
  .description("Build a plugin")
  .option("-w, --watch", "Watch for changes and rebuild")
