import { join } from "path"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { LinkLoader } from "@medusajs/framework/links"
import { logger } from "@medusajs/framework/logger"
import { MedusaAppLoader } from "@medusajs/framework"

import { ensureDbExists } from "../utils"
import { initializeContainer } from "../../loaders"
import { getResolvedPlugins } from "../../loaders/helpers/resolve-plugins"

const TERMINAL_SIZE = process.stdout.columns

const main = async function ({ directory, modules }) {
  try {
    /**
     * Setup
     */
    const container = await initializeContainer(directory)
    await ensureDbExists(container)

    const medusaAppLoader = new MedusaAppLoader()
    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const plugins = getResolvedPlugins(directory, configModule, true) || []
    const linksSourcePaths = plugins.map((plugin) =>
      join(plugin.resolve, "links")
    )
    await new LinkLoader(linksSourcePaths).load()

    /**
     * Generating migrations
     */
    logger.info("Generating migrations...")

    await medusaAppLoader.runModulesMigrations({
      moduleNames: modules,
      action: "generate",
    })

    console.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations generated")

    process.exit()
  } catch (error) {
    console.log(new Array(TERMINAL_SIZE).join("-"))
    if (error.code && error.code === MedusaError.Codes.UNKNOWN_MODULES) {
      logger.error(error.message)
      const modulesList = error.allModules.map(
        (name: string) => `          - ${name}`
      )
      logger.error(`Available modules:\n${modulesList.join("\n")}`)
    } else {
      logger.error(error.message, error)
    }
    process.exit(1)
  }
}

export default main
