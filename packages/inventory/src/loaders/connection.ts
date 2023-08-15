import * as InventoryModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"

export default async (
  { options, container, logger }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const entities = Object.values(InventoryModels) as unknown as EntitySchema[]

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    entities,
    container,
    options,
    moduleDeclaration,
    logger,
  })
}
