import Logger from "../loaders/logger"
import { migrateMedusaApp, revertMedusaApp } from "../loaders/medusa-app"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"

const TERMINAL_SIZE = process.stdout.columns

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const action = args[0]
  const container = await initializeContainer(directory)

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

    console.log(new Array(TERMINAL_SIZE).join("-"))
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

    try {
      await revertMedusaApp({
        modulesToRevert,
        configModule,
        linkModules: pluginLinks,
        container,
      })
      console.log(new Array(TERMINAL_SIZE).join("-"))
      Logger.info("Migrations reverted")
      process.exit()
    } catch (error) {
      console.log(new Array(TERMINAL_SIZE).join("-"))
      if (error.code && error.code === MedusaError.Codes.UNKNOWN_MODULES) {
        Logger.error(error.message)
        const modulesList = error.allModules.map(
          (name: string) => `          - ${name}`
        )
        Logger.error(`Available modules:\n${modulesList.join("\n")}`)
      } else {
        Logger.error(error.message, error)
      }
      process.exit(1)
    }
  } else if (action === "show") {
    Logger.info("Action not supported yet")
    process.exit(0)
  }
}

export default main
