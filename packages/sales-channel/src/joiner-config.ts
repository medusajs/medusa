import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { SalesChannel } from "@models"

export const LinkableKeys = {
  sales_channel_id: SalesChannel.name,
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

export default {
  serviceName: Modules.SALES_CHANNEL,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: "sales_channel",
      args: { entity: "SalesChannel" },
    },
    {
      name: "sales_channels",
      args: { entity: "SalesChannel" },
    },
  ],
} as ModuleJoinerConfig
