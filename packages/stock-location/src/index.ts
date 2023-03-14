import ConnectionLoader from "./loaders/connection"
import StockLocationService from "./services/stock-location"
import * as SchemaMigration from "./migrations/schema-migrations/1665749860179-setup"
import * as StockLocationModels from "./models"
import { ModuleExports } from "@medusajs/medusa"

const service = StockLocationService
const migrations = [SchemaMigration]
const loaders = [ConnectionLoader]

const models = Object.values(StockLocationModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
