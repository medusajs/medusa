import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"
import {
  Fulfillment,
  FulfillmentSet,
  ShippingOption,
  ShippingOptionRule,
} from "@models"

export const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
  linkableKeys: {
    fulfillment_id: Fulfillment.name,
    fulfillment_set_id: FulfillmentSet.name,
    shipping_option_id: ShippingOption.name,
    shipping_option_rule_id: ShippingOptionRule.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
