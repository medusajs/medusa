import { Module } from "@medusajs/framework/utils"
import { BrandModuleService } from "./services/brand-module-service"

export default Module("brand", {
  service: BrandModuleService,
})
