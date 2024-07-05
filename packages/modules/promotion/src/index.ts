import { Module, Modules } from "@medusajs/utils"
import { PromotionModuleService } from "@services"

export default Module(Modules.PROMOTION, {
  service: PromotionModuleService,
})
