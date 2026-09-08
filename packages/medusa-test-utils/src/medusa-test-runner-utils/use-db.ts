import type { MedusaAppLoader } from "@medusajs/framework"
import { logger } from "@medusajs/framework/logger"
import {
  ConfigModule,
  Logger,
  MedusaContainer,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  Modules,
} from "@medusajs/framework/utils"
import { join } from "path"

/**
 * Initiates the database connection
 */
export async function initDb() {
  const { pgConnectionLoader } = await import("@medusajs/framework")

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

  const { LinkLoader } = await import("@medusajs/framework")
  await new LinkLoader(linksSourcePaths, logger).load()
}

/**
 * Filling the indexes is left to application start (and optional `reindex()`).
 */
export async function migrateSearchIndexes(
  container: MedusaContainer,
  logger: Logger
) {
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ) as ConfigModule

  // Same optional peer import the runner already uses for `loadSearchIndexes`.
  const { isSearchModuleEnabled } = require("@medusajs/medusa/loaders/search")

  if (!isSearchModuleEnabled(configModule)) {
    return
  }

  try {
    const searchModule = container.resolve(
      Modules.SEARCH
    ) as SearchTypes.ISearchModuleService

    const plan = await searchModule.createIndexMigrationPlan()
    const pending = plan.filter((action) => action.action !== "noop")

    if (!pending.length) {
      logger.info("Search indexes already up-to-date")
      return
    }

    logger.info(
      `Migrating search indexes: ${pending
        .map((action) => `${action.index} (${action.action})`)
        .join(", ")}`
    )

    await searchModule.executeIndexMigrationPlan(plan)
  } catch (err) {
    logger.error("Something went wrong while migrating search indexes")
    throw err
  }
}
