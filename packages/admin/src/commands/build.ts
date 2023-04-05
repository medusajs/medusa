import { AdminBuildConfig, build as buildAdmin } from "@medusajs/admin-ui"
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

export default async function build(args: BuildArgs) {
  const { deployment, outDir: outDirArg, backend, include, includeDist } = args

  let config: AdminBuildConfig = {}

  if (deployment) {
    config = {
      build: {
        outDir: outDirArg,
      },
      globals: {
        backend: backend || process.env.MEDUSA_BACKEND_URL,
      },
    }
  } else {
    const { path, outDir } = loadConfig()

    try {
      validatePath(path)
    } catch (err) {
      reporter.panic(err)
    }

    config = {
      build: {
        outDir: outDir,
      },
      globals: {
        base: path,
      },
    }
  }

  const time = Date.now()
  const spinner = ora().start(`Building Admin UI${EOL}`)

  await buildAdmin({
    ...config,
  }).catch((err) => {
    spinner.fail(`Failed to build Admin UI${EOL}`)
    reporter.panic(err)
  })

  /**
   * If we have specified files to include in the build, we copy them
   * to the build directory.
   */
  if (include && include.length > 0) {
    const dist = outDirArg || resolve(process.cwd(), "build")

    try {
      for (const filePath of include) {
        await fse.copy(filePath, resolve(dist, includeDist, filePath))
      }
    } catch (err) {
      reporter.panic(err)
    }
  }

  spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
}
