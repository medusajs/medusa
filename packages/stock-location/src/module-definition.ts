import { ModuleExports } from "@medusajs/types"
import StockLocationService from "./services/stock-location"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import { revertMigration, runMigrations } from "./scripts"

const service = StockLocationService
const loaders = [loadContainer, loadConnection]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
