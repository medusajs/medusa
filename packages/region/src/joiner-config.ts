import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { Country, Currency, Region } from "@models"

export const LinkableKeys = {
  region_id: Region.name,
  currency_code: Country.name,
  country_id: Region.name,
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
  serviceName: Modules.REGION,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["region", "regions"],
      args: { entity: Region.name },
    },
    {
      name: ["currency", "currencies"],
      args: { entity: Currency.name },
    },
    {
      name: ["country", "countries"],
      args: { entity: Country.name },
    },
  ],
} as ModuleJoinerConfig
