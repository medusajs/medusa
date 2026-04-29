import checkbox from "@inquirer/checkbox"
import { MedusaAppLoader } from "@medusajs/framework"
import { LinkLoader } from "@medusajs/framework/links"
import {
  LinkMigrationsPlannerAction,
  Logger,
  MedusaContainer,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
  isDefined,
  mergePluginModules,
} from "@medusajs/framework/utils"
import boxen from "boxen"
import chalk from "chalk"
import { join } from "path"

import { initializeContainer } from "../../loaders"
import { ensureDbExists, isPgstreamEnabled } from "../utils"

/**
 * Groups action tables by their "action" property
 * @param actionPlan LinkMigrationsPlannerAction
 */
function groupByActionPlan(actionPlan: LinkMigrationsPlannerAction[]) {
  return actionPlan.reduce((acc, action) => {
    acc[action.action] ??= []
    acc[action.action].push(action)
    return acc
  }, {} as Record<"noop" | "notify" | "create" | "update" | "delete", LinkMigrationsPlannerAction[]>)
}

/**
 * Creates the link description for printing it to the
 * console
 *
 * @param action LinkMigrationsPlannerAction
 */
function buildLinkDescription(action: LinkMigrationsPlannerAction) {
  const { linkDescriptor } = action
  const from = chalk.yellow(
    `${linkDescriptor.fromModule}.${linkDescriptor.fromModel}`
  )
  const to = chalk.yellow(
    `${linkDescriptor.toModule}.${linkDescriptor.toModel}`
  )
  const table = chalk.dim(`(${action.tableName})`)

  return `${from} <> ${to} ${table}`
}

/**
 * Logs the actions of a given action type with a nice border and
 * a title
 */
function logActions(
  title: string,
  actionsOrContext: LinkMigrationsPlannerAction[],
  logger: Logger
) {
  const actionsList = actionsOrContext
    .map((action) => `  - ${buildLinkDescription(action)}`)
    .join("\n")

  logger.info(boxen(`${title}\n${actionsList}`, { padding: 1 }))
}

/**
 * Displays a prompt to select tables that must be impacted with
 * action
 */
async function askForLinkActionsToPerform(
  message: string,
  actions: LinkMigrationsPlannerAction[],
  logger: Logger
) {
  logger.info(boxen(message, { borderColor: "red", padding: 1 }))

  return await checkbox({
    message: "Select tables to act upon",
    instructions: chalk.dim(
      " <space> select, <a> select all, <i> inverse, <enter> submit"
    ),
    choices: actions.map((action) => {
      return {
        name: buildLinkDescription(action),
        value: action,
        checked: false,
      }
    }),
  })
}

/**
 * Low-level utility to sync links. This utility is used
 * by the migrate command as-well.
 */
export async function syncLinks(
  medusaAppLoader: MedusaAppLoader,
  {
    executeAll,
    executeSafe,
    directory,
    container,
    concurrency,
  }: {
    executeSafe: boolean
    executeAll: boolean
    directory: string
    container: MedusaContainer
    concurrency?: number
  }
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // Check if pgstream is enabled - if so, force concurrency to 1
  const pgstreamEnabled = await isPgstreamEnabled(container)
  if (pgstreamEnabled) {
    concurrency = 1
  }

  if (isDefined(concurrency)) {
    process.env.DB_MIGRATION_CONCURRENCY = String(concurrency)
  }

  const planner = await medusaAppLoader.getLinksExecutionPlanner()

  logger.info("Syncing links...")

  const actionPlan = await planner.createPlan()
  const groupActionPlan = groupByActionPlan(actionPlan)

  if (groupActionPlan.delete?.length) {
    /**
     * Do not delete anything when "--execute-safe" flag
     * is used. And only prompt when "--execute-all"
     * flag isn't used either
     */
    if (executeSafe) {
      groupActionPlan.delete = []
    } else if (!executeAll) {
      groupActionPlan.delete = await askForLinkActionsToPerform(
        `Select the tables to ${chalk.red(
          "DELETE"
        )}. The following links have been removed`,
        groupActionPlan.delete,
        logger
      )
    }
  }

  if (groupActionPlan.notify?.length) {
    let answer = groupActionPlan.notify

    /**
     * Do not update anything when "--execute-safe" flag
     * is used. And only prompt when "--execute-all"
     * flag isn't used either.
     */
    if (executeSafe) {
      answer = []
    } else if (!executeAll) {
      answer = await askForLinkActionsToPerform(
        `Select the tables to ${chalk.red(
          "UPDATE"
        )}. The following links have been updated`,
        groupActionPlan.notify,
        logger
      )
    }

    groupActionPlan.update ??= []
    groupActionPlan.update.push(
      ...answer.map((action) => {
        return {
          ...action,
          action: "update",
        } as LinkMigrationsPlannerAction
      })
    )
  }

  const toCreate = groupActionPlan.create ?? []
  const toUpdate = groupActionPlan.update ?? []
  const toDelete = groupActionPlan.delete ?? []
  const actionsToExecute = [...toCreate, ...toUpdate, ...toDelete]

  await planner.executePlan(actionsToExecute)

  if (toCreate.length) {
    logActions("Created following links tables", toCreate, logger)
  }
  if (toUpdate.length) {
    logActions("Updated following links tables", toUpdate, logger)
  }
  if (toDelete.length) {
    logActions("Deleted following links tables", toDelete, logger)
  }

  if (actionsToExecute.length) {
    logger.info("Links sync completed")
  } else {
    logger.info("Database already up-to-date")
  }
}

const main = async function ({
  directory,
  executeSafe,
  executeAll,
  concurrency,
}) {
  const container = await initializeContainer(directory)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await ensureDbExists(container)

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const medusaAppLoader = new MedusaAppLoader()

    const plugins = await getResolvedPlugins(directory, configModule, true)
    mergePluginModules(configModule, plugins)

    const linksSourcePaths = plugins.map((plugin) =>
      join(plugin.resolve, "links")
    )
    await new LinkLoader(linksSourcePaths, logger).load()

    await syncLinks(medusaAppLoader, {
      executeAll,
      executeSafe,
      directory,
      container,
      concurrency,
    })
    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default main
