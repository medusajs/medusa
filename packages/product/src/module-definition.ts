import { ModuleExports } from "@medusajs/types"
import { GatewayService } from "@services"
import loadContainer from "./loaders/container"
import loadConnection from "./loaders/connection"
import * as ProductModels from "@models"
import { revertMigration, runMigrations } from "./scripts"

const service = GatewayService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  models,
  runMigrations,
  revertMigration,
}
