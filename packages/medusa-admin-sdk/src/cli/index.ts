import { Command } from "commander"
import build from "./commands/build"

const program = new Command()

program
  .command("build")
  .description("Builds the Admin UI")
  .option("-e, --ext", "Build for external backend")
  .option("-o, --outDir <path>", "Output directory")
  .option("-f, --force", "Force build")
  .action(async ({ ext, outDir, force }) => await build({ ext, outDir, force }))

program.parse()
