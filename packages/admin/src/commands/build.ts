import { build as buildAdmin } from "@medusajs/admin-ui"
import fse from "fs-extra"
import ora from "ora"
import { EOL } from "os"
import { resolve } from "path"
import { PluginOptions } from "../types"
import { loadConfig, reporter, validatePath } from "../utils"

type BuildArgs = {
  outDir?: string
  backend?: string
  path?: string
  include?: string[]
  includeDist?: string
}

export default async function build(args: BuildArgs) {
  const {
    path,
    backend,
    buildDir: outDir,
    include,
    includeDist,
  } = mergeArgs(args)

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

  if (include && include.length > 0) {
    if (!outDir) {
      reporter.warn(
        "You have specified files to include in the build, but no output directory. The files will not be included in the build."
      )
    } else {
      try {
        for (const filePath of include) {
          await fse.copy(filePath, resolve(outDir, includeDist, filePath))
        }
      } catch (err) {
        reporter.panic(err)
      }
    }
  }

  spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
}

const mergeArgs = (args: BuildArgs): PluginOptions => {
  const { path, backend, buildDir: outDir, include, includeDist } = loadConfig()

  return {
    path: args.path || path,
    backend: args.backend || backend,
    buildDir: args.outDir || outDir,
    include: args.include || include,
    includeDist: args.includeDist || includeDist,
  }
}
