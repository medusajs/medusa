import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"
import { Migrations } from "../../migrations"

/**
 * Utility function to build a migration script that will run the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param pathToMigrations
 */
export function buildMigrationScript({ moduleName, pathToMigrations }) {
  /**
   * This script is only valid for mikro orm managers. If a user provide a custom manager
   * he is in charge of running the migrations.
   * @param options
   * @param logger
   * @param moduleDeclaration
   */
  return async function ({
    options,
    logger,
  }: Pick<
    LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
    "options" | "logger"
  > = {}) {
    logger ??= console as unknown as Logger

    logger.info(`Running migrations for module ${moduleName}`)

    const dbData = loadDatabaseConfig(moduleName, options)!
    const orm = await mikroOrmCreateConnection(dbData, [], pathToMigrations)
    const migrations = new Migrations(orm)

    migrations.on("migrating", (migration) => {
      logger.info(`  Running migration ${migration.name}`)
    })
    migrations.on("migrated", (migration) => {
      logger.info(`  Executed migration ${migration.name}`)
    })

    try {
      await migrations.run()
    } catch (error) {
      logger.error(`Migrations failed for module ${moduleName}`, error)
    }
  }
}
