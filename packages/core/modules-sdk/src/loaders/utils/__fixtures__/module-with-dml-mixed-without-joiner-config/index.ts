import { ModuleExports } from "@medusajs/types"
import { ModuleService } from "./services/module-service"

const moduleExports: ModuleExports = {
  service: ModuleService,
}

export * from "./models"
export * from "./services/module-service"

export default moduleExports
