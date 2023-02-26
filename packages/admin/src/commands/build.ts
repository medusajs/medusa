import { build as buildAdmin } from "@medusajs/admin-ui"
import ora from "ora"
import { EOL } from "os"
import { loadConfig } from "../utils"

type BuildArgs = {
  outDir?: string
  backend?: string
  path?: string
}

export default async function build(args: BuildArgs) {
  const { path, backend, outDir } = loadConfig()

  const time = Date.now()
  const spinner = ora().start(`Building Admin UI${EOL}`)

  await buildAdmin({
    build: {
      outDir: outDir,
    },
    globals: {
      base: path,
      backend: backend,
    },
  }).catch((err) => {
    spinner.fail(`Failed to build Admin UI${EOL}`)
    throw err
  })

  spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
}
