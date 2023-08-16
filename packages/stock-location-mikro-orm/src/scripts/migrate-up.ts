import * as StockModels from "../models"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  Logger,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

import { EntitySchema } from "@mikro-orm/core"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"

export async function runMigrations(
  { options, logger }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig(
    "stock-location",
    options as unknown as ModuleServiceInitializeOptions
  )

  const entities = Object.values(StockModels) as unknown as EntitySchema[]

  const orm = await DALUtils.mikroOrmCreateConnection(dbData, entities, {
    dirname: __dirname,
  })

  try {
    const migrator = orm.getMigrator()

    logger.info(__dirname + "/../migrations")

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(
      `Running pending migrations: ${JSON.stringify(pendingMigrations)}`
    )

    await migrator.up({
      migrations: pendingMigrations.map((m) => m.name),
    })

    logger.info("Stock location module migration executed")
  } catch (error) {
    logger.error(
      `Stock location module migration failed to run - Error: ${error}`
    )
  }

  await orm.close()
}
