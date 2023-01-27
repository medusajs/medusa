import { Command } from "commander"
import build from "./build"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")
  buildCommand.option("-o, --out-dir <path>", "Output directory")
  buildCommand.option("-b, --backend <url>", "Backend URL")
  buildCommand.option("-p, --path <path>", "Base path")
  buildCommand.action(build)

  return program
}
