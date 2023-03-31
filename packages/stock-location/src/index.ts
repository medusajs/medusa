import { ModuleExports } from "@medusajs/modules-sdk"
import loadConnection from "./loaders/connection"
import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"
import * as StockLocationModels from "./models"
import StockLocationService from "./services/stock-location"

const service = StockLocationService
const loaders = [loadConnection]
const models = Object.values(StockLocationModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}

export default moduleDefinition
export * from "./initialize"
export { revertMigration, runMigrations } from "./migrations/run-migration"
export * from "./types"
