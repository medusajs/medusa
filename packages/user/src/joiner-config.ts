import { Invite, User } from "@models"
import { MapToConfig } from "@medusajs/utils"
import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const LinkableKeys = {
  user_id: User.name,
  invite_id: Invite.name,
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
  serviceName: Modules.USER,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["user", "users"],
      args: {
        entity: User.name,
      },
    },
    {
      name: ["invite", "invites"],
      args: {
        entity: Invite.name,
        methodSuffix: "Invites",
      },
    },
  ],
}
