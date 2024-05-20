import { asValue } from "awilix"
import { revertIsolatedModulesMigration } from "./utils/get-migrations"

import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import configModuleLoader from "../loaders/config"
import featureFlagLoader from "../loaders/feature-flags"
import Logger from "../loaders/logger"
import {
  loadModules,
  migrateMedusaApp,
  revertMedusaApp,
} from "../loaders/medusa-app"
import pgConnectionLoader from "../loaders/pg-connection"

const runLinkMigrations = async (directory) => {
  const configModule = configModuleLoader(directory)
  const container = createMedusaContainer()
  const featureFlagRouter = featureFlagLoader(configModule)

  container.register({
    featureFlagRouter: asValue(featureFlagRouter),
    [ContainerRegistrationKeys.LOGGER]: asValue(Logger),
  })

  await pgConnectionLoader({ configModule, container })

  const { runMigrations } = await loadModules(
    { configModule, container },
    { registerInContainer: false }
  )

  const options = {
    database: {
      clientUrl: configModule.projectConfig.database_url,
    },
  }
  await runMigrations(options)
}

const main = async function ({ directory }) {
  const args = process.argv

  args.shift()
  args.shift()
  args.shift()

  const configModule = configModuleLoader(directory)
  const featureFlagRouter = featureFlagLoader(configModule)

  const container = createMedusaContainer()
  const pgConnection = await pgConnectionLoader({ configModule, container })
  container.register({
    [ContainerRegistrationKeys.CONFIG_MODULE]: asValue(configModule),
    [ContainerRegistrationKeys.LOGGER]: asValue(Logger),
    [ContainerRegistrationKeys.PG_CONNECTION]: asValue(pgConnection),
    [ContainerRegistrationKeys.FEATURE_FLAG_ROUTER]: asValue(featureFlagRouter),
  })

  if (args[0] === "run") {
    await migrateMedusaApp({ configModule, container })

    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert") {
    await revertMedusaApp({ configModule, container })
    await revertIsolatedModulesMigration(configModule)
    Logger.info("Migrations reverted.")
  } else if (args[0] === "show") {
    Logger.info("not supported")
    process.exit(0)
  }
}

export default main
