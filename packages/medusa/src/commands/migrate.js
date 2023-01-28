import { createConnection } from "typeorm"
import { getConfigFile } from "medusa-core-utils"
import featureFlagLoader from "../loaders/feature-flags"
import { handleConfigError } from "../loaders/config"
import Logger from "../loaders/logger"

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
  let hostConfig = {
    database: configModule.projectConfig.database_database,
    url: configModule.projectConfig.database_url,
    schema: configModule.projectConfig.database_schema,
    logging: configModule.projectConfig.database_logging

  }

  if (configModule.projectConfig.database_host) {
    hostConfig = {
      host: configModule.projectConfig.database_host,
      port: configModule.projectConfig.database_port,
      database: configModule.projectConfig.database_database,
      schema: configModule.projectConfig.database_schema,
      logging: configModule.projectConfig.database_logging,
      ssl: configModule.projectConfig.database_ssl,
      username: configModule.projectConfig.database_username,
      password: configModule.projectConfig.database_password,
    }
  }

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    ...hostConfig,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: enabledMigrations,
    logging: configModule?.projectConfig.database_logging,
  })

  if (args[0] === "run") {
    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert") {
    await connection.undoLastMigration({ transaction: "all" })
    await connection.close()
    Logger.info("Migrations reverted.")
    process.exit()
  } else if (args[0] === "show") {
    const unapplied = await connection.showMigrations()
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
