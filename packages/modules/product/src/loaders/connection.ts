import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as ProductModels from "../models"

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
  const entities = Object.values(ProductModels) as unknown as EntitySchema[]
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
