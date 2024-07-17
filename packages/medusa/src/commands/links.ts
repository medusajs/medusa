import Logger from "../loaders/logger"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"
import { getLinksExecutionPlanner } from "../loaders/medusa-app"

const TERMINAL_SIZE = process.stdout.columns

type Action = "sync"

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const action = args[0] as Action

  const container = await initializeContainer(directory)

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  if (action === "sync") {
    Logger.info("Syncing links...")

    const planner = await getLinksExecutionPlanner({
      configModule,
      linkModules: pluginLinks,
      container,
      action: "run",
    })

    const actionPlan = await planner.createPlan()
    await planner.executeActionPlan(actionPlan)

    console.log(new Array(TERMINAL_SIZE).join("-"))
    Logger.info("Links sync completed")
    process.exit()
  }
}

export default main
