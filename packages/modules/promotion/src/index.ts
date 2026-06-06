import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { PromotionModuleService } from "@services"

export default Module(Modules.PROMOTION, {
  service: PromotionModuleService,
})
