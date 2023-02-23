#! /usr/bin/env node

import { Command } from "commander"
import { getCommand as oasGetCommand } from "./command-oas"
import { getCommand as clientGetCommand } from "./command-client"

const run = async () => {
  const program = new Command()

  /**
   * Alias to command-oas.ts
   */
  program.addCommand(oasGetCommand())

  /**
   * Alias to command-client.ts
   */
  program.addCommand(clientGetCommand())

  /**
   * Run CLI
   */
  await program.parseAsync()
}

void (async () => {
  await run()
})()
