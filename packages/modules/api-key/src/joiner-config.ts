import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import ApiKey from "./models/api-key"

export const LinkableKeys: Record<string, string> = {
  api_key_id: ApiKey.name,
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
  serviceName: Modules.API_KEY,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["api_key", "api_keys"],
      args: { entity: ApiKey.name },
    },
  ],
} as ModuleJoinerConfig
