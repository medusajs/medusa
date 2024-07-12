import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"
import { Migrations } from "../../migrations"

const TERMINAL_SIZE = process.stdout.columns

/**
 * Utility function to build a migration generation script that will generate the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param pathToMigrations
 */
export function buildGenerateMigrationScript({ moduleName, pathToMigrations }) {
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

    console.log(new Array(TERMINAL_SIZE).join("-"))
    console.log("")
    logger.info(`MODULE: ${moduleName}`)

    const dbData = loadDatabaseConfig(moduleName, options)!
    const orm = await mikroOrmCreateConnection(dbData, [], pathToMigrations)
    const migrations = new Migrations(orm)

    try {
      const { fileName } = await migrations.generate()
      if (fileName) {
        logger.info(`Generated successfully (${fileName}).`)
      } else {
        logger.info(`Skipped. No changes detected in your models.`)
      }
    } catch (error) {
      logger.error(`Failed with error ${error.message}`, error)
    }
  }
}
