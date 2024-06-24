import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "./services"
import loadDefaults from "./loaders/defaults"

const moduleDefinition: ModuleExports = {
  service: RegionModuleService,
  loaders: [loadDefaults],
}
export default moduleDefinition
