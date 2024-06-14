import { ModuleExports } from "@medusajs/types"
import { AuthModuleService } from "@services"
import loadProviders from "./loaders/providers"

const moduleDefinition: ModuleExports = {
  service: AuthModuleService,
  loaders: [loadProviders] as any,
}
export default moduleDefinition
