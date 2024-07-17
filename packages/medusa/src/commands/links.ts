import Logger from "../loaders/logger"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys, isString } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"
import { getLinksExecutionPlanner } from "../loaders/medusa-app"
import {
  PlannerAction,
  PlannerActionLinkDescriptor,
} from "@medusajs/link-modules"

const TERMINAL_SIZE = process.stdout.columns

type Action = "sync"

function groupByActionPlan(actionPlan: PlannerAction[]) {
  return actionPlan.reduce((acc, action) => {
    acc[action.action] ??= []

    acc[action.action].push(action)

    return acc
  }, {} as Record<"noop" | "notify" | "create" | "update" | "delete", PlannerAction[]>)
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
  actionsOrContext: string | PlannerAction[]
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
    showMessage("Links to be update", toUpdate)
  }

  const toDelete = groupActionPlan.delete ?? []
  if (toDelete.length) {
    const content = toDelete.map((action) => "- " + action.tableName).join("\n")
    showMessage("Links to be deleted", content)
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
