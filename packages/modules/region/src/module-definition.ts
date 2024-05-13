import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "./services"
import loadDefaults from "./loaders/defaults"

const service = RegionModuleService
const loaders = [loadDefaults]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
