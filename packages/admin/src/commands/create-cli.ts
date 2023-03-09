import { Command } from "commander"
import build from "./build"
import eject from "./eject"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")
  buildCommand.option("-o, --out-dir <path>", "Output directory")
  buildCommand.option("-b, --backend <url>", "Backend URL")
  buildCommand.option("-p, --path <path>", "Base path")
  buildCommand.option(
    "-i, --include [paths...]]",
    "Paths to files that should be included in the build"
  )
  buildCommand.action(build)

  const deployCommand = program.command("eject")
  deployCommand.description(
    "Eject the admin dashboard to a path of your choosing"
  )
  deployCommand.option("-o, --out-dir <path>", "Output directory")
  deployCommand.action(eject)

  return program
}
