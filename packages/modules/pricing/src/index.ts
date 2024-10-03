import { Module, Modules } from "@medusajs/framework/utils"
import { PricingModuleService } from "@services"

export default Module(Modules.PRICING, {
  service: PricingModuleService,
})

export * from "./types"
