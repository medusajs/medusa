import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"
import { Campaign, Promotion, PromotionRule } from "@models"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.PROMOTION, {
  schema,
  models: [Promotion, Campaign, PromotionRule],
})
