import { Command } from "commander"
import { buildUi } from "./commands/build"
import { exportUi } from "./commands/export"

const program = new Command()

program
  .command("build")
  .description("Builds the Admin UI")
  .action(async () => {
    return await buildUi()
  })

program.command("export").description("Exports the Admin UI").action(exportUi)

program.parse()
