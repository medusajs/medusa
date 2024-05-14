import { ModuleExports } from "@medusajs/types"
import { OrderModuleService } from "@services"

const service = OrderModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
