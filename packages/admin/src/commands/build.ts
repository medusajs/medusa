import { build as buildAdmin } from "@medusajs/admin-ui"
import ora from "ora"
import { EOL } from "os"
import { loadConfig, reporter, validatePath } from "../utils"

type BuildArgs = {
  outDir?: string
  backend?: string
  path?: string
}

export default async function build(args: BuildArgs) {
  const { path, backend, outDir } = mergeArgs(args)

  try {
    validatePath(path)
  } catch (err) {
    reporter.panic(err)
  }

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
    reporter.panic(err)
  })

  spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
}

const mergeArgs = (args: BuildArgs) => {
  const { path, backend, outDir } = loadConfig()

  return {
    path: args.path || path,
    backend: args.backend || backend,
    outDir: args.outDir || outDir,
  }
}
