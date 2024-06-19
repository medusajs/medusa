import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"

// TODO: review configuration
export const joinerConfig = defineJoinerConfig(Modules.ORDER)

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
