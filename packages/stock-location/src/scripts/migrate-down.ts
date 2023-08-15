import * as StockModels from "../models"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  Logger,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

import { EntitySchema } from "@mikro-orm/core"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { createConnection } from "../utils/create-connection"

export async function revertMigration(
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
    await migrator.down()

    logger?.info("Stock location module migration reverted")
  } catch (error) {
    logger?.error(
      `Stock location module migration failed to revert - Error: ${error}`
    )
  }

  await orm.close()
}
