import { build } from "@medusajs/admin-ui"
import fse from "fs-extra"
import ora from "ora"
import { EOL } from "os"
import { resolve } from "path"
import { loadConfig, reporter, validatePath } from "../utils"

export default async function setupAdmin() {
  const { path, backend, outDir } = loadConfig()

  try {
    validatePath(path)
  } catch (err) {
    reporter.panic(err)
  }

  let dir: string
  let shouldBuild = false

  if (outDir) {
    dir = resolve(process.cwd(), outDir)
  } else {
    const uiPath = require.resolve("@medusajs/admin-ui")
    dir = resolve(uiPath, "..", "..", "build")
  }

  try {
    await fse.ensureDir(dir)
  } catch (_e) {
    shouldBuild = true
  }

  const manifestPath = resolve(dir, "build-manifest.json")

  const buildOptions = {
    build: {
      outDir: outDir,
    },
    globals: {
      base: path,
      backend: backend,
    },
  }

  try {
    const manifest = await fse.readJSON(manifestPath)

    /**
     * If the manifest is not the same as the current build options,
     * we should rebuild the admin UI.
     */
    if (JSON.stringify(manifest) !== JSON.stringify(buildOptions)) {
      shouldBuild = true
    }
  } catch (_e) {
    /**
     * If the manifest file does not exist, we should rebuild the admin UI.
     * This is the case when the admin UI is built for the first time.
     */
    shouldBuild = true
  }

  if (shouldBuild) {
    const time = Date.now()
    const spinner = ora().start(
      `Admin build is out of sync with the current configuration. Rebuild initialized${EOL}`
    )

    await build({
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
}
