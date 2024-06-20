import { ModuleExports } from "@medusajs/types"
import { CustomerModuleService } from "@services"

const moduleDefinition: ModuleExports = {
  service: CustomerModuleService,
}
export default moduleDefinition
