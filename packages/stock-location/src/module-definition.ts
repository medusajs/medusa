import * as StockLocationModels from "./models"

import { revertMigration, runMigrations } from "./migrations/run-migration"

import { ModuleExports } from "@medusajs/types"
import StockLocationService from "./services/stock-location"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import migrations from "./migrations"

const service = StockLocationService
const loaders = [loadContainer, loadConnection]

const models = Object.values(StockLocationModels)

export const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}
