import { ModuleExports } from "@medusajs/types"
import { AuthenticationModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = AuthenticationModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
