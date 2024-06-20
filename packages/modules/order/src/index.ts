import { ModuleExports } from "@medusajs/types"
import { OrderModuleService } from "@services"

const service = OrderModuleService

export const moduleDefinition: ModuleExports = {
  service,
}

export * from "./models"
export * from "./services"
export * from "./types"

export default moduleDefinition
