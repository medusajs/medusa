import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"
import { AuthIdentity } from "@medusajs/auth/dist/models"

export const joinerConfig = defineJoinerConfig(Modules.CUSTOMER, {
  entityQueryingConfig: [AuthIdentity],
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
