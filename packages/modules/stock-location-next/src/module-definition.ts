import { StockLocationModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"

const service = StockLocationModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
