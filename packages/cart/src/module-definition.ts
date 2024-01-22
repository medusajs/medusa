import { ModuleExports } from "@medusajs/types"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import { CartModuleService } from "./services"

const service = CartModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
