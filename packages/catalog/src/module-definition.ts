import { ModuleExports } from "@medusajs/types"
import { CatalogModuleService } from "@services"
import connectionLoader from "./loaders/connection"
import containerLoader from "./loaders/container"

const service = CatalogModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
