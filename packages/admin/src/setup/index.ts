import { build } from "@medusajs/admin-ui"
import fse from "fs-extra"
import ora from "ora"
import { EOL } from "os"
import { resolve } from "path"
import { loadConfig, reporter, validatePath } from "../utils"

export default async function setupAdmin() {
  const { path, outDir, serve, autoRebuild } = loadConfig()

  // If the user has not specified that the admin UI should be served,
  // we should not build it. Furthermore, if the user has not specified that they want
  // the admin UI to be rebuilt on changes, we should not build it here.
  if (!serve || !autoRebuild) {
    return
  }

  try {
    validatePath(path)
  } catch (err) {
    reporter.panic(err)
  }

  let dir: string
  let shouldBuild = false

  /**
   * If no outDir is provided we default to "build".
   */
  if (outDir) {
    dir = resolve(process.cwd(), outDir)
  } else {
    dir = resolve(process.cwd(), "build")
  }

  try {
    await fse.ensureDir(dir)
  } catch (_e) {
    shouldBuild = true
  }

  const manifestPath = resolve(dir, "build-manifest.json")

  const buildOptions = {
    build: {
      outDir,
    },
    globals: {
      base: path,
      /**
       * We only build the admin UI as part of the Medusa startup process if
       * the user has specified that they want to serve the admin UI. When this
       * is the case, we should always set the backend to `undefined`.
       */
      backend: undefined,
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
      ...buildOptions,
    }).catch((err) => {
      spinner.fail(`Failed to build Admin UI${EOL}`)
      reporter.panic(err)
    })

    spinner.succeed(`Admin UI build - ${Date.now() - time}ms`)
  }
}
