#!/usr/bin/env node
import { program } from "commander"
import generate from "./commands/generate.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  .option(
    "--tsconfigPath <tsconfigPath>",
    "Path to TSConfig file.",
    path.join(__dirname, "..", "..", "typedoc-config", "ui.json")
  )
  .option("--disable-typedoc", "Whether to disable Typedoc", false)
  .option("--verbose-typedoc", "Whether to show Typedoc logs.", false)
  .parse()

void generate(program.opts())
