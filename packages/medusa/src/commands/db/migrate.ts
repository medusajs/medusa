import { join } from "path"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { LinkLoader, logger, MedusaAppLoader } from "@medusajs/framework"

import { syncLinks } from "./sync-links"
import { ensureDbExists } from "../utils"
import { initializeContainer } from "../../loaders"
import { getResolvedPlugins } from "../../loaders/helpers/resolve-plugins"

const TERMINAL_SIZE = process.stdout.columns

const main = async function ({
  directory,
  skipLinks,
  executeAllLinks,
  executeSafeLinks,
}) {
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
     * Run migrations
     */
    logger.info("Running migrations...")
    await medusaAppLoader.runModulesMigrations({
      action: "run",
    })
    console.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations completed")

    /**
     * Sync links
     */
    if (!skipLinks) {
      console.log(new Array(TERMINAL_SIZE).join("-"))
      await syncLinks(medusaAppLoader, {
        executeAll: executeAllLinks,
        executeSafe: executeSafeLinks,
      })
    }

    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default main
