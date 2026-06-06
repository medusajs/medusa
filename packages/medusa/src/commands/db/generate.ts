import { MedusaAppLoader, Migrator } from "@zjedene-medusa/framework"
import { LinkLoader } from "@zjedene-medusa/framework/links"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  MedusaError,
  mergePluginModules,
} from "@zjedene-medusa/framework/utils"
import { join } from "path"
import { initializeContainer } from "../../loaders"
import { ensureDbExists } from "../utils"

const TERMINAL_SIZE = process.stdout.columns

const main = async function ({ directory, modules }) {
  const container = await initializeContainer(directory)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    /**
     * Setup
     */

    await ensureDbExists(container)

    const medusaAppLoader = new MedusaAppLoader()
    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const plugins = await getResolvedPlugins(directory, configModule, true)
    mergePluginModules(configModule, plugins)

    const linksSourcePaths = plugins.map((plugin) =>
      join(plugin.resolve, "links")
    )
    await new LinkLoader(linksSourcePaths, logger).load()

    /**
     * Generating migrations
     */
    logger.info("Generating migrations...")

    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    await medusaAppLoader.runModulesMigrations({
      moduleNames: modules,
      action: "generate",
    })

    logger.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations generated")

    process.exit()
  } catch (error) {
    logger.log(new Array(TERMINAL_SIZE).join("-"))
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
