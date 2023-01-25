import { createConnection } from "typeorm"
import featureFlagLoader from "../loaders/feature-flags"
import configModuleLoader from "../loaders/config"
import Logger from "../loaders/logger"

import getMigrations, { getModuleSharedResources } from "./utils/get-migrations"

export const migrateUp = async (directory) => {
  const configModule = configModuleLoader(directory)

  const featureFlagRouter = featureFlagLoader(configModule)

  const { coreMigrations } = getMigrations(directory, featureFlagRouter)

  const { migrations: moduleMigrations } = getModuleSharedResources(
    configModule,
    featureFlagRouter
  )

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: coreMigrations.concat(moduleMigrations),
    logging: true,
  })

  await connection.runMigrations()
  await connection.close()
  Logger.info("Migrations completed.")
}

export const migrateDown = async (directory) => {
  const configModule = configModuleLoader(directory)

  const featureFlagRouter = featureFlagLoader(configModule)

  const { coreMigrations } = getMigrations(directory, featureFlagRouter)

  const { migrations: moduleMigrations } = getModuleSharedResources(
    configModule,
    featureFlagRouter
  )

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: coreMigrations.concat(moduleMigrations),
    logging: true,
  })

  await connection.undoLastMigration({ transaction: "all" })
  await connection.close()
  Logger.info("Migrations reverted.")
}

const main = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  if (args[0] === "run") {
    await migrateUp(directory)
    process.exit()
  } else if (args[0] === "revert") {
    await migrateDown(directory)
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
