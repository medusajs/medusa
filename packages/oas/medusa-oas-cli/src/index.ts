#! /usr/bin/env node

import { Command } from "commander"
import { getCommand as oasGetCommand } from "./command-oas"

const run = async () => {
  const program = new Command()

  /**
   * Alias to command-oas.ts
   */
  program.addCommand(oasGetCommand())

  /**
   * Run CLI
   */
  await program.parseAsync()
}

void (async () => {
  await run()
})()
