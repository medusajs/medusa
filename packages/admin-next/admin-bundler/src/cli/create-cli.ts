import { Command } from "commander"

import { build } from "../api/build"
import { bundle } from "../api/bundle"
import { dev } from "../api/dev"

export async function createCli() {
  const program = new Command()

  program.name("medusa-admin")

  program
    .command("dev")
    .description("Starts the development server")
    .action(dev)

  program
    .command("build")
    .description("Builds the admin dashboard")
    .action(build)

  program
    .command("bundle")
    .description("Bundles the admin dashboard")
    .action(bundle)

  return program
}
