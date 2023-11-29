import { ModuleExports } from "@medusajs/types"
import { PricingModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import { revertMigration, runMigrations } from "./scripts"

const service = PricingModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
