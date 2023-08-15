import * as InventoryModels from "../models"

import { EntitySchema } from "@mikro-orm/core"
import {
  Logger,
  ModuleServiceInitializeOptions,
  InternalModuleDeclaration,
  LoaderOptions,
} from "@medusajs/types"
import { ModulesSdkUtils, DALUtils } from "@medusajs/utils"
import { createConnection } from "../utils/create-connection"

export async function runMigrations(
  { options, logger }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "inventory",
    options as unknown as ModuleServiceInitializeOptions
  )

  const entities = Object.values(InventoryModels) as unknown as EntitySchema[]

  const orm = await DALUtils.mikroOrmCreateConnection(dbData, entities, {
    dirname: __dirname,
  })

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(
      `Running pending migrations: ${JSON.stringify(pendingMigrations)}`
    )

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Inventory module migration executed")
  } catch (error) {
    logger.error(`Inventory module migration failed to run - Error: ${error}`)
  }

  await orm.close()
}
