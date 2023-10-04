import { ModuleExports } from "@medusajs/types"
import { CatalogModuleService } from "@services"
import { connectionLoader, containerLoader } from "./loaders"

const service = CatalogModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
