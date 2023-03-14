import { createConnection } from "typeorm"
import featureFlagLoader from "../loaders/feature-flags"
import configModuleLoader from "../loaders/config"
import Logger from "../loaders/logger"

import getMigrations, { getModuleSharedResources } from "./utils/get-migrations"

const getDataSource = async (directory) => {
  const configModule = configModuleLoader(directory)

  const featureFlagRouter = featureFlagLoader(configModule)

  const { coreMigrations } = getMigrations(directory, featureFlagRouter)

  const { migrations: moduleMigrations } = getModuleSharedResources(
    configModule,
    featureFlagRouter
  )

  return await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: coreMigrations.concat(moduleMigrations),
    logging: true,
  })
}

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  if (args[0] === "run") {
    const dataSource = await getDataSource(directory)

    await dataSource.runMigrations()
    await dataSource.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert") {
    const dataSource = await getDataSource(directory)

    await dataSource.undoLastMigration({ transaction: "all" })
    await dataSource.close()
    Logger.info("Migrations reverted.")

    process.exit()
  } else if (args[0] === "show") {
    const configModule = configModuleLoader(directory)

    const featureFlagRouter = featureFlagLoader(configModule)

    const { coreMigrations } = getMigrations(directory, featureFlagRouter)

    const connection = await createConnection({
      type: configModule.projectConfig.database_type,
      url: configModule.projectConfig.database_url,
      extra: configModule.projectConfig.database_extra || {},
      schema: configModule.projectConfig.database_schema,
      migrations: coreMigrations,
      logging: true,
    })

    const unapplied = await connection.showMigrations()
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default main
