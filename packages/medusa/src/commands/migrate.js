import { createConnection } from "typeorm"
import configLoader from "../loaders/config"
import Logger from "../loaders/logger"

import getMigrations from "./utils/get-migrations"

const t = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()
  const configModule = await configLoader(directory)
  const migrationDirs = await Promise.resolve(getMigrations(directory))
  let hostConfig = {
    database: configModule.projectConfig.database_database,
    url: configModule.projectConfig.database_url,
  }

  if (configModule.projectConfig.database_host) {
    hostConfig = {
      host: configModule.projectConfig.database_host,
      port: configModule.projectConfig.database_port,
      database: configModule.projectConfig.database_database,
      ssl: configModule.projectConfig.database_ssl,
      username: configModule.projectConfig.database_username,
      password: configModule.projectConfig.database_password,
    }
  }

  let connection = undefined
  if (configModule) {
    connection = await createConnection({
      type: configModule.projectConfig.database_type,
      /** this gives the option of either using a url or using individual components. 
    For dynamic passowords one needs to use the individual database url components */
      ...hostConfig,
      extra: configModule?.projectConfig.database_extra || {},
      migrations: migrationDirs,
      logging: true,
    })
  }

  if (args[0] === "run" && connection) {
    await connection?.runMigrations()
    await connection?.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "revert" && connection) {
    await connection.undoLastMigration({ transaction: "all" })
    await connection.close()
    Logger.info("Migrations reverted.")
    process.exit()
  } else if (args[0] === "show" && connection) {
    const unapplied = await connection.showMigrations()
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
