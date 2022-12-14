import react from "@vitejs/plugin-react"
import { existsSync } from "fs"
import inquirer from "inquirer"
import { dirname, resolve } from "path"
import { build } from "vite"
import { Logger } from "../../logger"
import { AdminPluginOptions } from "../../types"
import { loadConfig } from "../../utils"

type BuildCommandOptions = {
  ext?: boolean
  outDir?: string
  force?: boolean
}

const logger = new Logger("Build")

export default async function buildUi({
  ext = false,
  outDir,
  force = false,
}: BuildCommandOptions) {
  const config = loadConfig()
  const adminDir = resolveAdminDir()

  let destinationPath: string

  if (ext && !outDir) {
    logger.error(
      `Output directory is required when building for external backend using the --ext flag. To build for external backend,
       use the --ext flag and specify an output directory using the --outDir flag.`
    )
    return
  }

  if (ext && !config.backend_url) {
    logger.error(
      `The plugin option 'backend_url' is required when building for external use with an external backend using the --ext flag.`
    )
    return
  }

  if (outDir) {
    const valid = validateOutDir(outDir)

    if (!valid && !force) {
      logger.error("Build directory already exists")
      return
    }

    destinationPath = outDir
  } else {
    destinationPath = resolve(adminDir, "build")
  }

  await build({
    root: adminDir,
    plugins: [react()],
    define: defineEnv(config),
    build: {
      outDir: destinationPath,
      emptyOutDir: true,
    },
  }).then(() => {
    logger.success("Build complete")
  })
}

function resolveAdminDir() {
  try {
    const adminPath = require.resolve("@medusajs/admin-ui")
    return dirname(adminPath)
  } catch (_err) {
    return null
  }
}

function validateOutDir(destinationPath: string) {
  const fullPath = resolve(process.cwd(), destinationPath, "build")
  const exists = existsSync(fullPath)

  if (exists) {
    return false
  }

  return true
}

function defineEnv({
  serve,
  backend_url,
}: Pick<AdminPluginOptions, "serve" | "backend_url">) {
  let url = "/"

  if (!serve) {
    url = backend_url
  }

  return {
    __MEDUSA_BACKEND_URL__: JSON.stringify(url),
  }
}

export function questionary() {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "backend_url",
        message: "Please enter the backend url",
        validate: (input: string) => {},
      },
    ])
    .then(async (answers) => {
      console.log(answers)
    })
}
