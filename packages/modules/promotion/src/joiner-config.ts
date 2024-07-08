import { defineJoinerConfig, Modules } from "@medusajs/utils"
import { Campaign, Promotion, PromotionRule } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PROMOTION, {
  models: [Promotion, Campaign, PromotionRule],
})
