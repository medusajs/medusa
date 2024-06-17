import { ModuleExports } from "@medusajs/types"
import { ApiKeyModuleService } from "@services"

const service = ApiKeyModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
