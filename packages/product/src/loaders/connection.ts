import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as ProductModels from "../models"
import { EntitySchema } from "@mikro-orm/core"

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

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    entities,
    container,
    options,
    moduleDeclaration,
    logger,
  })
}
