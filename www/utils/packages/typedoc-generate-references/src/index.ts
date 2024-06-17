#!/usr/bin/env node
import "dotenv/config"
import { Command } from "commander"
import generate from "./commands/generate.js"
import merge from "./commands/merge.js"

const program = new Command()

program
  .name("typedoc-generate-references")
  .description("Generate references for pre-defined typedoc configurations")

program
  .command("generate")
  .description("Generate specified references.")
  .argument(
    "<names...>",
    "The name(s) of the reference(s) to generate. Use `all` to generate all references"
  )
  .option("--merge", "Merge references after generating them.", false)
  .action(generate)

program
  .command("merge")
  .description(
    "Merge JSON references located in the `www/utils/generated/typedoc-json-output` directory."
  )
  .action(merge)

program.parse()
