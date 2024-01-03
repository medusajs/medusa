import { ModuleExports } from "@medusajs/types"
import { CartModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = CartModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
