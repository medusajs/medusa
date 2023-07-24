import * as StockLocationModels from "../models"

import { DataSource, DataSourceOptions } from "typeorm"
import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import { MedusaError, ModulesSdkUtils } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"
import { ModulesSdkTypes } from "@medusajs/types"
import { StockLocationServiceInitializeOptions } from "../types"
import { asValue } from "awilix"
import { createConnection } from "../utils/create-connection"

export default async (
  { options, container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL) {
    const { projectConfig } = container.resolve("configModule")
    options = {
      database: {
        clientUrl: projectConfig.database_url!,
      },
    }
  }

  const customManager = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.manager

  if (!customManager) {
    const dbData = ModulesSdkUtils.loadDatabaseConfig("stock_location", options)
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

  const entities = Object.values(
    StockLocationModels
  ) as unknown as EntitySchema[]

  console.log("entities", entities)

  const orm = await createConnection(database, entities)

  container.register({
    manager: asValue(orm.em.fork()),
  })
}
