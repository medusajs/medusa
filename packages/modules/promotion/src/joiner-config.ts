import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { generateLinkableKeysMap } from "@medusajs/utils"
import { Campaign, Promotion, PromotionRule } from "@models"

export const LinkableKeys = {
  promotion_id: Promotion.name,
  campaign_id: Campaign.name,
  promotion_rule_id: PromotionRule.name,
}

export const entityNameToLinkableKeysMap = generateLinkableKeysMap(LinkableKeys)

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PROMOTION,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["promotion", "promotions"],
      args: {
        entity: Promotion.name,
      },
    },
    {
      name: ["campaign", "campaigns"],
      args: {
        entity: Campaign.name,
        methodSuffix: "Campaigns",
      },
    },
    {
      name: ["promotion_rule", "promotion_rules"],
      args: {
        entity: PromotionRule.name,
        methodSuffix: "PromotionRules",
      },
    },
  ],
}
