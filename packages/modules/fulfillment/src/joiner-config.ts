import { Modules } from "@medusajs/modules-sdk"
import {
  Fulfillment,
  FulfillmentProvider,
  FulfillmentSet,
  GeoZone,
  ServiceZone,
  ShippingOption,
  ShippingOptionRule,
  ShippingProfile,
} from "@models"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
} from "@medusajs/utils/src"

export const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
  publicEntityObject: [
    FulfillmentSet,
    ShippingOption,
    ShippingProfile,
    Fulfillment,
    FulfillmentProvider,
    ServiceZone,
    GeoZone,
    ShippingOptionRule,
  ],
})

export const entityNameToLinkableKeysMap = buildEntitiesNameToLinkableKeysMap(
  joinerConfig.linkableKeys
)
