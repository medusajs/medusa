import { ModuleExports } from "@medusajs/types"
import { FileModuleService } from "@services"
import loadProviders from "./loaders/providers"
import * as ModuleServices from "@services"
import { ModulesSdkUtils } from "@medusajs/utils"

export const runMigrations = () => {
  return Promise.resolve()
}
export const revertMigration = () => {
  return Promise.resolve()
}

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: {},
  moduleRepositories: {},
  moduleServices: ModuleServices,
})

const loaders = [containerLoader, loadProviders] as any

const service = FileModuleService
export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
