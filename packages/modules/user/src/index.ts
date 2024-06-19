import { UserModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"

const moduleDefinition: ModuleExports = {
  service: UserModuleService,
}
export default moduleDefinition
