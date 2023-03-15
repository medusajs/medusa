import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

import migrations from "./migrations"
import * as InventoryModels from "./models"
import InventoryService from "./services/inventory"

import { ModuleExports } from "@medusajs/modules-sdk"

const service = InventoryService
const loaders = [loadContainer, loadConnection]
const models = Object.values(InventoryModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
