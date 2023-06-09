import { ModuleExports } from "@medusajs/types"
import { ProductModuleService } from "@services"
import loadContainer from "./loaders/container"
import loadConnection from "./loaders/connection"
import * as ProductModels from "@models"
import { revertMigration, runMigrations } from "./scripts"

const service = ProductModuleService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  models,
  runMigrations,
  revertMigration,
}
