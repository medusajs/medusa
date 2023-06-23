import path from "node:path"
import webpack from "webpack"
import WebpackDevDerver, {
  Configuration as DevServerConfiguration,
} from "webpack-dev-server"
import { DevelopArgs } from "../types"
import { logger, watchLocalAdminFolder } from "../utils"
import { createCacheDir } from "../utils/create-cache-dir"
import { getCustomWebpackConfig } from "../webpack"

/**
 * Starts a development server for the admin UI.
 */
export async function develop({
  appDir,
  buildDir,
  plugins,
  options = {
    path: "/",
    backend: "http://localhost:9000",
    develop: {
      open: true,
      port: 7001,
      logLevel: "error",
      stats: "minimal",
    },
  },
}: DevelopArgs) {
  const { cacheDir } = await createCacheDir({
    appDir,
    plugins,
  })

  const entry = path.resolve(cacheDir, "admin", "src", "main.tsx")
  const dest = path.resolve(appDir, buildDir)
  const env = "development"

  const config = await getCustomWebpackConfig(appDir, {
    entry,
    dest,
    cacheDir,
    env,
    options,
  })

  const compiler = webpack({
    ...config,
    infrastructureLogging: { level: options.develop.logLevel },
    stats: options.develop.stats,
  })

  const devServerArgs: DevServerConfiguration = {
    port: options.develop.port,
    client: {
      logging: "none",
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    open: options.develop.open
      ? {
          target: `http://localhost:${options.develop.port}${
            options.path ? options.path : ""
          }`,
        }
      : false,
    devMiddleware: {
      publicPath: options.path,
    },
    historyApiFallback: {
      index: options.path,
      disableDotRule: true,
    },
  }

  const server = new WebpackDevDerver(devServerArgs, compiler)

  const runServer = async () => {
    logger.info(
      `Started development server on http://localhost:${options.develop.port}${
        options.path ? options.path : ""
      }`
    )

    await server.start()
  }

  await runServer()

  await watchLocalAdminFolder(appDir, cacheDir, plugins)
}
