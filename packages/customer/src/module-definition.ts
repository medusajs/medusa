import { ModuleExports } from "@medusajs/types"
import { CustomerModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = CustomerModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
