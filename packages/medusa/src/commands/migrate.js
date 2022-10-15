import { createConnection } from "typeorm"
import featureFlagLoader from "../loaders/feature-flags"
import configModuleLoader from "../loaders/config"
import Logger from "../loaders/logger"

import getMigrations from "./utils/get-migrations"

const t = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const configModule = configModuleLoader(directory)

  const featureFlagRouter = featureFlagLoader(configModule)

  const { coreMigrations } = await getMigrations(directory, featureFlagRouter)

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: coreMigrations,
    logging: true,
  })

  if (args[0] === "run") {
    let pluginMigrations = []
    for (const moduleResolution of Object.values(
      configModule.moduleResolutions
    )) {
      const loadedModule = await import(moduleResolution.resolutionPath)
      const migrations = loadedModule.migrations || []
      pluginMigrations = pluginMigrations.concat(migrations)
    }

    for (const migration of pluginMigrations) {
      console.log("Running migration", migration)
      await migration.up({ configModule })
    }

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
