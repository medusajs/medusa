import path from "node:path"
import { createCacheDir } from "../utils/create-cache-dir"

type BuildArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
}

/**
 * Builds the admin UI.
 */
export async function build({ appDir, buildDir, plugins }: BuildArgs) {
  await createCacheDir({ appDir, plugins })

  const cacheDir = path.resolve(appDir, ".cache")
  const entry = path.resolve(cacheDir, "admin", "src", "main.tsx")
  const dest = path.resolve(buildDir, "build")
  const env = "production"

  // const config = {}

  // const compiler = webpack(config)

  // return new Promise((resolve, reject) => {
  //   compiler.run((err: WebpackError, stats) => {
  //     if (err) {
  //       console.error(err.stack || err)

  //       if (err.details) {
  //         logger.error(err.details)
  //       }

  //       reject(err)
  //     }

  //     const info = stats.toJson()

  //     if (stats.hasErrors()) {
  //       logger.error(JSON.stringify(info.errors))
  //     }

  //     return resolve({
  //       stats,
  //       warnings: info.warnings,
  //     })
  //   })
  // })
}
