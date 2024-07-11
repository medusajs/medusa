import { asValue } from "awilix"
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

  const action = args[0]
  const container = await initializeContainer(directory)
  container.register("logger", asValue(Logger))

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  if (action === "run") {
    Logger.info("Running migrations...")

    await migrateMedusaApp({
      configModule,
      linkModules: pluginLinks,
      container,
    })

    Logger.info("Migrations completed")
    process.exit()
  } else if (action === "revert") {
    const modulesToRevert = args.slice(1)
    if (!modulesToRevert.length) {
      Logger.error(
        "Please provide the modules for which you want to revert migrations"
      )
      Logger.error(`For example: "npx medusa migration revert <moduleName>"`)
      process.exit(1)
    }

    Logger.info("Reverting migrations...")

    await revertMedusaApp({
      modulesToRevert,
      configModule,
      linkModules: pluginLinks,
      container,
    })

    Logger.info("Migrations reverted")
  } else if (action === "show") {
    Logger.info("Action not supported yet")
    process.exit(0)
  }
}

export default main
