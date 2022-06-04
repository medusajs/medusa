import { createConnection } from "typeorm"
import { getConfigFile } from "medusa-core-utils"

import Logger from "../loaders/logger"

import getMigrations from "./utils/get-migrations"

const t = async function({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const { configModule } = getConfigFile(directory, `medusa-config`)
  const migrationDirs = getMigrations(directory)

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    //url: configModule.projectConfig.database_url,
    url:configModule.projectConfig.database_url?configModule.projectConfig.database_url:undefined,
    ...{
        host:configModule.projectConfig.host,
        port:configModule.projectConfig.port,
        database:configModule.projectConfig.database_database,
        ssl:configModule.projectConfig.ssl,
        //host:process.env.RDS_HOSTNAME,
        //port:process.env.RDS_PORT,
        username:configModule.projectConfig.username,
        password: await configModule.projectConfig.password,
    },
    extra: configModule.projectConfig.database_extra || {},
    migrations: migrationDirs,
    logging: true,
  })

  if (args[0] === "run") {
    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "show") {
    const unapplied = await connection.showMigrations()
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
