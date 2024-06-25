import { AuthIdentity } from "@models"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.AUTH, {
  entityQueryingConfig: [AuthIdentity],
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
