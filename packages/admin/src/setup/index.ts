import { build } from "@medusajs/admin-ui"
import fse from "fs-extra"
import ora from "ora"
import { EOL } from "os"
import { resolve } from "path"
import { loadConfig } from "../utils"

export default async function setupAdmin() {
  const { path, backend, outDir } = loadConfig()

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

  try {
    const manifest = await fse.readJSON(manifestPath)

    if (
      manifest.base !== path ||
      (manifest.buildDir && manifest.buildDir !== outDir)
    ) {
      shouldBuild = true
    }
  } catch (_e) {
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
      throw err
    })

    spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
  }
}
