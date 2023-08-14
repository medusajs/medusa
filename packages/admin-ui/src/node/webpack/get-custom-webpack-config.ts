import fse from "fs-extra"
import path from "node:path"
import webpack from "webpack"
import { CustomWebpackConfigArgs } from "../types"
import { logger } from "../utils"
import { validateArgs } from "../utils/validate-args"
import { getWebpackConfig } from "./get-webpack-config"
import { withCustomWebpackConfig } from "./with-custom-webpack-config"

export async function getCustomWebpackConfig(
  appDir: string,
  args: CustomWebpackConfigArgs
) {
  validateArgs(args)

  let config = getWebpackConfig(args)

  const adminConfigPath = path.join(appDir, "src", "admin", "webpack.config.js")

  const pathExists = await fse.pathExists(adminConfigPath)

  if (pathExists) {
    let webpackAdminConfig: ReturnType<typeof withCustomWebpackConfig>

    try {
      webpackAdminConfig = require(adminConfigPath)
    } catch (e) {
      logger.panic(
        `An error occured while trying to load your custom Webpack config. See the error below for details:`,
        {
          error: e,
        }
      )
    }

    if (typeof webpackAdminConfig === "function") {
      if (args.devServer) {
        config.devServer = args.devServer
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
