import { MedusaAppLoader } from "@medusajs/framework"
import { LinkLoader } from "@medusajs/framework/links"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ConfigModule,
  Logger,
  MedusaContainer,
  SearchTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  mergePluginModules,
  Modules,
} from "@medusajs/framework/utils"
import boxen from "boxen"
import chalk from "chalk"
import { join } from "path"

import { initializeContainer } from "../../loaders"
import { isSearchModuleEnabled, loadSearchIndexes } from "../../loaders/search"
import { ensureDbExists } from "../utils"

const TERMINAL_SIZE = process.stdout.columns

function describeAction(action: SearchTypes.SearchIndexMigrationAction): string {
  const index = chalk.yellow(action.index)

  if (action.action !== "migrate") {
    return `${index} ${chalk.dim(`(${action.physical_name})`)}`
  }

  // A rebuild that lands on the live name has nowhere to build alongside, so the
  // index serves nothing between here and the seed at startup. Worth saying.
  const target =
    action.physical_name === action.live_physical_name
      ? chalk.dim(`(${action.physical_name}, replaced in place)`)
      : chalk.dim(`(${action.live_physical_name} -> ${action.physical_name})`)

  return `${index} ${target}`
}

function logActions(
  title: string,
  actions: SearchTypes.SearchIndexMigrationAction[],
  logger: Logger
) {
  const actionsList = actions
    .map((action) => `  - ${describeAction(action)}`)
    .join("\n")

  logger.info(boxen(`${title}\n${actionsList}`, { padding: 1 }))
}

/**
 * Low-level utility to bring the physical search indexes in line with the loaded
 * definitions. Creates and alters them only — filling them is the seed that runs
 * at application start, so an index this creates serves nothing until then.
 *
 * This util should never exit the process implicitly.
 */
export async function migrateSearchIndexes({
  directory,
  container,
  logger,
}: {
  directory: string
  container: MedusaContainer
  logger: Logger
}): Promise<boolean> {
  let onApplicationPrepareShutdown: () => Promise<void> = async () =>
    Promise.resolve()
  let onApplicationShutdown: () => Promise<void> = async () => Promise.resolve()

  try {
    await ensureDbExists(container)

    const configModule = container.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const plugins = await getResolvedPlugins(directory, configModule, true)
    mergePluginModules(configModule, plugins)

    if (!isSearchModuleEnabled(configModule)) {
      logger.info("Search Module is not configured. Skipping search indexes")
      return true
    }

    /**
     * Clear all module instances so the partially loaded modules left behind by
     * migration planning are not served from cache. Links and search index
     * definitions are registered on the same cache, so they are loaded again
     * below rather than relied upon from earlier in the process.
     */
    MedusaModule.clearInstances()

    const linksSourcePaths = plugins.map((plugin) =>
      join(plugin.resolve, "links")
    )
    await new LinkLoader(linksSourcePaths, logger).load()
    await loadSearchIndexes({ plugins, configModule, logger })

    const medusaAppResources = await new MedusaAppLoader({ container }).load()
    onApplicationPrepareShutdown =
      medusaAppResources.onApplicationPrepareShutdown
    onApplicationShutdown = medusaAppResources.onApplicationShutdown

    const searchModule = container.resolve<SearchTypes.ISearchModuleService>(
      Modules.SEARCH
    )

    logger.info("Migrating search indexes...")

    const plan = await searchModule.createIndexMigrationPlan()
    const toCreate = plan.filter((action) => action.action === "create")
    const toMigrate = plan.filter((action) => action.action === "migrate")

    if (!toCreate.length && !toMigrate.length) {
      logger.info("Search indexes already up-to-date")
      return true
    }

    await searchModule.executeIndexMigrationPlan(plan)

    if (toCreate.length) {
      logActions("Created following search indexes", toCreate, logger)
    }
    if (toMigrate.length) {
      logActions("Rebuilt following search indexes", toMigrate, logger)
    }

    logger.info(
      "Search indexes migrated. They are filled when the application starts"
    )

    return true
  } finally {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
  }
}

const main = async function ({ directory }: { directory: string }) {
  process.env.MEDUSA_WORKER_MODE = "server"
  let logger: Logger | undefined

  try {
    const container = await initializeContainer(directory)
    logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.log(new Array(TERMINAL_SIZE).join("-"))

    const migrated = await migrateSearchIndexes({
      directory,
      container,
      logger,
    })
    process.exit(migrated ? 0 : 1)
  } catch (error) {
    if (logger) {
      logger.error(error as string | Error)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

export default main
