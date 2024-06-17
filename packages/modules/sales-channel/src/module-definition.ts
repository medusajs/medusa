import { ModuleExports } from "@medusajs/types"
import { SalesChannelModuleService } from "@services"

const service = SalesChannelModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
