import { RegionModuleService } from "./services"
import loadDefaults from "./loaders/defaults"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.REGION, {
  service: RegionModuleService,
  loaders: [loadDefaults],
})
