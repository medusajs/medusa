import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"
import { Migrations } from "../../migrations"
import { MedusaError } from "../../common/errors"

const TERMINAL_SIZE = process.stdout.columns

/**
 * Utility function to build a migration script that will revert the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param pathToMigrations
 */
export function buildRevertMigrationScript({ moduleName, pathToMigrations }) {
  /**
   * This script is only valid for mikro orm managers. If a user provide a custom manager
   * he is in charge of reverting the migrations.
   * @param options
   * @param logger
   * @param moduleDeclaration
   */
  return async function ({
    options,
    logger,
    migrationNames,
  }: Pick<
    LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
    "options" | "logger"
  > & { migrationNames?: string[] }) {
    logger ??= console as unknown as Logger

    logger.info(new Array(TERMINAL_SIZE).join("-"))
    logger.info("")
    logger.info(`MODULE: ${moduleName}`)

    const dbData = loadDatabaseConfig(moduleName, options)!
    const orm = await mikroOrmCreateConnection(dbData, [], pathToMigrations)
    const migrations = new Migrations(orm)

    migrations.on("reverting", (migration) => {
      logger.info(`  ● Reverting ${migration.name}`)
    })
    migrations.on("reverted", (migration) => {
      logger.info(`  ✔ Reverted ${migration.name}`)
    })
    migrations.on("revert:skipped", (migration) => {
      logger.info(`  ✔ Skipped ${migration.name}. ${migration.reason}`)
    })

    try {
      const revertOptions = migrationNames?.length
        ? { step: migrationNames.length }
        : undefined
      const result = await migrations.revert(revertOptions as any)
      if (result.length) {
        logger.info("Reverted successfully")
      } else {
        logger.info("Skipped. Nothing to revert")
      }
    } catch (error) {
      logger.error(`Failed with error ${error.message}`, error)
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        error.message,
        error.code
      )
    }
  }
}
