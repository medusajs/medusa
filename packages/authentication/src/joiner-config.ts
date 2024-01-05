import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { AuthUser } from "@models"

export const LinkableKeys = {
  auth_user_id: AuthUser.name,
}

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.AUTHENTICATION,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: {
    name: ["auth_user", "auth_users"],
    args: {
      entity: AuthUser.name,
    },
  },
}
