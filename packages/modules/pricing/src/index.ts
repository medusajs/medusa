import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { PricingModuleService } from "@services"

export default Module(Modules.PRICING, {
  service: PricingModuleService,
})

export * from "./types"
