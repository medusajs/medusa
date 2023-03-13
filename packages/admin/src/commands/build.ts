import { build as buildAdmin } from "@medusajs/admin-ui"
import dotenv from "dotenv"
import fse from "fs-extra"
import ora from "ora"
import { EOL } from "os"
import { resolve } from "path"
import { loadConfig, reporter, validatePath } from "../utils"

type BuildArgs = {
  deployment?: boolean
  outDir?: string
  backend?: string
  include?: string[]
  includeDist?: string
}

export default async function build(args: BuildArgs) {
  let ENV_FILE_NAME = ""
  switch (process.env.NODE_ENV) {
    case "production":
      ENV_FILE_NAME = ".env.production"
      break
    case "staging":
      ENV_FILE_NAME = ".env.staging"
      break
    case "test":
      ENV_FILE_NAME = ".env.test"
      break
    case "development":
    default:
      ENV_FILE_NAME = ".env"
      break
  }

  try {
    dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME })
  } catch (e) {
    reporter.warn(`Failed to load environment variables from ${ENV_FILE_NAME}`)
  }

  const { deployment, outDir: outDirArg, backend, include, includeDist } = args

  let path: string | undefined = undefined

  /**
   * If no outDir is provided we default to "build".
   */
  let outDir: string | undefined = outDirArg || "build"

  /**
   * If we are not building the admin UI with the intention of deploying
   * it to a external host, we load the plugin configuration and use the
   * path and outDir specified there.
   */
  if (!deployment) {
    const config = loadConfig()

    try {
      validatePath(config.path)
      path = config.path
    } catch (err) {
      reporter.panic(err)
    }

    if (!outDir) {
      outDir = config.outDir
    }
  }

  const time = Date.now()
  const spinner = ora().start(`Building Admin UI${EOL}`)

  /**
   * If a backend URL is provided we use that. If no URL is provided
   * we default to the environment variable MEDUSA_BACKEND_URL.
   */
  const serverUrl = backend || process.env.MEDUSA_BACKEND_URL

  if (!serverUrl) {
    throw new Error("Server URL is not defined: " + serverUrl)
  }

  await buildAdmin({
    build: {
      outDir,
    },
    globals: {
      base: path,
      backend: serverUrl,
    },
  }).catch((err) => {
    spinner.fail(`Failed to build Admin UI${EOL}`)
    reporter.panic(err)
  })

  /**
   * If we have specified files to include in the build, we copy them
   * to the build directory.
   */
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
