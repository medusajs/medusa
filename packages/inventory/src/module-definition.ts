import * as InventoryModels from "./models"

import { revertMigration, runMigrations } from "./scripts"

import InventoryService from "./services/inventory"
import { ModuleExports } from "@medusajs/types"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import migrations from "./migrations.old"

const service = InventoryService
const loaders = [loadContainer, loadConnection]
const models = Object.values(InventoryModels)

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  // models,
  runMigrations,
  revertMigration,
  // migrations,
}
