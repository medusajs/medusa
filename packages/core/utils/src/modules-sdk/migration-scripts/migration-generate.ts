import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { setTimeout } from "timers/promises"
import { mikroOrmCreateConnection } from "../../dal"
import { loadDatabaseConfig } from "../load-module-database-config"
import { Migrations } from "../../migrations"
import { toMikroOrmEntities } from "../../dml"
import { kebabCase } from "../../common/to-kebab-case"

const TERMINAL_SIZE = process.stdout.columns

/**
 * Utility function to build a migration generation script that will generate the migrations.
 * Only used in mikro orm based modules.
 * @param moduleName
 * @param models
 * @param pathToMigrations
 */
export function buildGenerateMigrationScript({
  moduleName,
  models,
  pathToMigrations,
}) {
  /**
   * This script is only valid for mikro orm managers. If a user provide a custom manager
   * he is in charge of running the migrations.
   * @param options
   * @param logger
   * @param moduleDeclaration
   */
  return async function (
    { options, logger } = {} as Pick<
      LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
      "options" | "logger"
    >
  ) {
    logger ??= console as unknown as Logger

    logger.info(new Array(TERMINAL_SIZE).join("-"))
    logger.info("")
    logger.info(`MODULE: ${moduleName}`)

    const dbData = loadDatabaseConfig(moduleName, options)!

    const normalizedModels = toMikroOrmEntities(models)
    const orm = await mikroOrmCreateConnection(
      {
        ...dbData,
        snapshotName: `.snapshot-${kebabCase(
          moduleName.replace("Service", "")
        )}`,
      },
      normalizedModels,
      pathToMigrations
    )

    const migrations = new Migrations(orm)

    try {
      const { fileName } = await migrations.generate()
      if (fileName) {
        logger.info(`Generated successfully (${fileName}).`)

        // Add a 1-second delay after creating a migration file to ensure unique
        // timestamps across modules. MikroORM uses second-precision timestamps
        // (YYYYMMDDHHmmss format), so without this delay, multiple modules
        // processed within the same second would get identical migration filenames.
        // The delay is only added when a migration is actually created, not when
        // skipped due to no schema changes.
        // See: https://github.com/medusajs/medusa/issues/14410
        await setTimeout(1000)
      } else {
        logger.info(`Skipped. No changes detected in your models.`)
      }
    } catch (error) {
      logger.error(`Failed with error ${error.message}`, error)
    }
  }
}
