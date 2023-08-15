import * as InventoryModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { Logger } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { ModuleServiceInitializeOptions } from "@medusajs/types"

export async function revertMigration(
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
    await migrator.down()

    logger?.info("Inventory module migration reverted")
  } catch (error) {
    logger?.error(
      `Inventory module migration failed to revert - Error: ${error}`
    )
  }

  await orm.close()
}
