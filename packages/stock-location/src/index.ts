import loadConnection from "./loaders/connection"

import StockLocationService from "./services/stock-location"
import * as StockLocationModels from "./models"
import migrations from "./migrations"

import { ModuleExports } from "@medusajs/modules-sdk"

const services = [StockLocationService]
const loaders = [loadConnection]
const models = Object.values(StockLocationModels)

const moduleDefinition: ModuleExports = {
  services,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
