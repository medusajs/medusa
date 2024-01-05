#!/usr/bin/env node
import path from "path"
import fs from "fs"
import { exec } from "child_process"
import { globSync } from "glob"
import randomColor from "randomcolor"
import chalk, { ChalkInstance } from "chalk"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const referenceNames = process.argv.slice(2) || ["all"]
const basePath = path.join(require.resolve("typedoc-config"), "..")
let generatedCount = 0
let totalCount = referenceNames.length
let ranMerger = false

if (!referenceNames.length) {
  console.error(
    chalk.red(
      "No reference names specified. Please specify the name of a reference to generate, or use `all` to generate all references."
    )
  )
  process.exit(1)
}

referenceNames.forEach((name) => {
  if (name === "all") {
    // generate reference for all configration files in
    // `typedoc-config` directory, except for files starting
    // with `_`
    const files = globSync("[^_]**.js", {
      cwd: basePath,
    })
    totalCount = files.length
    files.forEach((file) => generateReference(file))
  } else if (name === "merge") {
    runMerger()
  } else {
    generateReference(`${name}.js`)
  }
})

export function generateReference(referenceName: string) {
  const configPathName = path.join(basePath, referenceName)

  // check if the config file exists
  if (!fs.existsSync(configPathName)) {
    console.log(
      chalk.red(
        `Config file for ${referenceName} doesn't exist. Make sure to create it in ${configPathName}`
      )
    )
    return
  }

  const colorLog = chalk.hex(randomColor())
  formatColoredLog(colorLog, referenceName, "Generating reference...")
  const typedocProcess = exec(`typedoc --options ${configPathName}`)
  typedocProcess.stdout?.on("data", (chunk: string) => {
    formatColoredLog(colorLog, referenceName, chunk.trim())
  })
  typedocProcess.on("exit", (code) => {
    generatedCount++
    if (generatedCount >= totalCount && !ranMerger && code !== 1) {
      runMerger()
    }
  })
  typedocProcess.stderr?.on("data", (chunk: string) => {
    // split multiline outputs
    const split: string[] = chunk.split("\n")
    split.forEach((line: string) => {
      if (!line.length) {
        return
      }

      formatColoredLog(
        colorLog,
        referenceName,
        `${chalk.red("An error occurred")}: ${line.trim()}`
      )
    })
  })
  formatColoredLog(colorLog, referenceName, "Finished Generating reference.")
}

function formatColoredLog(
  chalkInstance: ChalkInstance,
  title: string,
  message: string
) {
  console.log(`${chalkInstance(title)} -> ${message}`)
}

function runMerger() {
  // run merger
  console.log(chalk.bgBlueBright("\n\nRunning Merger\n\n"))
  ranMerger = true
  generateReference("_merger.js")
}
