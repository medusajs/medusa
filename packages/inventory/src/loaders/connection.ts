import { ConfigModule } from "@medusajs/medusa"
import { ConnectionOptions, createConnection } from "typeorm"
import { CONNECTION_NAME } from "../config"

import {
  InventoryItem,
  InventoryLevel,
  Location,
  LocationAddress,
} from "../models"

export default async ({ configModule: ConfigModule }) => {
  await createConnection({
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra || {},
    entities: [InventoryLevel, InventoryItem, Location, LocationAddress],
    logging: configModule.projectConfig.database_logging || false,
  } as ConnectionOptions)
}
