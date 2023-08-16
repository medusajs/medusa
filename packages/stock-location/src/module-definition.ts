import StockLocationService from "./services/stock-location"
import loadConnection from "./loaders/connection"
import * as StockLocationModels from "./models"
import { ModuleExports } from "@medusajs/types"
import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"

const service = StockLocationService
const loaders = [loadConnection]
const models = Object.values(StockLocationModels)

export const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}
