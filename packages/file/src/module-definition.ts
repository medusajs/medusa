import { ModuleExports } from "@medusajs/types"
import { FileModuleService } from "@services"
import loadProviders from "./loaders/providers"

export const runMigrations = () => {
  return Promise.resolve()
}
export const revertMigration = () => {
  return Promise.resolve()
}

const service = FileModuleService
const loaders = [loadProviders] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
