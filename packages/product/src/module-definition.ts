import { ModuleExports } from "@medusajs/types"
import { ProductModuleService } from "@services"
import loadContainer from "./loaders/container"
import loadConnection from "./loaders/connection"

const service = ProductModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
