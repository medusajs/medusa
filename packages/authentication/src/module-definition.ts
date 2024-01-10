import { ModuleExports } from "@medusajs/types"
import { AuthenticationModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import loadProviders from "./loaders/providers"

const service = AuthenticationModuleService
const loaders = [loadContainer, loadConnection, loadProviders] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
