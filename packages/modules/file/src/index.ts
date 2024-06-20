import { ModuleExports } from "@medusajs/types"
import { FileModuleService } from "@services"
import loadProviders from "./loaders/providers"

const loaders = [loadProviders] as any

const service = FileModuleService
export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
