import { Command } from "commander"
import build from "./build"
import dev from "./dev"
import eject from "./eject"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.description("Build the admin dashboard")

  buildCommand.option(
    "--deployment",
    "Build for deploying to and external host (e.g. Vercel)"
  )

  buildCommand.option("-o, --out-dir <path>", "Output directory")
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

  const devCommand = program.command("dev")
  devCommand.description("Start the admin dashboard in development mode")
  devCommand.option("-p, --port <port>", "Port (default: 7001))")
  devCommand.option(
    "-b, --backend <url>",
    "Backend URL (default http://localhost:9000)"
  )
  devCommand.action(dev)

  const deployCommand = program.command("eject")
  deployCommand.description(
    "Eject the admin dashboard source code to a custom directory"
  )
  deployCommand.option("-o, --out-dir <path>", "Output directory")
  deployCommand.action(eject)

  return program
}
