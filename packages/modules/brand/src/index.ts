import { Module, Modules } from "@medusajs/framework/utils"
import { BrandModuleService } from "./services/brand-module-service"

export default Module(Modules.BRAND, {
  service: BrandModuleService,
})
