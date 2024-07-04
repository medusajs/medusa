import Logger from "../loaders/logger"
import { migrateMedusaApp, revertMedusaApp } from "../loaders/medusa-app"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const container = await initializeContainer(directory)

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  if (args[0] === "run") {
    await migrateMedusaApp({
      configModule,
      linkModules: pluginLinks,
      container,
    })

    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert") {
    await revertMedusaApp({ configModule, linkModules: pluginLinks, container })

    Logger.info("Migrations reverted.")
  } else if (args[0] === "show") {
    Logger.info("not supported")
    process.exit(0)
  }
}

export default main
