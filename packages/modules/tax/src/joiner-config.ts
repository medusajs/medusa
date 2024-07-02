import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.TAX)

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
