import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { TaxProvider, TaxRate, TaxRateRule, TaxRegion } from "@models"

export const LinkableKeys: Record<string, string> = {
  tax_rate_id: TaxRate.name,
  tax_region_id: TaxRegion.name,
  tax_rate_rule_id: TaxRateRule.name,
  tax_provider_id: TaxProvider.name,
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
  serviceName: Modules.TAX,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["tax_rate", "tax_rates"],
      args: {
        entity: TaxRate.name,
      },
    },
    {
      name: ["tax_region", "tax_regions"],
      args: {
        entity: TaxRegion.name,
        methodSuffix: "TaxRegions",
      },
    },
    {
      name: ["tax_rate_rule", "tax_rate_rules"],
      args: {
        entity: TaxRateRule.name,
        methodSuffix: "TaxRateRules",
      },
    },
    {
      name: ["tax_provider", "tax_providers"],
      args: {
        entity: TaxProvider.name,
        methodSuffix: "TaxProviders",
      },
    },
  ],
} as ModuleJoinerConfig
