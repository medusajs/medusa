import { ModuleExports } from "@medusajs/types"
import { CustomerModuleService } from "@services"

const service = CustomerModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
