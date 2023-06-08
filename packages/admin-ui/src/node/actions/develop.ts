import path from "node:path"
import webpack from "webpack"
import WebpackDevDerver from "webpack-dev-server"
import { AdminOptions } from "../types"
import { logger, watchLocalExtensions } from "../utils"
import { createCacheDir } from "../utils/create-cache-dir"
import { getCustomWebpackConfig } from "../webpack"

type WatchArgs = {
  appDir: string
  buildDir: string
  plugins?: string[]
  browser?: boolean
  port?: number
  options?: AdminOptions
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
  options = {
    publicPath: "/",
    backend: "http://localhost:9000",
  },
}: WatchArgs) {
  await createCacheDir({ appDir, plugins })

  const cacheDir = path.resolve(appDir, ".cache")

  const entry = path.resolve(cacheDir, "admin", "src", "main.tsx")
  const dest = path.resolve(buildDir, "build")
  const env = "development"

  const config = await getCustomWebpackConfig(appDir, {
    entry,
    dest,
    cacheDir,
    env,
    options,
    devServer: {
      port,
      client: {
        logging: "none",
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      open: browser,
      devMiddleware: {
        publicPath: options.publicPath,
      },
      historyApiFallback: {
        index: options.publicPath,
        disableDotRule: true,
      },
    },
  })

  const compiler = webpack(config)

  const devServerArgs = {
    ...config.devServer,
  }

  const server = new WebpackDevDerver(devServerArgs, compiler)

  const runServer = async () => {
    logger.info("Starting development server...")
    console.log()
    logger.info(
      `Started development server on http://localhost:${port}${options.publicPath}`
    )

    await server.start()
  }

  await runServer()

  await watchLocalExtensions(appDir)
}
