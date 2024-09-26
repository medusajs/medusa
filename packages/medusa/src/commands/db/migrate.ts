import { join } from "path"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { LinkLoader } from "@medusajs/framework/links"
import { logger } from "@medusajs/framework/logger"
import { MedusaAppLoader } from "@medusajs/framework"

import { syncLinks } from "./sync-links"
import { ensureDbExists } from "../utils"
import { initializeContainer } from "../../loaders"
import { getResolvedPlugins } from "../../loaders/helpers/resolve-plugins"

const TERMINAL_SIZE = process.stdout.columns

/**
 * A low-level utility to migrate the database. This util should
 * never exit the process implicitly.
 */
export async function migrate({
  directory,
  skipLinks,
  executeAllLinks,
  executeSafeLinks,
}: {
  directory: string
  skipLinks: boolean
  executeAllLinks: boolean
  executeSafeLinks: boolean
}): Promise<boolean> {
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

  return true
}

const main = async function ({
  directory,
  skipLinks,
  executeAllLinks,
  executeSafeLinks,
}) {
  try {
    const migrated = await migrate({
      directory,
      skipLinks,
      executeAllLinks,
      executeSafeLinks,
    })
    process.exit(migrated ? 0 : 1)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default main
