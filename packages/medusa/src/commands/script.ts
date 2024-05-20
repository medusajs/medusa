import loaders from "../loaders"
import express from "express"
import path from "path"

type Options = {
  file: string
}

export default async function script({ file }: Options) {
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

    await scriptFile(container)
    process.exit()
  } catch (err) {
    console.error("Error running script", err)
    process.exit(1)
  }
}
