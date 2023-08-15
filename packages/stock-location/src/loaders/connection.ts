import * as StockLocationModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { ModulesSdkUtils } from "@medusajs/utils"

export default async (
  { options, container, logger }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const entities = Object.values(
    StockLocationModels
  ) as unknown as EntitySchema[]

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    entities,
    container,
    options,
    moduleDeclaration,
    logger,
  })
}
