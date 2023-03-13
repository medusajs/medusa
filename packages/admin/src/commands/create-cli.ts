import { Command } from "commander"
import build from "./build"
import eject from "./eject"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")

  // Options for building the dashboard with default values depending on how the dashboard will be exposed.
  buildCommand.option(
    "--deployment",
    "Build for deploying to and external host (e.g. Vercel)"
  )
  buildCommand.option("--server", "Build for serving on server")

  buildCommand.option("-s, --serve", "Serve the dashboard")
  buildCommand.option("-p, --path <path>", "Base path")
  buildCommand.option("-o, --out-dir <path>", "Output directory")
  buildCommand.option("-a, --auto-rebuild", "Auto rebuild on changes")
  buildCommand.option("-b, --backend <url>", "Backend URL")
  buildCommand.option(
    "-i, --include [paths...]]",
    "Paths to files that should be included in the build"
  )
  buildCommand.option(
    "-d, --include-dist <path>",
    "Path to where the files specified in the include option should be placed. Relative to the root of the build directory."
  )

  buildCommand.action(build)

  const deployCommand = program.command("eject")
  deployCommand.description(
    "Eject the admin dashboard source code to a custom directory"
  )
  deployCommand.option("-o, --out-dir <path>", "Output directory")
  deployCommand.action(eject)

  return program
}
