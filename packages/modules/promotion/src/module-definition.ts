import { ModuleExports } from "@medusajs/types"
import { PromotionModuleService } from "@services"

const service = PromotionModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
