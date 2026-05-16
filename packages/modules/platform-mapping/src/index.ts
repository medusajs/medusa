import { Module, Modules } from "@medusajs/framework/utils"
import { PlatformMappingModuleService } from "./services/platform-mapping-module-service"

export default Module(Modules.PLATFORM_MAPPING, {
  service: PlatformMappingModuleService,
})
