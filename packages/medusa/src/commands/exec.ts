import loaders from "../loaders"
import express from "express"
import path from "path"
import logger from "../loaders/logger"

type Options = {
  file: string
  args: string[]
}

export default async function script({ file, args }: Options) {
  logger.info(`Executing script at ${file}...`)
  const app = express()
  const directory = process.cwd()

  try {
    // set worker mode
    process.env.MEDUSA_WORKER_MODE = "worker"

    const { container } = await loaders({
      directory,
      expressApp: app,
    })

    const scriptFile = (await import(path.resolve(directory, file))).default

    await scriptFile(container, args)

    logger.info(`Finished executing script.`)

    process.exit()
  } catch (err) {
    logger.error("Error running script", err)
    process.exit(1)
  }
}
