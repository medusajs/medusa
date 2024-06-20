import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"
import { Price, PriceList, PriceSet, RuleType } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PRICING, {
  entityQueryingConfig: [PriceSet, PriceList, Price, RuleType],
  linkableKeys: {
    price_set_id: PriceSet.name,
    price_list_id: PriceList.name,
    price_id: Price.name,
    rule_type_id: RuleType.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
