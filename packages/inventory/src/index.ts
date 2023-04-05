import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"
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
  runMigrations,
  revertMigration,
}

export default moduleDefinition
export * from "./initialize"
export { revertMigration, runMigrations } from "./migrations/run-migration"
export * from "./types"
