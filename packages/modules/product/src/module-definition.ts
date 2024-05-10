import { ModuleExports } from "@medusajs/types"
import { ProductModuleService } from "@services"

const service = ProductModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
