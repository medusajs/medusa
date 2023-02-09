#! /usr/bin/env node

import execa from "execa"
import path from "path"
import { Command } from "commander"
import {
  commandDescription as OASCommandDescription,
  commandOptions as OASCommandOptions,
} from "./command-oas"

const basePath = path.resolve(__dirname, `./`)

const run = async () => {
  const program = new Command()

  // Alias entry for build-oas command
  program
    .command("oas")
    .description(OASCommandDescription)
    .action(async (options) => {
      await execBuildOAS(options)
    })
  for (const opt of OASCommandOptions) {
    program.addOption(opt)
  }

  program.parse(process.argv)
}

const execBuildOAS = async (options) => {
  const params: string[] = []
  for (const key in options) {
    params.push(`--${key}=${options[key]}`)
  }
  const { all: logs } = await execa.command(
    ["node", "build-oas.js", ...params].join(" "),
    {
      cwd: basePath,
      all: true,
    }
  )
  console.log(logs)
}

void (async () => {
  await run()
})()
