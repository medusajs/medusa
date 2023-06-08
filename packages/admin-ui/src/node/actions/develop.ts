import path from "node:path"
import { createCacheDir } from "../utils/create-cache-dir"

type WatchArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
  browser?: boolean
  port?: number
}

/**
 * Starts a development server for the admin UI.
 */
export async function develop({
  appDir,
  buildDir,
  plugins,
  browser = true,
  port = 7001,
}: WatchArgs) {
  await createCacheDir({ appDir, plugins })

  const cacheDir = path.resolve(appDir, ".cache")

  const entry = path.resolve(cacheDir, "admin", "src", "main.tsx")
  const dest = path.resolve(buildDir, "build")
  const env = "development"

  //   const config: Configuration = {
  //     devServer: {
  //       open: true,
  //     },
  //   }

  //   const compiler = webpack(config)

  //   const server = new WebpackDevDerver(config)
}
