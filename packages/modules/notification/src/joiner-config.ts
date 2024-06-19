import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.NOTIFICATION, {
  entityQueryingConfig: [{ name: "Notification" }],
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
