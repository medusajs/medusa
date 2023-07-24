import * as InventoryModels from "./models"

import { revertMigration, runMigrations } from "./scripts"

import InventoryService from "./services/inventory"
import { ModuleExports } from "@medusajs/types"
import loadModule from "./loaders"

const service = InventoryService
const loaders = [loadModule]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
