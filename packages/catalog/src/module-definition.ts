import { ModuleExports } from "@medusajs/types"
import { CatalogModuleService } from "@services"

const service = CatalogModuleService
const loaders = [] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
