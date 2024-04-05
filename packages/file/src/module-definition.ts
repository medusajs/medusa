import { ModuleExports } from "@medusajs/types"
import { FileModuleService } from "@services"
export const runMigrations = () => {
  return Promise.resolve()
}
export const revertMigration = () => {
  return Promise.resolve()
}

const service = FileModuleService
const loaders = [] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
