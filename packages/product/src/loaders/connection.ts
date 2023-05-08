import { asValue } from "awilix"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import { MedusaError } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql"

import * as ProductModels from "../model"
import { ProductServiceInitializeOptions } from "../types"

export default async (
  { options, container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (
    moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
    moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    return
  }

  const dbData =
    options?.database as ProductServiceInitializeOptions["database"]

  if (!dbData) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(ProductModels) as unknown as EntitySchema[]

  const orm = await MikroORM.init<PostgreSqlDriver>({
    entitiesTs: entities,
    dbName: dbData.name,
    type: "postgresql",
  })

  container.register({
    manager: asValue(orm.em),
  })
}
