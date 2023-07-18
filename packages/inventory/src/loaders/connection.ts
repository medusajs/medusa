import * as InventoryModels from "../models"

import { DataSource, DataSourceOptions } from "typeorm"
import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"

import { InventoryItem } from "../models/test"
import { InventoryServiceInitializeOptions } from "../types"
import { MedusaError } from "@medusajs/utils"
import { asValue } from "awilix"
import { createConnection } from "../utils/create-connection"
import { moduleDefinition } from "../module-definition"

export default async (
  { options, container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (
    moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
    moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
  ) {
    const { projectConfig } = container.resolve("configModule")
    return await loadDefault({
      database: {
        clientUrl: projectConfig.database_url,
        driverOptions: {
          connection: { ssl: false },
        },
      },
      container,
    })
  }

  const dbData =
    options?.database as InventoryServiceInitializeOptions["database"]

  if (!dbData) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(InventoryModels)
  const dataSource = new DataSource({
    type: dbData.type,
    url: dbData.url,
    database: dbData.database,
    extra: dbData.extra || {},
    schema: dbData.schema,
    entities,
    logging: dbData.logging,
  } as DataSourceOptions)

  await dataSource.initialize()

  container.register({
    manager: asValue(dataSource.manager),
  })
}

async function loadDefault({ database, container }) {
  if (!database) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = [InventoryItem]

  const orm = await createConnection(database, entities)

  container.register({
    manager: asValue(orm.em.fork()),
  })
}
