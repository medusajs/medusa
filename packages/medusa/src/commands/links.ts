import Logger from "../loaders/logger"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys, isString } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"
import { getLinksExecutionPlanner } from "../loaders/medusa-app"
import {
  LinkMigrationsPlannerAction,
  PlannerActionLinkDescriptor,
} from "@medusajs/types"
import checkbox from "@inquirer/checkbox"

const TERMINAL_SIZE = process.stdout.columns

type Action = "sync"

function groupByActionPlan(actionPlan: LinkMigrationsPlannerAction[]) {
  return actionPlan.reduce((acc, action) => {
    acc[action.action] ??= []

    acc[action.action].push(action)

    return acc
  }, {} as Record<"noop" | "notify" | "create" | "update" | "delete", LinkMigrationsPlannerAction[]>)
}

function displaySection({
  title,
  content,
}: {
  title: string
  content: string
}) {
  console.log(new Array(TERMINAL_SIZE).join("-"))
  console.log(title)
  console.log(content)
}

function buildLinkDescription(linkDescriptor: PlannerActionLinkDescriptor) {
  return `- ${linkDescriptor.fromModule} to ${linkDescriptor.toModule} (${linkDescriptor.fromModel} to ${linkDescriptor.toModel})`
}

function showMessage(
  title: string,
  actionsOrContext: string | LinkMigrationsPlannerAction[]
) {
  const toCreateDescription = isString(actionsOrContext)
    ? actionsOrContext
    : actionsOrContext
        .map((action) =>
          buildLinkDescription(
            (action as { linkDescriptor: PlannerActionLinkDescriptor })
              .linkDescriptor
          )
        )
        .join("\n")

  displaySection({
    title,
    content: toCreateDescription,
  })
}

async function askForLinksToDelete(actions: LinkMigrationsPlannerAction[]) {
  console.log("\n")
  const answer = await checkbox({
    message:
      "Select the link tables you want to delete, this means that those links are not defined anymore and will be removed from the database.",
    choices: [
      ...actions.map((action) => {
        return {
          name: action.tableName,
          value: action.tableName,
          checked: true,
        }
      }),
      {
        name: "none",
        value: "none",
        checked: false,
      },
    ],
    validate: (answer) => {
      if (answer.length === 0) {
        return "Please select at least one choice"
      }

      if (
        answer.length > 1 &&
        answer.some((choice) => "value" in choice && choice.value === "none")
      ) {
        return "'none' cannot be selected with other selected choices"
      }

      return true
    },
  })

  return answer.filter((a) => a !== "none")
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

  const container = await initializeContainer(directory)

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  Logger.info("Syncing links...")

  const planner = await getLinksExecutionPlanner({
    configModule,
    linkModules: pluginLinks,
    container,
    action: "run",
  })

  const actionPlan = await planner.createPlan()

  const groupActionPlan = groupByActionPlan(actionPlan)

  const toCreate = groupActionPlan.create ?? []
  if (toCreate.length) {
    showMessage("Links to be created", toCreate)
  }

  const toUpdate = groupActionPlan.update ?? []
  if (toUpdate.length) {
    showMessage("Links to be updated", toUpdate)
  }

  const toDelete = groupActionPlan.delete ?? []
  if (toDelete.length) {
    const answer = askForLinksToDelete(toDelete)
    console.log(answer)
  }

  const toNotify = groupActionPlan.notify ?? []
  if (toNotify.length) {
    showMessage("Links to be notified", toNotify)
  }

  /* await planner.executeActionPlan(actionPlan)*/

  console.log(new Array(TERMINAL_SIZE).join("-"))
  Logger.info("Links sync completed")
  process.exit()
}

export default main
