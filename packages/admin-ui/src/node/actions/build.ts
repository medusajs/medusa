import path from "node:path"
import webpack, { WebpackError } from "webpack"
import { BuildArgs } from "../types"
import { logger } from "../utils"
import { createCacheDir } from "../utils/create-cache-dir"
import { getCustomWebpackConfig } from "../webpack"

/**
 * Builds the admin UI.
 */
export async function build({
  appDir,
  buildDir,
  plugins,
  options,
  reporting = "fancy",
}: BuildArgs) {
  await createCacheDir({ appDir, plugins })

  const cacheDir = path.resolve(appDir, ".cache")
  const entry = path.resolve(cacheDir, "admin", "src", "main.tsx")
  const dest = path.resolve(appDir, buildDir)
  const env = "production"

  const config = await getCustomWebpackConfig(appDir, {
    entry,
    dest,
    cacheDir,
    env,
    options,
    reporting,
  })

  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err: WebpackError, stats) => {
      if (err) {
        if (err.details) {
          logger.error(err.details)
        }

        reject(err)
      }

      const info = stats.toJson()

      if (stats.hasErrors()) {
        logger.error(JSON.stringify(info.errors))
      }

      return resolve({
        stats,
        warnings: info.warnings,
      })
    })
  })
}
