import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.FILE, {
  entityQueryingConfig: [{ name: "File" }],
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap({})
