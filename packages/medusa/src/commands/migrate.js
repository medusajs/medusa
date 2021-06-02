import { createConnection } from "typeorm"
import _ from "lodash"

import Logger from "../loaders/logger"

import getMigrations from "./utils/get-migrations"

const t = async function({ port, directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const migrationDirs = getMigrations(directory)

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
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
