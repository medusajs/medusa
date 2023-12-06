#!/usr/bin/env node
import { program } from "commander"
import generate from "./commands/generate.js"

program
  .description("Generate React specs used for documentation purposes.")
  .requiredOption(
    "-s, --src <srcPath>",
    "Path to a file containing a React component or a directory of React components."
  )
  .requiredOption("-o, --output <outputPath>", "Path to the output directory.")
  .option(
    "--clean",
    "Clean the output directory before creating the new specs",
    false
  )
  .parse()

void generate(program.opts())
