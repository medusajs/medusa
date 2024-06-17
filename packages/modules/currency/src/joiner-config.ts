import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import Currency from "./models/currency"

export const LinkableKeys: Record<string, string> = {
  code: Currency.name,
  currency_code: Currency.name,
  default_currency_code: Currency.name,
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
  serviceName: Modules.CURRENCY,
  primaryKeys: ["code"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["currency", "currencies"],
      args: { entity: Currency.name },
    },
  ],
} as ModuleJoinerConfig
