import loadConnection from "./loaders/connection"

import migrations from "./migrations"
import * as StockLocationModels from "./models"
import StockLocationService from "./services/stock-location"

import { ModuleExports } from "@medusajs/modules-sdk"

const service = StockLocationService
const loaders = [loadConnection]
const models = Object.values(StockLocationModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
