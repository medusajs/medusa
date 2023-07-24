import * as StockModels from "../models"

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

  const dbData = ModulesSdkUtils.loadDatabaseConfig("stock-location", options)

  const entities = Object.values(StockModels) as unknown as EntitySchema[]

  const orm = await createConnection(dbData, entities)

  try {
    const migrator = orm.getMigrator()

    const pendingMigrations = await migrator.getPendingMigrations()
    logger.info(`Running pending migrations: ${pendingMigrations}`)

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
