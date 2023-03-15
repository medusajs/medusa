import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import { DataSource, DataSourceOptions } from "typeorm"

import * as StockLocationModels from "../models"
import { MedusaError } from "medusa-core-utils"
import { asValue } from "awilix"

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

  const dbData = options?.database as Record<string, string>

  if (!dbData) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Database config is not present at module config "options.database"`
    )
  }

  const entities = Object.values(StockLocationModels)
  const dataSource = new DataSource({
    type: dbData.database_type,
    url: dbData.database_url,
    database: dbData.database_database,
    extra: dbData.database_extra || {},
    schema: dbData.database_schema,
    entities,
    logging: dbData.database_logging,
  } as DataSourceOptions)

  await dataSource.initialize()

  container.register({
    manager: asValue(dataSource.manager),
  })
}
