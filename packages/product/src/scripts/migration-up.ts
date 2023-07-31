import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import * as ProductModels from "@models"
import { EntitySchema } from "@mikro-orm/core"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"

/**
 * This script is only valid for mikro orm managers. If a user provide a custom manager
 * he is in charge of running the migrations.
 * @param options
 * @param logger
 * @param moduleDeclaration
 */
export async function runMigrations({
  options,
  logger,
}: Pick<
  LoaderOptions<
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  >,
  "options" | "logger"
> = {}) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig("product", options)
  const entities = Object.values(ProductModels) as unknown as EntitySchema[]

  const orm = await DALUtils.mikroOrmCreateConnection(dbData, entities)

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(`Running pending migrations: ${pendingMigrations}`)

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Product module migration executed")
  } catch (error) {
    logger.error(`Product module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
