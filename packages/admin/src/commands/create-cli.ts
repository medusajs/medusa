import { Command } from "commander"
import build from "./build"
import { bundle } from "./bundle"
import develop from "./develop"

export async function createCli(): Promise<Command> {
  const program = new Command()

  program
    .command("bundle")
    .description("Bundle extensions to the admin dashboard")
    .action(bundle)

  program
    .command("develop")
    .description("Start the admin dashboard in development mode")
    .option("--port <port>", "Port to run the admin dashboard on", "7001")
    .option("--path <path>", "Public path to serve the admin dashboard on", "/")
    .option(
      "--backend <url>",
      "URL to the Medusa backend",
      "http://localhost:9000"
    )
    .action(develop)

  program
    .command("build")
    .description("Build the admin dashboard for production")
    .option("--path <path>", "Public path to serve the admin dashboard on")
    .option("--backend <url>", "URL to the Medusa backend")
    .action(build)

  return program
}
