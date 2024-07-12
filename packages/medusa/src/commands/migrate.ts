import Logger from "../loaders/logger"
import { runMedusaAppMigrations } from "../loaders/medusa-app"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { resolvePluginsLinks } from "../loaders/helpers/resolve-plugins-links"

const TERMINAL_SIZE = process.stdout.columns

type Action = "run" | "revert" | "generate" | "show"

function validateInputArgs({
  action,
  modules,
}: {
  action: Action
  modules: string[]
}) {
  const actionsRequiringModules = ["revert", "generate"]

  if (modules.length && !actionsRequiringModules.includes(action)) {
    Logger.error(
      `<modules> cannot be specified with the "${action}" action. Please remove the <modules> argument and try again.`
    )
    process.exit(1)
  }

  if (!modules.length && actionsRequiringModules.includes(action)) {
    Logger.error(
      "Please provide the modules for which you want to revert migrations"
    )
    Logger.error(`For example: "npx medusa migration revert <moduleName>"`)
    process.exit(1)
  }
}

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const action = args[0] as "run" | "revert" | "generate" | "show"
  const modules = args.splice(1)

  validateInputArgs({ action, modules })

  const container = await initializeContainer(directory)

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const pluginLinks = await resolvePluginsLinks(plugins, container)

  if (action === "run") {
    Logger.info("Running migrations...")

    await runMedusaAppMigrations({
      configModule,
      linkModules: pluginLinks,
      container,
      action: "run",
    })

    console.log(new Array(TERMINAL_SIZE).join("-"))
    Logger.info("Migrations completed")
    process.exit()
  } else if (action === "revert") {
    Logger.info("Reverting migrations...")

    try {
      await runMedusaAppMigrations({
        moduleNames: modules,
        configModule,
        linkModules: pluginLinks,
        container,
        action: "revert",
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
  } else if (action === "generate") {
    Logger.info("Generating migrations...")

    await runMedusaAppMigrations({
      moduleNames: modules,
      configModule,
      linkModules: pluginLinks,
      container,
      action: "generate",
    })

    console.log(new Array(TERMINAL_SIZE).join("-"))
    Logger.info("Migrations generated")
    process.exit()
  } else if (action === "show") {
    Logger.info("Action not supported yet")
    process.exit(0)
  }
}

export default main
