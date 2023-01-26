import { Command } from "commander"
import build from "./build"

export async function createCli(): Promise<Command> {
  const program = new Command()

  const buildCommand = program.command("build")
  buildCommand.action(build)

  return program
}
