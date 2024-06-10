import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
} from "@medusajs/utils/src"
import { FulfillmentSet } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.FULFILLMENT, {
  mainEntity: FulfillmentSet,
})

export const entityNameToLinkableKeysMap = buildEntitiesNameToLinkableKeysMap(
  joinerConfig.linkableKeys
)
