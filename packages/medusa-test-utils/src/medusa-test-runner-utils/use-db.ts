import type { MedusaAppLoader } from "@zjedene-medusa/framework"
import { logger } from "@zjedene-medusa/framework/logger"
import { Logger, MedusaContainer } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
} from "@zjedene-medusa/framework/utils"
import { join } from "path"

/**
 * Initiates the database connection
 */
export async function initDb() {
  const { pgConnectionLoader } = await import("@zjedene-medusa/framework")

  const pgConnection = await pgConnectionLoader()

  return pgConnection
}

/**
 * Migrates the database
 */
export async function migrateDatabase(appLoader: MedusaAppLoader) {
  try {
    await appLoader.runModulesMigrations()
  } catch (err) {
    logger.error("Something went wrong while running the migrations")
    throw err
  }
}

/**
 * Syncs links with the databse
 */
export async function syncLinks(
  appLoader: MedusaAppLoader,
  directory: string,
  container: MedusaContainer,
  logger: Logger
) {
  try {
    await loadCustomLinks(directory, container)

    const planner = await appLoader.getLinksExecutionPlanner()
    const actionPlan = await planner.createPlan()
    actionPlan.forEach((action) => {
      logger.info(`Sync links: "${action.action}" ${action.tableName}`)
    })
    await planner.executePlan(actionPlan)
  } catch (err) {
    logger.error("Something went wrong while syncing links")
    throw err
  }
}

async function loadCustomLinks(directory: string, container: MedusaContainer) {
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const plugins = await getResolvedPlugins(directory, configModule, true)
  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { LinkLoader } = await import("@zjedene-medusa/framework")
  await new LinkLoader(linksSourcePaths, logger).load()
}
