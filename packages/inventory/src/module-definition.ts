import InventoryService from "./services/inventory"
import loadContainer from "./loaders/container"
import loadConnection from "./loaders/connection"
import * as InventoryModels from "./models"
import { ModuleExports } from "@medusajs/types"
import migrations from "./migrations"
import { revertMigration, runMigrations } from "./migrations/run-migration"

const service = InventoryService
const loaders = [loadContainer, loadConnection]
const models = Object.values(InventoryModels)

export const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
  runMigrations,
  revertMigration,
}
