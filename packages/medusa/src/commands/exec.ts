import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  dynamicImport,
  isFileSkipped,
} from "@medusajs/framework/utils"
import express from "express"
import { existsSync } from "fs"
import path from "path"
import loaders, { initializeContainer } from "../loaders"

type Options = {
  file: string
  args: string[]
}

export default async function exec({ file, args }: Options) {
  process.env.MEDUSA_WORKER_MODE = "server"

  const container = await initializeContainer(process.cwd(), {
    skipDbConnection: true,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info(`Executing script at ${file}...`)
  const app = express()
  const directory = process.cwd()

  try {
    // check if the file exists
    const filePath = path.resolve(directory, file)
    if (!existsSync(filePath)) {
      throw new Error(`File ${filePath} doesn't exist.`)
    }

    const scriptToExec = (await dynamicImport(path.resolve(filePath))).default

    if (isFileSkipped(scriptToExec)) {
      throw new Error(`File is disabled.`)
    }

    if (!scriptToExec || typeof scriptToExec !== "function") {
      throw new Error(`File doesn't default export a function to execute.`)
    }

    const { container } = await loaders({
      directory,
      expressApp: app,
      skipLoadingEntryPoints: true,
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
