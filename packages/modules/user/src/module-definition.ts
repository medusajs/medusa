import { UserModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"

const service = UserModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
