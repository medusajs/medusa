import { ModuleExports } from "@medusajs/types"
import { CartModuleService } from "./services"

const service = CartModuleService

export const moduleDefinition: ModuleExports = {
  service,
}
