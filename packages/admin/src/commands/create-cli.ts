import { Command } from "commander"
import build from "./build"
import deploy from "./deploy"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")
  buildCommand.option("-o, --out-dir <path>", "Output directory")
  buildCommand.option("-b, --backend <url>", "Backend URL")
  buildCommand.option("-p, --path <path>", "Base path")
  buildCommand.action(build)

  const deployCommand = program.command("deploy")
  deployCommand.description("Deploy the admin dashboard")
  deployCommand.action(deploy)

  return program
}
