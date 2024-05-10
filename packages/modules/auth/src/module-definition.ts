import { AuthModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"
import loadProviders from "./loaders/providers"

const service = AuthModuleService
const loaders = [loadProviders] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
