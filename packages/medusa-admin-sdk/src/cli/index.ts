import { Command } from "commander"
import build, { questionary } from "./commands/build"

const program = new Command()

program
  .command("build")
  .description("Builds the Admin UI")
  .option("-e, --ext", "Build for external backend")
  // .option("-c, --config <path>", "Path to config file")
  // .option("-o, --outDir <path>", "Output directory")
  // .option("-f, --force", "Force build")
  .action(async ({ ext }) => {
    if (ext) {
      return questionary()
    }

    return await build({ ext })
  })

program.parse()
