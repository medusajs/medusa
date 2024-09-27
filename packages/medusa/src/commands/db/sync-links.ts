import boxen from "boxen"
import chalk from "chalk"
import { join } from "path"
import checkbox from "@inquirer/checkbox"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { LinkMigrationsPlannerAction } from "@medusajs/framework/types"
import { LinkLoader } from "@medusajs/framework/links"
import { logger } from "@medusajs/framework/logger"
import { MedusaAppLoader } from "@medusajs/framework"

import { ensureDbExists } from "../utils"
import { initializeContainer } from "../../loaders"
import { getResolvedPlugins } from "../../loaders/helpers/resolve-plugins"

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
  actionsOrContext: LinkMigrationsPlannerAction[]
) {
  const actionsList = actionsOrContext
    .map((action) => `  - ${buildLinkDescription(action)}`)
    .join("\n")

  console.log(boxen(`${title}\n${actionsList}`, { padding: 1 }))
}

/**
 * Displays a prompt to select tables that must be impacted with
 * action
 */
async function askForLinkActionsToPerform(
  message: string,
  actions: LinkMigrationsPlannerAction[]
) {
  console.log(boxen(message, { borderColor: "red", padding: 1 }))

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
  }: {
    executeSafe: boolean
    executeAll: boolean
  }
) {
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
        groupActionPlan.delete
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
        groupActionPlan.notify
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
    logActions("Created following links tables", toCreate)
  }
  if (toUpdate.length) {
    logActions("Updated following links tables", toUpdate)
  }
  if (toDelete.length) {
    logActions("Deleted following links tables", toDelete)
  }

  if (actionsToExecute.length) {
    logger.info("Links sync completed")
  } else {
    logger.info("Database already up-to-date")
  }
}

const main = async function ({ directory, executeSafe, executeAll }) {
  try {
    const container = await initializeContainer(directory)
    await ensureDbExists(container)

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const medusaAppLoader = new MedusaAppLoader()

    const plugins = getResolvedPlugins(directory, configModule, true) || []
    const linksSourcePaths = plugins.map((plugin) =>
      join(plugin.resolve, "links")
    )
    await new LinkLoader(linksSourcePaths).load()

    await syncLinks(medusaAppLoader, { executeAll, executeSafe })
    process.exit()
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default main
