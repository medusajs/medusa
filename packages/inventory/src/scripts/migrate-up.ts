import * as InventoryModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { Logger } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { createConnection } from "../utils/create-connection"

export async function runMigrations(
  { options, logger }: Pick<LoaderOptions, "options" | "logger">,
  moduleDeclaration?: InternalModuleDeclaration
) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig("product", options)

  const entities = Object.values(InventoryModels) as unknown as EntitySchema[]

  const orm = await createConnection(dbData, entities)

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(`Running pending migrations: ${pendingMigrations}`)

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Inventory module migration executed")
  } catch (error) {
    logger.error(`Inventory module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
