import fse from "fs-extra"
import path from "node:path"
import webpack from "webpack"
import { Configuration as DevServerConfiguration } from "webpack-dev-server"
import { logger } from "."
import { CustomWebpackConfigArgs } from "../types"
import { getWebpackConfig } from "../webpack/get-webpack-config"
import { withCustomWebpackConfig } from "../webpack/with-custom-webpack-config"

export async function getCustomWebpackConfig(
  appDir: string,
  args: CustomWebpackConfigArgs
) {
  let config = getWebpackConfig(args)

  const adminConfigPath = path.join(appDir, "src", "admin", "webpack.config")

  const webpackConfigJS = adminConfigPath + ".js"
  const webpackConfigTS = adminConfigPath + ".ts"

  let actualConfigPath: string | null = null

  if (fse.existsSync(webpackConfigTS)) {
    actualConfigPath = webpackConfigTS
  } else if (fse.existsSync(webpackConfigJS)) {
    actualConfigPath = webpackConfigJS
  }

  if (actualConfigPath) {
    let webpackAdminConfig: ReturnType<typeof withCustomWebpackConfig>

    try {
      webpackAdminConfig = await import(adminConfigPath)
    } catch (e) {
      logger.panic(`Error loading custom webpack config: ${e.message}`)
    }

    if (typeof webpackAdminConfig === "function") {
      if (args.devServer) {
        // Need to cast the devServer config to the correct type to prevent DTS from throwing
        config = {
          ...config,
          devServer: args.devServer as DevServerConfiguration,
        }
      }

      config = webpackAdminConfig(config, webpack)

      if (!config) {
        logger.panic(
          "Nothing was returned from your custom webpack configuration"
        )
      }
    }
  }

  return config
}
