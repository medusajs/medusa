import { LinkLoader, logger, runMedusaAppMigrations } from "@medusajs/framework"
import { initializeContainer } from "../loaders"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"
import { getResolvedPlugins } from "../loaders/helpers/resolve-plugins"
import { join } from "path"

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
    logger.error(
      `<modules> cannot be specified with the "${action}" action. Please remove the <modules> argument and try again.`
    )
    process.exit(1)
  }

  if (!modules.length && actionsRequiringModules.includes(action)) {
    logger.error(
      "Please provide the modules for which you want to revert migrations"
    )
    logger.error(`For example: "npx medusa migration revert <moduleName>"`)
    process.exit(1)
  }
}

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const action = args[0] as Action
  const modules = args.splice(1)

  validateInputArgs({ action, modules })

  const container = await initializeContainer(directory)

  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )

  const plugins = getResolvedPlugins(directory, configModule, true) || []
  const linksSourcePaths = plugins.map((plugin) =>
    join(plugin.resolve, "links")
  )
  await new LinkLoader(linksSourcePaths).load()

  if (action === "run") {
    logger.info("Running migrations...")

    await runMedusaAppMigrations({
      action: "run",
    })

    console.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations completed")
    process.exit()
  } else if (action === "revert") {
    logger.info("Reverting migrations...")

    try {
      await runMedusaAppMigrations({
        moduleNames: modules,
        action: "revert",
      })
      console.log(new Array(TERMINAL_SIZE).join("-"))
      logger.info("Migrations reverted")
      process.exit()
    } catch (error) {
      console.log(new Array(TERMINAL_SIZE).join("-"))
      if (error.code && error.code === MedusaError.Codes.UNKNOWN_MODULES) {
        logger.error(error.message)
        const modulesList = error.allModules.map(
          (name: string) => `          - ${name}`
        )
        logger.error(`Available modules:\n${modulesList.join("\n")}`)
      } else {
        logger.error(error.message, error)
      }
      process.exit(1)
    }
  } else if (action === "generate") {
    logger.info("Generating migrations...")

    await runMedusaAppMigrations({
      moduleNames: modules,
      action: "generate",
    })

    console.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations generated")
    process.exit()
  } else if (action === "show") {
    logger.info("Action not supported yet")
    process.exit(0)
  }
}

export default main
