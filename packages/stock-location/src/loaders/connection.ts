import {
  ConfigurableModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
} from "@medusajs/medusa"
import { ConnectionOptions, createConnection } from "typeorm"
import { CONNECTION_NAME } from "../config"

import { StockLocation, StockLocationAddress } from "../models"

export default async (
  { configModule }: LoaderOptions,
  moduleDeclaration?: ConfigurableModuleDeclaration
): Promise<void> => {
  // Do not connect to the database if using shared resources with the Core
  if (moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.SHARED) {
    return
  }

  await createConnection({
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    schema: configModule.projectConfig.database_schema,
    extra: configModule.projectConfig.database_extra || {},
    entities: [StockLocation, StockLocationAddress],
    logging: configModule.projectConfig.database_logging || false,
  } as ConnectionOptions)
}
