#!/usr/bin/env node

import os from "os"
import util from "util"
import createCli from "./create-cli"

const useJsonLogger = process.argv.slice(2).some((arg) => arg.includes(`json`))

if (useJsonLogger) {
  process.env.GATSBY_LOGGER = `json`
}

// Ensure stable runs on Windows when started from different shells (i.e. c:\dir vs C:\dir)
if (os.platform() === `win32`) {
  // ensureWindowsDriveLetterIsUppercase()
}

// Logging to a closed stdout/stderr throws again, re-entering these handlers forever
const isBrokenPipeError = (error: unknown) =>
  [`EPIPE`, `ERR_STREAM_DESTROYED`].includes((error as any)?.code)

process.on(`unhandledRejection`, (reason) => {
  if (isBrokenPipeError(reason)) {
    return process.exit(1)
  }

  // This will exit the process in newer Node anyway so lets be consistent
  // across versions and crash

  // reason can be anything, it can be a message, an object, ANYTHING!
  // we convert it to an error object, so we don't crash on structured error validation
  if (!(reason instanceof Error)) {
    reason = new Error(util.format(reason))
  }

  console.log(reason)
  // report.panic(`UNHANDLED REJECTION`, reason as Error)
})

process.on(`uncaughtException`, (error) => {
  if (isBrokenPipeError(error)) {
    return process.exit(1)
  }

  console.log(error)
  // report.panic(`UNHANDLED EXCEPTION`, error)
})

createCli(process.argv)
