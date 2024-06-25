import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"

// TODO: review configuration
export const joinerConfig = defineJoinerConfig(Modules.ORDER)

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
