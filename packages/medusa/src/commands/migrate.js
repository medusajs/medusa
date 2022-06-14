import { createConnection } from "typeorm"
import { getConfigFile } from "medusa-core-utils"

import Logger from "../loaders/logger"

import getMigrations from "./utils/get-migrations"

const t = async function({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  let configFile =getConfigFile(directory, `medusa-config`)
  let configuration = await Promise.resolve( configFile)
  let migrationDirs = await Promise.resolve(getMigrations(directory))
  let configModule= await Promise.resolve(configuration.configModule)
   let connection =undefined
  if(configModule)
  connection= await createConnection({
    type: configModule?.projectConfig.database_type,
    //url: configModule.projectConfig.database_url,
    url:configModule?.projectConfig.database_url?configModule.projectConfig.database_url:undefined,
    ...{
      host:configModule?.projectConfig.database_host??"",
      port:configModule?.projectConfig.database_port??"",
      database:configModule?.projectConfig.database_database??"",
      ssl:configModule?.projectConfig.database_ssl??{},
      username:configModule?.projectConfig.database_username??"",
      password: configModule?.projectConfig.database_password??"",
  },
    extra: configModule?.projectConfig.database_extra || {},
    migrations: migrationDirs,
    logging: true,
  })

  if (args[0] === "run" && connection) {
    await connection?.runMigrations()
    await connection?.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "show" && connection) {
    const unapplied = await connection?.showMigrations()
    await connection?.close()
    process.exit(unapplied ? 1 : 0)
  }
}

export default t
