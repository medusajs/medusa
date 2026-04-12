#!/usr/bin/env node
import { Command } from "commander"
import { generateCommand } from "./commands/generate"
import { validateCommand } from "./commands/validate"

const program = new Command()

program
  .name("medusa-http-types")
  .description(
    "Generate and validate HTTP TypeScript types from Zod validator schemas.\n\n" +
      "Use `generate` to create TypeScript interfaces from Zod schemas, and\n" +
      "`validate` to check that existing interfaces match their Zod schemas."
  )
  .version("0.0.1")

program.addCommand(generateCommand())
program.addCommand(validateCommand())

program.parseAsync(process.argv).catch((err) => {
  console.error(err)
  process.exit(1)
})
