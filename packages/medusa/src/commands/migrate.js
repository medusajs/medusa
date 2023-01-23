import { asValue, createContainer } from "awilix"
import { getConfigFile } from "medusa-core-utils"
import featureFlagLoader from "../loaders/feature-flags"
import { handleConfigError } from "../loaders/config"
import Logger from "../loaders/logger"
import databaseLoader from "../loaders/database"

import getMigrations from "./utils/get-migrations"

const t = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const { configModule, error } = getConfigFile(directory, `medusa-config`)

  if (error) {
    handleConfigError(error)
  }

  const featureFlagRouter = featureFlagLoader(configModule)

  const enabledMigrations = await getMigrations(directory, featureFlagRouter)

  const container = createContainer()
  container.register("db_entities", asValue([]))
  const dataSource = await databaseLoader({
    container,
    configModule,
    customOptions: {
      migrations: enabledMigrations,
      logging: "all",
    },
  })

  if (args[0] === "run") {
    await dataSource.runMigrations()
    await dataSource.destroy()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert") {
    await dataSource.undoLastMigration({ transaction: "all" })
    await dataSource.destroy()
    Logger.info("Migrations reverted.")
    process.exit()
  } else if (args[0] === "show") {
    const unapplied = await dataSource.showMigrations()
    Logger.info(unapplied)
    await dataSource.destroy()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
