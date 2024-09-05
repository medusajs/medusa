import { defineJoinerConfig, Modules } from "@medusajs/utils"
import {
  Fulfillment,
  FulfillmentSet,
  ShippingOption,
  ShippingOptionRule,
} from "@models"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
  schema,
  linkableKeys: {
    fulfillment_id: Fulfillment.name,
    fulfillment_set_id: FulfillmentSet.name,
    shipping_option_id: ShippingOption.name,
    shipping_option_rule_id: ShippingOptionRule.name,
  },
})
