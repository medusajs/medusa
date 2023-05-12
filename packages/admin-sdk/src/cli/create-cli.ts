import { Command } from "commander"
import { build } from "../lib/build"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")
  buildCommand.option("-w, --watch", "Watch for changes")
  buildCommand.option("-m, --minify", "Minify the output")
  buildCommand.action(build)

  return program
}
