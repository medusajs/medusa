import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

import InventoryService from "./services/inventory"
import * as InventoryModels from "./models"
import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"

import { ModuleExports } from "@medusajs/modules-sdk"

const services = [InventoryService]
const loaders = [loadContainer, loadConnection]
const models = Object.values(InventoryModels)

const moduleDefinition: ModuleExports = {
  services,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}

export default moduleDefinition

export * from "./types"
export * from "./initialize"
