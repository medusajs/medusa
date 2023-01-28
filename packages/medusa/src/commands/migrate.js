import { asValue, createContainer } from "awilix"
import featureFlagLoader from "../loaders/feature-flags"
import Logger from "../loaders/logger"
import databaseLoader from "../loaders/database"
import configModuleLoader from "../loaders/config"
import getMigrations, { getModuleSharedResources } from "./utils/get-migrations"
import { asyncLoadConfig } from "../utils/async-load-config"
const getDataSource = async (directory) => {
  // const configModule = configModuleLoader(directory)
  const configModule = await configModuleLoader(directory, `medusa-config`)

 

  const featureFlagRouter = featureFlagLoader(configModule)
  const { coreMigrations } = getMigrations(directory, featureFlagRouter)
  const { migrations: moduleMigrations } = getModuleSharedResources(
    configModule,
    featureFlagRouter
  )

  const container = createContainer()
  container.register("db_entities", asValue([]))

  return await databaseLoader({
    container,
    configModule,
    customOptions: {
      migrations: coreMigrations.concat(moduleMigrations),
      logging: "all",
    },
  })
}

const main = async function ({ directory }) {
  const args = process.argv

  args.shift()
  args.shift()
  args.shift()

  const dataSource = await getDataSource(directory)

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

export default main
