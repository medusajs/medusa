import boxen from "boxen"
import chalk from "chalk"
import checkbox from "@inquirer/checkbox"

import Logger from "../loaders/logger"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"
import { getLinksExecutionPlanner } from "../loaders/medusa-app"
import { LinkMigrationsPlannerAction } from "@medusajs/types"

type Action = "sync"

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
 * @param action: LinkMigrationsPlannerAction
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

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const action = args[0] as Action

  if (action !== "sync") {
    return process.exit()
  }

  try {
    const container = await initializeContainer(directory)

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    const plugins = getResolvedPlugins(directory, configModule, true) || []
    const pluginLinks = await resolvePluginsLinks(plugins, container)

    const planner = await getLinksExecutionPlanner({
      configModule,
      linkModules: pluginLinks,
      container,
    })

    Logger.info("Syncing links...")

    const actionPlan = await planner.createPlan()
    const groupActionPlan = groupByActionPlan(actionPlan)

    if (groupActionPlan.delete?.length) {
      groupActionPlan.delete = await askForLinkActionsToPerform(
        `Select the tables to ${chalk.red(
          "DELETE"
        )}. The following links have been removed`,
        groupActionPlan.delete
      )
    }

    if (groupActionPlan.notify?.length) {
      const answer = await askForLinkActionsToPerform(
        `Select the tables to ${chalk.red(
          "UPDATE"
        )}. The following links have been updated`,
        groupActionPlan.notify
      )

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
      Logger.info("Links sync completed")
    } else {
      Logger.info("Database already up-to-date")
    }
    process.exit()
  } catch (e) {
    Logger.error(e)
    process.exit(1)
  }
}

export default main
