import react from "@vitejs/plugin-react"
import { existsSync } from "fs"
import { dirname, resolve } from "path"
import { build } from "vite"
import { Logger } from "../../logger"

type ExternalBuildCommandOptions =
  | {
      outDir?: string
      force?: boolean
      base?: string
      backendUrl?: string
    }
  | undefined

const logger = new Logger("Build")

export async function buildUi(buildOptions?: ExternalBuildCommandOptions) {
  // const config = loadConfig()
  const adminDir = resolveAdminDir()

  if (!adminDir) {
    logger.error("Could not find @medusajs/admin-ui")
    return
  }

  let destinationPath: string = resolve(adminDir, "build")
  let apiUrl: string = "/"
  let baseOption: string | undefined = undefined

  if (buildOptions) {
    const { outDir, force, base, backendUrl } = buildOptions

    if (outDir) {
      const valid = validateOutDir(outDir)

      if (!valid && !force) {
        logger.error("Build directory already exists")
        return
      }

      destinationPath = outDir
    }

    if (base) {
      baseOption = base
    }

    if (backendUrl) {
      apiUrl = backendUrl
    }
  }

  await build({
    root: adminDir,
    plugins: [react()],
    define: defineEnv(apiUrl),
    base: baseOption,
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

function defineEnv(url: string) {
  return {
    __MEDUSA_BACKEND_URL__: JSON.stringify(url),
  }
}
