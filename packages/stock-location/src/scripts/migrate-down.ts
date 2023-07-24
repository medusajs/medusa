import * as StockModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { Logger } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { createConnection } from "../utils/create-connection"

export async function revertMigration(
  { options, logger }: Pick<LoaderOptions, "options" | "logger">,
  moduleDeclaration?: InternalModuleDeclaration
) {
  logger ??= console as unknown as Logger

  const dbData = ModulesSdkUtils.loadDatabaseConfig("stock-location", options)

  const entities = Object.values(StockModels) as unknown as EntitySchema[]

  const orm = await createConnection(dbData, entities)

  try {
    const migrator = orm.getMigrator()
    await migrator.down()

    logger?.info("Stock location module migration reverted")
  } catch (error) {
    logger?.error(
      `Stock location module migration failed to revert - Error: ${error}`
    )
  }

  await orm.close()
}
