import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"
import { Campaign, Promotion, PromotionRule } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PROMOTION, {
  entityQueryingConfig: [Promotion, Campaign, PromotionRule],
  linkableKeys: {
    promotion_id: Promotion.name,
    campaign_id: Campaign.name,
    promotion_rule_id: PromotionRule.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
