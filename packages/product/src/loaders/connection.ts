import { asValue } from "awilix"

import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import { MedusaError } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"

import * as ProductModels from "@models"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { createConnection, loadDatabaseConfig } from "../utils"

export default async (
  {
    options,
    container,
  }: LoaderOptions<
    | ProductServiceInitializeOptions
    | ProductServiceInitializeCustomDataLayerOptions
  >,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (
    moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
    moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    return
  }

  const customManager = (
    options as ProductServiceInitializeCustomDataLayerOptions
  )?.manager

  if (!customManager) {
    const dbData = loadDatabaseConfig(options)
    await loadDefault({ database: dbData, container })
  } else {
    container.register({
      manager: asValue(customManager),
    })
  }
}

async function loadDefault({ database, container }) {
  if (!database) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(ProductModels) as unknown as EntitySchema[]

  const orm = await createConnection(database, entities)

  container.register({
    manager: asValue(orm.em.fork()),
  })
}
