import loaders from "../loaders"
import express from "express"
import path from "path"
import { existsSync } from "fs"
import { logger } from "@medusajs/framework"
import { ExecArgs } from "@medusajs/types"

type Options = {
  file: string
  args: string[]
}

export default async function exec({ file, args }: Options) {
  logger.info(`Executing script at ${file}...`)
  const app = express()
  const directory = process.cwd()

  try {
    // check if the file exists
    const filePath = path.resolve(directory, file)
    if (!existsSync(filePath)) {
      throw new Error(`File ${filePath} doesn't exist.`)
    }

    const scriptToExec = (await import(path.resolve(filePath))).default

    if (!scriptToExec || typeof scriptToExec !== "function") {
      throw new Error(`File doesn't default export a function to execute.`)
    }

    // set worker mode
    process.env.MEDUSA_WORKER_MODE = "worker"

    const { container } = await loaders({
      directory,
      expressApp: app,
    })

    const scriptParams: ExecArgs = {
      container,
      args,
    }

    await scriptToExec(scriptParams)

    logger.info(`Finished executing script.`)

    process.exit()
  } catch (err) {
    logger.error("Error running script", err)
    process.exit(1)
  }
}
