import * as PricingModels from "@models"

import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"

import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"

/**
 * This script is only valid for mikro orm managers. If a user provide a custom manager
 * he is in charge of reverting the migrations.
 * @param options
 * @param logger
 * @param moduleDeclaration
 */
export async function revertMigration({
  options,
  logger,
}: Pick<
  LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
  "options" | "logger"
> = {}) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig("pricing", options)!
  const entities = Object.values(PricingModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  try {
    const migrator = orm.getMigrator()
    await migrator.down()

    logger?.info("Pricing module migration executed")
  } catch (error) {
    logger?.error(`Pricing module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
