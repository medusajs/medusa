import checkbox from "@inquirer/checkbox"
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

function describeAction(
  action: SearchTypes.SearchIndexMigrationAction
): string {
  const index = chalk.yellow(action.index)

  if (action.action === "drop") {
    // Every version goes, so all of them are named rather than just the one
    // serving reads — this is the last chance to see what is about to be lost.
    const detail = action.physical_names.length
      ? action.physical_names.join(", ")
      : "no physical index"

    return `${index} ${chalk.dim(`(${detail})`)}`
  }

  if (action.action !== "migrate") {
    return `${index} ${chalk.dim(`(${action.physical_name})`)}`
  }

  const destination = `${action.active_physical_name} -> ${action.physical_name}`

  const detail = action.previous_provider
    ? `${action.previous_provider} -> ${action.provider}, ${destination}`
    : destination

  return `${index} ${chalk.dim(`(${detail})`)}`
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

type DropAction = Extract<
  SearchTypes.SearchIndexMigrationAction,
  { action: "drop" }
>

async function selectIndexesToDrop({
  actions,
  executeAll,
  executeSafe,
  logger,
}: {
  actions: DropAction[]
  executeAll: boolean
  executeSafe: boolean
  logger: Logger
}): Promise<DropAction[]> {
  if (!actions.length) {
    return []
  }

  const skip = (reason: string) => {
    logActions(
      `Left the following search indexes in place, which no definition declares any more (${reason})`,
      actions,
      logger
    )
    return []
  }

  if (executeSafe) {
    return skip("--execute-safe-search")
  }

  if (executeAll) {
    return actions
  }

  if (!process.stdin.isTTY) {
    return skip(
      "no prompt to answer; re-run with --execute-all-search to drop them"
    )
  }

  logger.info(
    boxen(
      `Select the search indexes to ${chalk.red(
        "DROP"
      )}. No definition declares them any more, and dropping one deletes every document it holds.`,
      { borderColor: "red", padding: 1 }
    )
  )

  return await checkbox({
    message: "Select search indexes to drop",
    instructions: chalk.dim(
      " <space> select, <a> select all, <i> inverse, <enter> submit"
    ),
    choices: actions.map((action) => {
      return {
        name: describeAction(action),
        value: action,
        checked: false,
      }
    }),
  })
}

/**
 * Low-level utility to bring the physical search indexes in line with the loaded
 * definitions. Creates and alters them only — filling them is the seed that runs
 * at application start. Indexes no definition declares any more are dropped,
 * which is the one destructive thing here and so is gated on `executeAll`.
 */
export async function migrateSearchIndexes({
  directory,
  container,
  logger,
  executeAll = false,
  executeSafe = false,
}: {
  directory: string
  container: MedusaContainer
  logger: Logger
  executeAll?: boolean
  executeSafe?: boolean
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
    const toDrop = await selectIndexesToDrop({
      actions: plan.filter(
        (action): action is DropAction => action.action === "drop"
      ),
      executeAll,
      executeSafe,
      logger,
    })

    if (!toCreate.length && !toMigrate.length && !toDrop.length) {
      logger.info("Search indexes already up-to-date")
      return true
    }

    // The noops go along too: they carry no schema change, but versions an
    // earlier swap left behind are cleaned up as they are executed.
    await searchModule.executeIndexMigrationPlan([
      ...plan.filter((action) => action.action === "noop"),
      ...toCreate,
      ...toMigrate,
      ...toDrop,
    ])

    if (toCreate.length) {
      logActions("Created following search indexes", toCreate, logger)
    }
    if (toMigrate.length) {
      logActions("Rebuilt following search indexes", toMigrate, logger)
    }
    if (toDrop.length) {
      logActions("Dropped following search indexes", toDrop, logger)
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

const main = async function ({
  directory,
  executeAllSearch,
  executeSafeSearch,
}: {
  directory: string
  executeAllSearch?: boolean
  executeSafeSearch?: boolean
}) {
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
      executeAll: executeAllSearch,
      executeSafe: executeSafeSearch,
    })
    process.exit(migrated ? 0 : 1)
  } catch (error: any) {
    if (error?.name === "ExitPromptError") {
      process.exit()
    }

    if (logger) {
      logger.error(error as string | Error)
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

export default main
