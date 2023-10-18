import { ModuleExports } from "@medusajs/types"
import { SearchModuleService } from "@services"
import connectionLoader from "./loaders/connection"
import containerLoader from "./loaders/container"

const service = SearchModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
