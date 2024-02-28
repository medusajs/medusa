import * as InventoryModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { ModulesSdkTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

export default async (
  {
    options,
    container,
    logger,
  }: LoaderOptions<
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  >,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const entities = Object.values(InventoryModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    moduleName: "product",
    entities,
    container,
    options,
    moduleDeclaration,
    logger,
    pathToMigrations,
  })
}
