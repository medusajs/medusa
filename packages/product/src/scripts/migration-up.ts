import { LoaderOptions, Logger } from "@medusajs/types"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { createConnection, loadDatabaseConfig } from "../utils"
import * as ProductModels from "@models"
import { EntitySchema } from "@mikro-orm/core"

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
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions
  >,
  "options" | "logger"
> = {}) {
  logger ??= console as unknown as Logger

  const dbData = loadDatabaseConfig(options)
  const entities = Object.values(ProductModels) as unknown as EntitySchema[]

  const orm = await createConnection(dbData, entities)

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info("Running pending migrations:", pendingMigrations)

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Product module migration executed")
  } catch (error) {
    logger.error(`Product module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
